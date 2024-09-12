from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
import numpy as np
import tensorflow as tf
import requests
import io

app = FastAPI()

class_names = ['Bean', 'Bitter_Gourd', 'Bottle_Gourd', 'Brinjal', 'Broccoli', 'Cabbage', 'Capsicum', 'Carrot', 'Cauliflower', 'Cucumber', 'Papaya', 'Potato', 'Pumpkin', 'Radish', 'Tomato']

class ImageURL(BaseModel):
    image_url: str

def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.resize((224, 224))  # Resize image to fit the model's input
    image = np.array(image) / 255.0  # Normalize pixel values to [0, 1]
    if image.shape[-1] == 4:  # Remove alpha channel if present
        image = image[..., :3]
    return image

def model_prediction(image: np.ndarray) -> dict:
    model = tf.keras.models.load_model("vegetables.keras")
    pred_probs = model.predict(image[np.newaxis, ...])[0]
    pred_index = np.argmax(pred_probs)
    pred_class = class_names[pred_index]
    pred_confidence = pred_probs[pred_index]  # Get the probability of the predicted class
    if float(pred_confidence) < 0.9:
        return {
            "predicted_class": "Unknown",
        }
    return {
        "predicted_class": pred_class,
        "confidence": float(pred_confidence),  # Convert to float for JSON serialization
    }

@app.post("/predict")
async def predict(payload: ImageURL):
    try:
        # Download and open the image from the URL
        response = requests.get(payload.image_url)
        response.raise_for_status()  
        image = Image.open(io.BytesIO(response.content))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not download or open the image.") from e

    # Preprocess and predict
    image_np = preprocess_image(image)
    prediction = model_prediction(image_np)

    return JSONResponse(content={"prediction": prediction})

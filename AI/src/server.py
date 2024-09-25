from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import tensorflow as tf
import io

app = FastAPI()

class_names = ['Bean', 'Bitter_Gourd', 'Bottle_Gourd', 'Brinjal', 'Broccoli', 'Cabbage', 'Capsicum', 'Carrot', 'Cauliflower', 'Cucumber', 'Papaya', 'Potato', 'Pumpkin', 'Radish', 'Tomato']

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
async def predict(image: UploadFile = File(...)):
    try:
        # Read the uploaded image file and convert it to PIL Image
        image_data = await image.read()
        image = Image.open(io.BytesIO(image_data))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not open the image file.") from e

    # Preprocess and predict
    image_np = preprocess_image(image)
    prediction = model_prediction(image_np)

    return JSONResponse(content={"prediction": prediction})

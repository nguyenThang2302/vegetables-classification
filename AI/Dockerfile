# Use an official Python runtime as a base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir fastapi pillow tensorflow google-generativeai uvicorn python-multipart

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI application with Uvicorn
CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000"]

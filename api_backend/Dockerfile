# Use Python 3.8.10 as base image
FROM python:3.8.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies for OCR and image processing
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    python3-dev \
    tesseract-ocr \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && apt-get clean

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the backend code
COPY . .

# Expose Flask port
EXPOSE 5000

# Start the backend
CMD ["python", "app.py"]

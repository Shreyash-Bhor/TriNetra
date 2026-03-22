from fastapi import APIRouter, UploadFile, File
from app.services.inference import run_inference

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    return run_inference(contents)
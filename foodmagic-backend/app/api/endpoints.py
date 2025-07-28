from fastapi import APIRouter, UploadFile, File
from typing import List
from app.services.generator import process_image, suggest_recipes

router = APIRouter()

@router.post("/process-image/")
async def process_image_endpoint(file: UploadFile = File(...)):
    return await process_image(file)

@router.post("/suggest-recipes/")
async def suggest_recipes_endpoint(ingredients: List[str]):
    return await suggest_recipes(ingredients)
from fastapi import HTTPException
from pydantic import BaseModel
from fastapi import APIRouter

import os, json

router = APIRouter()

@router.post("/favourite-persona")
async def favourite_persona(request: Request):
    try:
        favouriteId = request.json["userId"]
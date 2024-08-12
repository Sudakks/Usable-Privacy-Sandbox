from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import json, os

router = APIRouter()

@router.post("/identifychange")
async def identify_change(request: Request):
    try:
        data = await request.json()
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
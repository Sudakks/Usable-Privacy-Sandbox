from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import os, json

from loadpersona import load_single_persona

router = APIRouter()

@router.post("/newpersonalocalstorage")
async def newpersona_localstorage(request: Request):
    data = await request.json()
    userId = data.get("userId")

    try:
        persona = load_single_persona(userId)
        return persona
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
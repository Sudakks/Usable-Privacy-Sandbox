from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import os, json
from datetime import datetime, date

#from loadpersona import load_single_persona
from completepersonajson import complete_persona_json

router = APIRouter()

# @router.post("/newpersonalocalstorage")
# async def newpersona_localstorage(request: Request):
#     data = await request.json()
#     userId = data.get("userId")

#     try:
#         filename = f'persona{userId}.json'
#         persona = load_single_persona(filename)
#         return persona
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/newpersonalocalstorage")
async def newpersona_localstorage(request: Request):
    try:
        persona_json = await request.json()
    except JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    #persona_json = complete_persona_json(persona_json)
    localStorage_json = persona_json.get('data')
    del localStorage_json['browsing_history']
    del localStorage_json['schedule']
    localStorage_json['name'] = f"{localStorage_json['first_name']} {localStorage_json['last_name']}"
    localStorage_json['address'] = f"{localStorage_json['street']}, {localStorage_json['city']}, {localStorage_json['state']}, {localStorage_json['zip_code']}"
    birthday = datetime.strptime(localStorage_json['birthday'], "%m/%d/%Y").date()
    localStorage_json['birthday'] = birthday
    return localStorage_json
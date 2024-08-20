from fastapi import HTTPException
from pydantic import BaseModel
from fastapi import APIRouter

import os
import json
from datetime import datetime, date

router = APIRouter()

class Persona(BaseModel):
    userId: int
    first_name: str
    last_name: str
    name: str
    profileImgUrl: str
    age: str
    gender: str
    race: str
    street: str
    city: str
    state: str
    zip_code: str
    address: str
    spoken_language: str
    education_background: str
    birthday: date
    job: str
    income: str
    marital_status: str
    parental_status: str
    online_behavior: str
    profile: str
    browser: str
    device: str
    favourite: bool
    switch: dict

# 文件夹路径
persona_folder_path = "./personas"

# 读取 persona 文件夹中的所有 JSON 文件
def load_personas_from_folder(folder_path: str):
    personas = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, "r") as f:
                    data = json.load(f)
                    persona_info = data["data"]
                    name = f"{persona_info['first_name']} {persona_info['last_name']}"
                    birthday = datetime.strptime(persona_info['birthday'], "%m/%d/%Y").date()
                    address = f"{persona_info['street']}, {persona_info['city']}, {persona_info['state']}, {persona_info['zip_code']}"
                    persona = Persona(
                        userId=persona_info.get("userId", 0),
                        first_name=persona_info.get("first_name", ""),
                        last_name=persona_info.get("last_name", ""),
                        name=name,
                        profileImgUrl=".." + persona_info.get("profileImgUrl", ""),
                        age=persona_info.get("age", ""),
                        gender=persona_info.get("gender", ""),
                        race=persona_info.get("race", ""),
                        street=persona_info.get("street", ""),
                        city=persona_info.get("city", ""),
                        state=persona_info.get("state", ""),
                        zip_code=persona_info.get("zip_code", ""),
                        address=address,
                        spoken_language=persona_info.get("spoken_language", ""),
                        education_background=persona_info.get("education_background", ""),
                        birthday=birthday,
                        job=persona_info.get("job", ""),
                        income=persona_info.get("income", ""),
                        marital_status=persona_info.get("marital_status", ""),
                        parental_status=persona_info.get("parental_status", ""),
                        online_behavior=persona_info.get("online_behavior", ""),
                        profile=persona_info.get("profile", ""),
                        browser=persona_info.get("browser", ""),
                        device=persona_info.get("device", ""),
                        favourite=persona_info.get("favourite", False),
                        switch=persona_info.get("switch", [])
                    )
            except:
                continue
            personas.append(persona)
    return personas

@router.get("/loadpersona")
async def load_persona():
    try:
        personas = load_personas_from_folder(persona_folder_path)
        return personas
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
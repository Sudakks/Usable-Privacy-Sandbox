from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import json, os
from datetime import datetime

router = APIRouter()

@router.post("/restorelocalstorage")
async def restore_localstorage(request: Request):
    try:
        localStorage_data = await request.json()
        userId = localStorage_data.get('userId')

        if not userId:
            raise HTTPException(status_code=400, detail="Invalid data")

        persona_file_path = f"./personas/persona{userId}.json"

        # 检查文件是否存在
        if not os.path.exists(persona_file_path):
            raise HTTPException(status_code=404, detail="Persona file not found")
        
        # 读取现有的 persona 数据
        with open(persona_file_path, 'r') as file:
            persona_data = json.load(file)
            persona_info = persona_data["data"]
        
        # 根据 json 文件恢复数据
        for key, value in localStorage_data.items():
            if key == "name":
                localStorage_data[key] = persona_info["first_name"] + ' ' + persona_info["last_name"]
            elif key == "birthday":
                birthday_value = datetime.strptime(persona_info['birthday'], "%m/%d/%Y").date()
                localStorage_data[key] = birthday_value.strftime("%Y-%m-%d")
            elif key == "address":
                localStorage_data[key] = persona_info["street"] + ', ' + persona_info["city"] + ', ' + persona_info["state"] + ', ' + persona_info["zip_code"]
            else:
                if key != "profileImgUrl" and key != "switch":
                    localStorage_data[key] = persona_info[key]

        return localStorage_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
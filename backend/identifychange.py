from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import json, os
from datetime import datetime

router = APIRouter()

keys = ["name", "gender", "birthday", "race", "address", "education_background", "job", "income", "spoken_language", "marital_status", "parental_status"]

@router.post("/identifychange")
async def identify_change(request: Request):
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
            data_field = persona_data.get('data')
        
        # 比较并返回更改
        change_dict = {}
        for key in keys:
            value = localStorage_data.get(key)
            if key == "name":
                if value != data_field.get("first_name") + ' ' + data_field.get("last_name"):
                    change_dict[key] = data_field.get("first_name") + ' ' + data_field.get("last_name") + ' -> ' + value
            elif key == "address":
                if value != data_field.get("street") + ', ' + data_field.get("city") + ', ' + data_field.get("state") + ', ' + data_field.get("zip_code"):
                    change_dict[key] = data_field.get("street") + ', ' + data_field.get("city") + ', ' + data_field.get("state") + ', ' + data_field.get("zip_code") + ' -> ' + value
            elif key == "birthday":
                value = datetime.strptime(value, "%Y-%m-%d").strftime("%m/%d/%Y")
                if value != data_field.get("birthday"):
                    change_dict[key] = data_field.get("birthday") + ' -> ' + value
            else:
                if value != data_field.get(key):
                    change_dict[key] = data_field.get(key) + ' -> ' + value

        return change_dict

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
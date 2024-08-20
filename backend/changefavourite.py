from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import os, json

router = APIRouter()

@router.post("/changefavourite")
async def change_favourite(request: Request):
    try:
        id_data = await request.json()
        userId = id_data.get("userId")
    
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
        
        # 更新 favourite 状态
        data_field['favourite'] = not data_field['favourite']

        # 将更新后的数据写回到文件
        with open(persona_file_path, 'w') as file:
            json.dump(persona_data, file, indent=4)

        return {"message": "Favourite status changed"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

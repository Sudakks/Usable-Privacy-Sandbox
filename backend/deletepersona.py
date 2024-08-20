from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import os, json

router = APIRouter()

# 文件夹路径
persona_folder_path = "./personas"

@router.post("/deletepersona")
async def delete_persona(request: Request):
    try:
        # 获取请求体中的 JSON 数据
        id_data = await request.json()
        user_id = id_data.get("userId")

        # 检查 userId 是否存在
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid data")

        # 构造文件路径
        persona_file_path = os.path.join(persona_folder_path, f"persona{user_id}.json")
        persona_img_path = os.path.join(persona_folder_path, f"persona-image/persona{user_id}.png")

        # 检查文件是否存在
        if os.path.exists(persona_file_path):
            os.remove(persona_file_path)
        else:
            raise HTTPException(status_code=404, detail="Persona file not found")

        if os.path.exists(persona_img_path):
            os.remove(persona_img_path)
        else:
            raise HTTPException(status_code=404, detail="Persona image not found")

        return {"message": "Persona deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

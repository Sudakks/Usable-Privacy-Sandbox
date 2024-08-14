from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import os, json, shutil

router = APIRouter()

@router.post("/favouritepersona")
async def favourite_persona(request: Request):
    try:
        id_data = await request.json()
        userId = id_data.get("userId")
    
        if not userId:
            raise HTTPException(status_code=400, detail="Invalid data")

        source_path = f"./personas/persona{userId}.json"

        # 检查文件是否存在
        if not os.path.exists(source_path):
            raise HTTPException(status_code=404, detail="Persona file not found")
        
        # 将文件移动到收藏夹目录
        destination_path = f"./favourites/persona{userId}.json"
        shutil.move(source_path, destination_path)
        return {"message": "Persona added to favourites"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

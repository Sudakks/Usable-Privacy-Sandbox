from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

import json,os

router = APIRouter()

@router.post("/changeswitch")
async def change_switch(request: Request):
    try:
        data = await request.json()
        persona_id = data.get('id')
        info = data.get('info')

        if not persona_id or not info:
            raise HTTPException(status_code=400, detail="Invalid request")
        
        persona_file_path = f"./personas/persona{persona_id}.json"

        # 检查文件是否存在
        if not os.path.exists(persona_file_path):
            raise HTTPException(status_code=404, detail="Persona file not found")
        
        # 读取现有的 persona 数据
        with open(persona_file_path, 'r') as file:
            persona_data = json.load(file)
            data_field = persona_data.get('data')
            switch_field = data_field.get('switch')
        
        # 更新 switch 字段
        if info in switch_field:
            switch_field[info] = not switch_field[info]
        else:
            raise HTTPException(status_code=400, detail="Invalid info")

        # 将更新后的数据写回到文件
        with open(persona_file_path, 'w') as file:
            json.dump(persona_data, file, indent=4)

        return {"message": "Switch status of '{}' info changed".format(info)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

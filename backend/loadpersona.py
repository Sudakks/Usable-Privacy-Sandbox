from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json

app = FastAPI()

class Persona(BaseModel):
    profileImgUrl: str
    name: str
    age: str
    job: str
    city: str

# 文件夹路径
persona_folder_path = "./personas"

# 读取 persona 文件夹中的所有 JSON 文件
def load_personas_from_folder(folder_path: str):
    personas = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r") as f:
                data = json.load(f)
                persona_info = data["data"]
                name = f"{persona_info['first_name']} {persona_info['last_name']}"
                persona = Persona(
                    profileImgUrl="../backend/" + persona_info.get("profileImgUrl", ""),
                    name=name,
                    age=persona_info.get("age", ""),
                    job=persona_info.get("job", ""),
                    city=persona_info.get("city", "")
                )
                personas.append(persona)
    return personas

# 允许来自任意来源的请求（仅用于开发环境，生产环境应限制来源）
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/loadpersona", response_model=list[Persona])
async def load_persona():
    try:
        personas = load_personas_from_folder(persona_folder_path)
        return personas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)

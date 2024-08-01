from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

import os
import json

app = FastAPI()

# persona数据模型
# class Persona(BaseModel):
#     userId: int
#     browsingHistoryList: list
#     facebookPostsList: list
#     twitterPostsList: list
#     schedule: list
#     first_name: str
#     last_name: str
#     profileImgUrl: str
#     age: str
#     gender: str
#     race: str
#     street: str
#     city: str
#     state: str
#     zip_code: str
#     spoken_language: str
#     education_background: str
#     birthday: str
#     job: str
#     income: str
#     marital_status: str
#     parental_status: str
#     online_behavior: str
#     profile: str
#     browser: str
#     device: str
#     industry: str
#     employer_size: str
#     homeownership: str
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
                # 提取所需的信息
                persona_info = data["data"]
                name = f"{persona_info['first_name']} {persona_info['last_name']}"
                persona = Persona(
                    profileImgUrl=persona_info.get("profileImgUrl", ""),
                    name=name,
                    age=persona_info.get("age", ""),
                    job=persona_info.get("job", ""),
                    city=persona_info.get("city", "")
                )
                personas.append(persona)
    return personas

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
from fastapi import HTTPException, Request
from pydantic import BaseModel
from fastapi import APIRouter

from datetime import datetime
import json, os

router = APIRouter()

key_dict = {
    "genderDisplay": "gender",
    "raceDisplay": "race",
    "jobDisplay": "job",
    "educationDisplay": "education_background",
    "incomeDisplay": "income",
    "spokenLanguageDisplay": "spoken_language",
    "maritalStatusDisplay": "marital_status",
    "parentalStatusDisplay": "parental_status"
}

def calculate_age(birth_date_str):
    # 解析出生日期字符串
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = datetime.today()

    # 计算年龄
    age = today.year - birth_date.year
    
    # 计算是否已经过了生日
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    
    return age

@router.post("/changepersonainfo")
async def change_persona_info(request: Request):
    try:
        data = await request.json()
        persona_id = data.get('id')
        changes = data.get('changes')

        if not persona_id or not changes:
            raise HTTPException(status_code=400, detail="Invalid data")
        
        persona_file_path = f"./personas/persona{persona_id}.json"

        # 检查文件是否存在
        if not os.path.exists(persona_file_path):
            raise HTTPException(status_code=404, detail="Persona file not found")

        # 读取现有的 persona 数据
        with open(persona_file_path, 'r') as file:
            persona_data = json.load(file)
            data_field = persona_data.get('data')

        # 更新 persona 数据
        for key, value in changes.items():
            # 处理 key
            words = key.split(' ')
            key = words[1]
            if key in key_dict:
                key = key_dict[key]
            if key in data_field:
                data_field[key] = value
            else:
                if key == "nameDisplay":
                    if " " in value:
                        name_words = value.split(' ')
                        data_field["first_name"] = name_words[0]
                        data_field["last_name"] = name_words[-1]
                    else:
                        data_field["first_name"] = value
                elif key == "dateDisplay":
                    date_obj = datetime.strptime(value, "%Y-%m-%d")
                    formmatted_date = date_obj.strftime("%m/%d/%Y")
                    data_field["birthday"] = formmatted_date
                    age = calculate_age(value)
                    data_field["age"] = str(age)
                else:
                    raise HTTPException(status_code=400, detail=f"Invalid field: {key}")

        # 将更新后的数据写回到文件
        with open(persona_file_path, 'w') as file:
            json.dump(persona_data, file, indent=4)

        return {"message": "Persona info updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

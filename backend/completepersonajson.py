import json

def complete_persona_json(persona_json, img_base64):
    # 检查 "data" 域是否存在
    if 'data' in persona_json:
        # 添加 "favourite" 和 "switch" 信息
        persona_json['data']['profile_img'] = img_base64
        persona_json['data']['favourite'] = False
        persona_json['data']['switch'] = {
            "name": True,
            "gender": True,
            "birthday": True,
            "race": True,
            "address": True,
            "job": True,
            "income": True,
            "education": True,
            "spoken_language": True,
            "marital_status": True,
            "parental_status": True,
            "schedule": True,
            "browser_history": True,
            "facebook_posts": True,
            "twitter_posts": True
        }
    else:
        raise KeyError("'data' field is missing in the provided JSON data")

    return persona_json
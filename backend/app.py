# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from generate import Generator
from completepersonajson import complete_persona_json

import os, json

app = Flask(__name__)
generator = Generator()

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    guidance = data.get('guidance')

    if not guidance:
        return jsonify({'error': 'No guidance provided'}), 400

    persona_profile = generator.get_persona_profile(guidance)
    return jsonify({'description': persona_profile})

@app.route('/generate_persona', methods=['POST'])
def generate_persona():
    profile = request.data.decode('utf-8')  # 将字节流解码为字符串

    if not profile:
        return jsonify({'error': 'No guidance provided'}), 400

    start_date = "2024-07-08"
    end_date = "2024-07-08"

    try:
        # 获取 userId
        config_file_path = "../config/config.json"
        with open(config_file_path, 'r') as f:
            config = json.load(f)
            userId = config['max_userId'] + 1
        # 生成 json
        persona_json = generator.create_persona(start_date, end_date, profile, userId)
        return jsonify({'persona_json': persona_json})
    except Exception as e:
        return jsonify({'message': 'Error generating persona.'}), 400

@app.route('/save_persona', methods=['POST'])
def save_persona():
    data = request.json
    persona_json = data.get('persona_json')

    # 获取 userId
    config_file_path = "../config/config.json"
    with open(config_file_path, 'r') as f:
        config = json.load(f)
        userId = config['max_userId'] + 1
        config['max_userId'] = userId
    # 重新保存 config 文件
    with open(config_file_path, 'w') as f:
        json.dump(config, f, indent=4)
    # 修改persona_json
    persona_json = complete_persona_json(persona_json)
    # 保存 persona_json 到后端
    save_path = "./personas/persona" + str(userId) + ".json"
    with open(save_path, 'w') as f:
        json.dump(persona_json, f, indent=4)
    return jsonify({'persona_json': persona_json})

@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.json
    guidance = data.get('guidance')

    if not guidance:
        return jsonify({'error': 'No guidance provided'}), 400

    image_url = generator.generate_image(guidance)
    return jsonify({'image_url': image_url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # ������������ӿ�

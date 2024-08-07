# -*- coding: utf-8 -*-


from flask import Flask, request, jsonify
from generate import Generator  # ȷ�� generator.py ��ͬһĿ¼��

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # ������������ӿ�

# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from generate import Generator  

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
    data = request.json
    guidance = data.get('guidance')

    if not guidance:
        return jsonify({'error': 'No guidance provided'}), 400
    
    persona_json = generator.get_attributes(guidance)
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
    app.run(host='0.0.0.0', port=5000)  

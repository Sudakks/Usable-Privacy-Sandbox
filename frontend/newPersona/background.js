chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'generateDescription') {
        const guidance = message.guidance;

        fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guidance: guidance })
        })
            .then(response => response.json())
            .then(data => {
                // �������ɵ�����
                sendResponse({ description: data.description });
            })
            .catch(error => {
                console.error('Error:', error);
                // ���ش�����Ϣ
                sendResponse({ description: 'Error generating description.' });
            });

        return true; // ������Ϣͨ���򿪣�ֱ�� sendResponse ������
    }

    if (message.action === 'confirmPersona') {
        const profile = message.profile;

        fetch('http://localhost:5000/generate_persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: profile
        })
            .then(response => response.json())
            .then(data => {
                // �������ɵ�����
                sendResponse({ persona_json: data.persona_json });
            })
            .catch(error => {
                console.error('Error:', error);
                // ���ش�����Ϣ
                sendResponse({ persona_json: 'Error generating persona.' });
            });
        
        return true; // ������Ϣͨ���򿪣�ֱ�� sendResponse
    }

    if (message.action === 'savePersona') {
        const persona_json = message.persona_json;

        fetch('http://localhost:5000/save_persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ persona_json: persona_json })
        })
            .then(response => response.json())
            .then(data => {
                // �������ɵ�����
                sendResponse({ message: data.message });
            })
            .catch(error => {
                console.error('Error:', error);
                // ���ش�����Ϣ
                sendResponse({ message: 'Error saving persona.' });
            });

        return true; // ������Ϣͨ���򿪣�ֱ�� sendResponse
    }

    if (message.action === 'savetolocalstorage') {
        const userId = message.userId;

        fetch('http://localhost:5000/newpersona_localstorage', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: userId
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // 解析 JSON 并返回解析后的数据
        });
        //return true; // ������Ϣͨ���򿪣�ֱ�� sendResponse
    }


    if (message.action === 'generateImage') {
        const imageGuidance = message.guidance;

        fetch('http://localhost:5000/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guidance: imageGuidance })
        })
            .then(response => response.json())
            .then(data => {
                // �������ɵ�ͼ�� URL
                sendResponse({ imageUrl: data.imageUrl });
            })
            .catch(error => {
                console.error('Error:', error);
                // ���ش�����Ϣ
                sendResponse({ imageUrl: 'Error generating image.' });
            });

        return true; // ������Ϣͨ���򿪣�ֱ�� sendResponse ������
    }
});

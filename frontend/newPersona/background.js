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

        return true; 
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
                sendResponse({ persona_json: data.persona_json });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ persona_json: 'Error generating persona.' });
            });
        
        return true; 
    }
    //add new attributes defined by us
    if (message.action === 'savePersona') {
        const persona_json = message.persona_json;
        const img_base64 = message.img_base64;
        fetch('http://localhost:5000/save_persona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ persona_json: persona_json, img_base64: img_base64 })
        })
            .then(response => response.json())
            .then(data => {
                sendResponse({ message: data.message });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ message: 'Error saving persona.' });
            });

        return true;
    }

    if (message.action === 'savetolocalstorage') {
        const userId = message.userId;

        fetch('http://localhost:8000/newpersonalocalstorage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        })
            .then(response => response.json())
            .then(data => {
                // �������ɵ�����
                sendResponse({ newpersona: data });
            })
            .catch(error => {
                console.error('Error:', error);
                // ���ش�����Ϣ
                sendResponse({ newpersona: 'Error saving persona.' });
            });

        return true;
    }


    /*
    if (message.action === 'generateImage') {
        const imageGuidance = message.guidance;
                fetch('http://localhost:5000/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                    body: JSON.stringify({ attribute: imageGuidance })
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.url && data.base64_json) {
                    sendResponse({ imageUrl: data.url, base64Image: data.base64_json });
                } else {
                    sendResponse({ imageUrl: null, base64Image: null });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ imageUrl: null, base64Image: null });
            });
        // Keep the message channel open until `sendResponse` is called
        return true;
    }*/
});



// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateImage') {
        const { guidance } = request;
        fetch('http://localhost:5000/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guidance })
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.url && data.base64_json) {
                    sendResponse({ imageUrl: data.url, base64Image: data.base64_json });
                } else {
                    sendResponse({ imageUrl: null, base64Image: null });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ imageUrl: null, base64Image: null });
            });
        // Keep the message channel open until `sendResponse` is called
        return true;
    }
});

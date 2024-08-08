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

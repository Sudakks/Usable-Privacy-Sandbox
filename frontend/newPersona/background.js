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
                // 返回生成的描述
                sendResponse({ description: data.description });
            })
            .catch(error => {
                console.error('Error:', error);
                // 返回错误消息
                sendResponse({ description: 'Error generating description.' });
            });

        return true; // 保持消息通道打开，直到 sendResponse 被调用
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
                // 返回生成的图像 URL
                sendResponse({ imageUrl: data.imageUrl });
            })
            .catch(error => {
                console.error('Error:', error);
                // 返回错误消息
                sendResponse({ imageUrl: 'Error generating image.' });
            });

        return true; // 保持消息通道打开，直到 sendResponse 被调用
    }
});

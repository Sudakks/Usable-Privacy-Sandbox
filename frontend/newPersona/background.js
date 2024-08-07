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
                sendResponse({ description: data.description });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ description: 'Error generating description.' });
            });

        return true; // 保持消息通道打开，直到 sendResponse 被调用
    }
});

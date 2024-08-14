/*generate description*/
document.getElementById('generateDes').addEventListener('click', function () {
    /*TODO*/
});

/*Confirm, go to overview page*/
document.getElementById('Confirm').addEventListener('click', function () {
    window.location.href = "../overview_page/overview.html";
});

/*generate img*/
document.getElementById('generateImg').addEventListener('click', function () {
    /*TODO*/
});

/*description的输入*/
document.addEventListener('DOMContentLoaded', function () {
    var dspFrame = document.getElementById('dspFrame');
    var displayText = document.getElementById('displayText');
    var editInput = document.getElementById('editInput');

    dspFrame.addEventListener('click', () => {
        displayText.style.display = 'none';
        editInput.value = ""; // 清空输入框的值
        editInput.style.display = 'block';
        editInput.focus();
    });

    editInput.addEventListener('blur', () => {
        updateDisplayText();
    });

    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            updateDisplayText();
        }
    });

    function updateDisplayText() {
        displayText.textContent = editInput.value.trim();
        editInput.style.display = 'none';
        displayText.style.display = 'block';
        editInput.value = ""; // 清空输入框的值
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const generateDesBtn = document.getElementById('generateDes');
    const editInput = document.getElementById('editInput');
    const displayText = document.getElementById('displayText');
    const generateImg = document.getElementById('generateImg');

    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim(); // 获取 displayText 的内容作为 guidance
        generateDes.textContent = "Loading...";
        if (guidance) {
            // 发送消息给后台脚本，获取生成的描述
            chrome.runtime.sendMessage({ action: 'generateDescription', guidance: guidance }, function (response) {
                if (response && response.description) {
                    //process response further
                    displayText.textContent = response.description;
                    editInput.style.display = 'none';
                    displayText.style.display = 'block';
                    const generateDes = document.getElementById('generateDes');
                    generateDes.textContent = "Generate description";
                }
            });
        } else {
            alert('Please enter some guidance in the input field.');
        }
    });

    generateImg.addEventListener("click", function () {
        generateImg.textContent = "Loading...";
        const imageGuidance = displayText.textContent;
        if (imageGuidance) {
            // 发送消息给后台脚本，获取生成的图像
            chrome.runtime.sendMessage({ action: 'generateImage', guidance: imageGuidance }, function (response) {
                if (response && response.imageUrl) {
                    // 处理响应，更新图片
                    const imageUrl = response.imageUrl;
                    document.getElementById("photoFrame").style.backgroundImage = `url(${imageUrl})`;
                    alert("Image URL: " + imageUrl); // 可选：显示 URL 或其他信息
                    generateImg.textContent = "Generate Image"; // 恢复按钮文本
                } else {
                    // 处理错误情况
                    alert('Failed to generate image.');
                    generateImg.textContent = "Generate Image"; // 恢复按钮文本
                }
            });
        } else {
            alert('Please enter some guidance in the input field.'); // 提示用户输入指导信息
            generateImg.textContent = "Generate Image"; // 恢复按钮文本
        }
    });

    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html"
    });
});

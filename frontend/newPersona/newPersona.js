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

/*description������*/
document.addEventListener('DOMContentLoaded', function () {
    var dspFrame = document.getElementById('dspFrame');
    var displayText = document.getElementById('displayText');
    var editInput = document.getElementById('editInput');

    dspFrame.addEventListener('click', () => {
        //if (document.activeElement !== editInput) { // 仅在输入框未获得焦点时执行
        displayText.style.display = 'none';
            //editInput.value = ""; // ���������ֵ
        editInput.style.display = 'block';
        editInput.focus();
        //}
    });

    editInput.addEventListener('blur', () => {
        updateDisplayText();
    });

    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            updateDisplayText();
        }
    });

    // function updateDisplayText() {
    //     displayText.textContent = editInput.value.trim();
    //     editInput.style.display = 'none';
    //     displayText.style.display = 'block';
    //     editInput.value = ""; // ���������ֵ
    // }

    function updateDisplayText() {
        const trimmedValue = editInput.value.trim();
        if (trimmedValue) {
            displayText.textContent = trimmedValue;
        }
        editInput.style.display = 'none';
        displayText.style.display = 'block';
        // 保持输入框值以供下次使用
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const generateDesBtn = document.getElementById('generateDes');
    const editInput = document.getElementById('editInput');
    const displayText = document.getElementById('displayText');
    const confirmBtn = document.getElementById('Confirm');
    const generateImg = document.getElementById('generateImg');

    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim(); // ��ȡ displayText ��������Ϊ guidance
        generateDes.textContent = "Loading...";
        if (guidance) {
            // ������Ϣ����̨�ű�����ȡ���ɵ�����
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

    confirmBtn.addEventListener('click', function () {

    });

    generateImg.addEventListener("click", function () {
        generateImg.textContent = "Loading...";
        const imageGuidance = displayText.textContent;
        if (imageGuidance) {
            // ������Ϣ����̨�ű�����ȡ���ɵ�ͼ��
            chrome.runtime.sendMessage({ action: 'generateImage', guidance: imageGuidance }, function (response) {
                if (response && response.imageUrl) {
                    // ������Ӧ������ͼƬ
                    const imageUrl = response.imageUrl;
                    document.getElementById("photoFrame").style.backgroundImage = `url(${imageUrl})`;
                    alert("Image URL: " + imageUrl); // ��ѡ����ʾ URL ��������Ϣ
                    generateImg.textContent = "Generate Image"; // �ָ���ť�ı�
                } else {
                    // �����������
                    alert('Failed to generate image.');
                    generateImg.textContent = "Generate Image"; // �ָ���ť�ı�
                }
            });
        } else {
            alert('Please enter some guidance in the input field.'); // ��ʾ�û�����ָ����Ϣ
            generateImg.textContent = "Generate Image"; // �ָ���ť�ı�
        }
    });

});

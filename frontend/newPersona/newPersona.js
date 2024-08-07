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
        displayText.style.display = 'none';
        editInput.value = ""; // ���������ֵ
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
        editInput.value = ""; // ���������ֵ
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const generateDesBtn = document.getElementById('generateDes');
    const editInput = document.getElementById('editInput');
    const displayText = document.getElementById('displayText');

    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim(); // ��ȡ displayText ��������Ϊ guidance

        if (guidance) {
            // ������Ϣ����̨�ű�����ȡ���ɵ�����
            chrome.runtime.sendMessage({ action: 'generateDescription', guidance: guidance }, function (response) {
                //alert("test  " + response);
                if (response && response.description) {
                    displayText.textContent = response.description;
                    editInput.style.display = 'none';
                    displayText.style.display = 'block';
                }
            });
        } else {
            alert('Please enter some guidance in the input field.');
        }
    });
});

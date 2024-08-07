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

    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim(); // 获取 displayText 的内容作为 guidance

        if (guidance) {
            // 发送消息给后台脚本，获取生成的描述
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

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


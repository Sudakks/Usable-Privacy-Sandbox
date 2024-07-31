document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // �¼�ί��
    document.body.addEventListener('click', function (event) {
        // �ж��Ƿ����˿ɱ༭��Ԫ��
        if (event.target.classList.contains('infoEdit')) {
            var infoDiv = event.target;
            var input = infoDiv.nextElementSibling;

            input.value = infoDiv.textContent.trim();
            infoDiv.style.display = 'none';
            input.style.display = 'inline';
            input.focus();
        }
    });

    document.body.addEventListener('blur', function (event) {
        // �ж��Ƿ�ʧȥ�������Ľ���
        if (event.target.classList.contains('infoInput')) {
            var input = event.target;
            var infoDiv = input.previousElementSibling;
            var newValue = input.value.trim();

            if (newValue !== "") {
                infoDiv.textContent = newValue;
            }

            infoDiv.style.display = 'inline';
            input.style.display = 'none';
        }
    }, true); // ����׶�

    document.body.addEventListener('keypress', function (event) {
        if (event.target.classList.contains('infoInput') && event.key === 'Enter') {
            event.target.blur(); // ����blur�¼�
        }
    }); 
});

document.getElementById('dropdownEdit').addEventListener('click', function () {
    var dropdownEdit = document.getElementById("dropdownEdit");
    var dropdownInput = document.getElementById("dropdownInput");

    if (dropdownInput) { // ȷ��Ԫ�ش���
        if (dropdownInput.style.display === 'none' || dropdownInput.style.display === '') {
            dropdownInput.style.display = 'block';
            infoEdit.style.display = 'none';
        } else {
            dropdownInput.style.display = 'none';
            infoEdit.style.display = 'block';
        }
    }
});


function updateInfo() {
    var dropdownEdit = document.getElementById("dropdownEdit");
    var dropdownInput = document.getElementById("dropdownInput");
    var selectedValue = dropdownInput.options[dropdownInput.selectedIndex].textContent;

    dropdownEdit.textContent = selectedValue;
    dropdownInput.style.display = 'none';
    dropdownEdit.style.display = 'block';
}
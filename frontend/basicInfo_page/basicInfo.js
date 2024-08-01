document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 事件委托
    document.body.addEventListener('click', function (event) {
        // 判断是否点击了可编辑的元素
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
        // 判断是否失去了输入框的焦点
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
    }, true); // 捕获阶段

    document.body.addEventListener('keypress', function (event) {
        if (event.target.classList.contains('infoInput') && event.key === 'Enter') {
            event.target.blur(); // 触发blur事件
        }
    }); 
});

document.getElementById('dropdownEdit').addEventListener('click', function () {
    var dropdownEdit = document.getElementById("dropdownEdit");
    var dropdownInput = document.getElementById("dropdownInput");

    if (dropdownInput) { // 确保元素存在
        if (dropdownInput.style.display === 'none' || dropdownInput.style.display === '') {
            dropdownInput.style.display = 'block';
            dropdownEdit.style.display = 'none';
        } else {
            dropdownInput.style.display = 'none';
            dropdownEdit.style.display = 'block';
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
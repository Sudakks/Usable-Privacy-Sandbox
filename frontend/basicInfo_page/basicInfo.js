document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 事件委托，处理infoEdit点击事件
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('infoEdit')) {
            var infoDiv = event.target;
            var input = infoDiv.nextElementSibling;

            // 提取日期部分
            var dateText = infoDiv.textContent.trim();
            var dateMatch = dateText.match(/^(\d{4}-\d{1,2}-\d{1,2})/);
            if (dateMatch) {
                input.value = dateMatch[1]; // 将日期部分赋值给输入框
            }
            infoDiv.style.display = 'none';
            input.style.display = 'inline';
            input.focus();
        }
    });

    document.body.addEventListener('blur', function (event) {
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
    }, true);

    document.body.addEventListener('keypress', function (event) {
        if (event.target.classList.contains('infoInput') && event.key === 'Enter') {
            event.target.blur(); // 触发blur事件
        }
    });

    document.querySelectorAll('.infoEdit').forEach(item => {
        item.addEventListener('click', function () {
            var input = this.nextElementSibling;
            if (input.classList.contains('infoInput')) {
                this.style.display = 'none';
                input.style.display = 'block';
                input.focus();
            }
        });
    });

    document.querySelectorAll('.infoInput').forEach(item => {
        item.addEventListener('change', function () {
            var infoDiv = this.previousElementSibling;
            var newValue = this.value.trim();
            if (newValue !== "") {
                infoDiv.textContent = newValue;
            }
            this.style.display = 'none';
            infoDiv.style.display = 'block';
        });
    });
});


function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function updateInfo() {
    var dropdownEdit = document.querySelector(".genderDisplay");
    var dropdownInput = document.querySelector(".genderInput");
    var selectedValue = dropdownInput.options[dropdownInput.selectedIndex].textContent;

    dropdownEdit.textContent = selectedValue;
    dropdownInput.style.display = 'none';
    dropdownEdit.style.display = 'block';
}

//change date if making any change
document.querySelector('.dateInput').addEventListener('change', function () {
    var birthDate = this.value;
    //var age = calculateAge(birthDate);
    var displayDiv = this.previousElementSibling;
    displayDiv.textContent = `${birthDate}`;
    this.style.display = 'none';
    displayDiv.style.display = 'block';
});
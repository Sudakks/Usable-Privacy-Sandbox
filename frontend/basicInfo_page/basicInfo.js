document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        //window.location.href = "../popup.html";
        backModal.style.display = "block";
    });

    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        const persona = JSON.parse(personaData);

        // 获取 DOM 元素并设置 persona 数据
        const nameDisplay = document.querySelector('.nameDisplay');
        const dateDisplay = document.querySelector('.dateDisplay');
        const genderDisplay = document.querySelector('.genderDisplay');
        const raceDisplay = document.querySelector('.raceDisplay');
        const addressDisplay = document.querySelector('.addressDisplay');
        
        // 设置 persona 数据
        nameDisplay.textContent = persona.name;
        dateDisplay.textContent = `${persona.birthday} (age ${persona.age})`;
        genderDisplay.textContent = persona.gender;
        raceDisplay.textContent = persona.race;
        addressDisplay.textContent = persona.address;

        // 清除 persona 数据以避免在刷新后重复使用
        //localStorage.removeItem('selectedPersona');
    } else {
        console.error('No persona data found in localStorage');
    }

    var saveModal = document.getElementById("saveModal");
    var saveBtn = document.querySelector(".saveButton");
    var close = document.querySelectorAll(".close");
    var discardBtn = document.querySelector(".discardButton");
    var discardModal = document.getElementById("discardModal");

    saveBtn.addEventListener("click", function () {
        saveModal.style.display = "block";
    });
    discardBtn.addEventListener("click", function () {
        discardModal.style.display = "block";
    });
    close.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (discardModal.contains(btn)) {
                discardModal.style.display = "none";
            }
            else if (saveModal.contains(btn)) {
                saveModal.style.display = "none";
            }
            else if (backModal.contains(btn)) {
                backModal.style.display = "none";
            }
            else {
                console.error('Couldn\'t find close button');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    function updateLocalStorage(persona) {
        localStorage.setItem('selectedPersona', JSON.stringify(persona));
    }

    let modifiedFields = {}; // 用于记录修改的字段

    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('infoEdit')) {
            var infoDiv = event.target;
            var input = infoDiv.nextElementSibling;

            // 记录修改前的值
            modifiedFields[infoDiv.className] = infoDiv.textContent.trim();

            // 获取并设置日期值
            var dateText = infoDiv.textContent.trim();
            var dateMatch = dateText.match(/^(\d{4}-\d{1,2}-\d{1,2})/);
            if (dateMatch) {
                input.value = dateMatch[1];
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
                var persona = JSON.parse(localStorage.getItem('selectedPersona'));
                modifiedFields[infoDiv.className] = newValue;
                if (input.type === 'date') {
                    // 处理日期输入
                    var age = calculateAge(newValue);
                    infoDiv.textContent = `${newValue} (age ${age})`;
                    persona.birthday = newValue;
                    persona.age = age;
                } else {
                    infoDiv.textContent = newValue;
                    if (infoDiv.classList.contains('nameDisplay')) {
                        persona.name = newValue;
                    } else if (infoDiv.classList.contains('genderDisplay')) {
                        persona.gender = newValue;
                    } else if (infoDiv.classList.contains('raceDisplay')) {
                        persona.race = newValue;
                    } else if (infoDiv.classList.contains('addressDisplay')) {
                        persona.address = newValue;
                    }
                }

                // 更新 localStorage
                updateLocalStorage(persona);

                // 发送到服务器
                submitChanges(persona, modifiedFields);
            }

            infoDiv.style.display = 'inline';
            input.style.display = 'none';
        }
    }, true);

    document.body.addEventListener('keypress', function (event) {
        if (event.target.classList.contains('infoInput') && event.key === 'Enter') {
            event.target.blur(); // 触发 blur 事件
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

// 提交修改到后端
function submitChanges(persona, modifiedFields) {
    console.log('Submitting Changes...');
    console.log("id:" + persona.userId);
    console.log("changes:" + modifiedFields);
    fetch('http://localhost:8000/changepersonainfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: persona.userId, // 传递 persona ID
            changes: modifiedFields, // 只发送变更的字段
        }),
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}
/* 限制不能选择今天之后的日期 */
// 获取当前日期
const today = new Date();
// 格式化日期为 YYYY-MM-DD
const formattedDate = today.toISOString().split('T')[0];
// 获取日期输入框元素
const dateInput = document.querySelector('.dateInput');
// 设置最大日期
dateInput.max = formattedDate;


//Address autocomplete
let autocomplete;
function initAutoComplete() {
    autocomplete = new google.maps.places.autocomplete(
        document.getElementById('autocomplete'), {
            types: ['establishment'],
            componentRestrictions: { 'country': ['AU'] },
            fields:['place_id', 'geometry', 'name']
        }
    );
};

$(document).ready(function () {
    $('.genderInput').prepend('<option value="" selected>Select gender</option>');
});

$(document).ready(function () {
    $('.raceInput').prepend('<option value="" selected>Select race</option>');
});

$(document).ready(function () {
    function showPopupMessage(message) {
        $('#popupMessage').text(message).fadeIn();

        setTimeout(function () {
            $('#popupMessage').fadeOut();
            $('#saveModal').fadeOut();
        }, 1000); // Message shows for 1.5 seconds
    }

    function showPopupMessageAndBack(message) {
        $('#popupMessage').text(message).fadeIn();

        setTimeout(function () {
            $('#popupMessage').fadeOut();
            $('#backModal').fadeOut();

            // 在popupMessage展示后0s立即跳转popup.html
            setTimeout(function () {
                window.location.href = "../popup.html";
            }, 0);

        }, 1000);  // 显示 #popupMessage 的1s时间
    }


    function onlyExit() {
        $('#discardModal').fadeOut();
    }

    $('#saveUpdate').click(function () {
        showPopupMessage('Save & Update Successful!');
    });

    $('#saveNoUpdate').click(function () {
        showPopupMessage('Only Saved Changes!');
    });

    $('#Cancel').click(function () {
        onlyExit();
    });

    $('#Confirm').click(function () {
        onlyExit();
    });

    /* process checkbox */
    var confirmBack = document.getElementById("confirmBack");
    confirmBack.addEventListener("click", () => {
        var operation = null;
        var obj = document.getElementsByName("backOption")
        for (var i = 0; i < obj.length; i++) { //遍历Radio 
            if (obj[i].checked) {
                operation = obj[i].value;
                break;
            }
        }

        if (operation === "save-only") {
            showPopupMessageAndBack('Only Saved Changes!');
        }
        else if (operation === "save-update") {
            showPopupMessageAndBack('Save & Update Successful!');
        }
        else if (operation === "discard") {
            //onlyExit();
            window.location.href = "../popup.html";
        }
    });
});


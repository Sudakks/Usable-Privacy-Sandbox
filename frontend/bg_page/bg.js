document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });

    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        const persona = JSON.parse(personaData);

        // 获取 DOM 元素并设置persona数据
        const jobDisplay = document.querySelector('.jobDisplay');
        const educationDisplay = document.querySelector('.educationDisplay');
        const incomeDisplay = document.querySelector('.incomeDisplay');
        const spokenLanguageDisplay = document.querySelector('.spokenLanguageDisplay');
        const maritalStatusDisplay = document.querySelector('.maritalStatusDisplay');
        const parentalStatusDisplay = document.querySelector('.parentalStatusDisplay');

        // 设置 persona 数据
        jobDisplay.textContent = persona.job;
        educationDisplay.textContent = persona.education_background;
        incomeDisplay.textContent = persona.income;
        spokenLanguageDisplay.textContent = persona.spoken_language;
        maritalStatusDisplay.textContent = persona.marital_status;
        parentalStatusDisplay.textContent = persona.parental_status;

        // 清除 persona 数据以避免在刷新后重复使用
        //localStorage.removeItem('selectedPersona');
    } else {
        console.error('No persona data found in localStorage');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    function updateLocalStorage(persona) {
        localStorage.setItem('selectedPersona', JSON.stringify(persona));
    }

    let modifiedFields = {}; // 用于记录修改的字段

    // �¼�ί�У�����infoEdit����¼�
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('infoEdit')) {
            var infoDiv = event.target;
            var input = infoDiv.nextElementSibling;

            // 记录修改前的值
            modifiedFields[infoDiv.className] = infoDiv.textContent.trim();

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
                infoDiv.textContent = newValue;
                if (infoDiv.classList.contains('jobDisplay')) {
                    persona.job = newValue;
                } else if (infoDiv.classList.contains('educationDisplay')) {
                    persona.education_background = newValue;
                } else if (infoDiv.classList.contains('incomeDisplay')) {
                    persona.income = newValue;
                } else if (infoDiv.classList.contains('spokenLanguageDisplay')) {
                    persona.spoken_language = newValue;
                } else if (infoDiv.classList.contains('maritalStatusDisplay')) {
                    persona.marital_status = newValue;
                } else if (infoDiv.classList.contains('parentalStatusDisplay')) {
                    persona.parental_status = newValue;
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
    /*
     * 这一段应该不需要，因为blur之后已经更新了？
    document.querySelectorAll('.infoInput').forEach(item => {
        item.addEventListener('change', function () {
            var infoDiv = this.previousElementSibling;
            var newValue = this.value.trim();
            if (newValue !== "") {
                var persona = JSON.parse(localStorage.getItem('selectedPersona'));
                infoDiv.textContent = newValue;
                if (infoDiv.classList.contains('jobDisplay')) {
                    persona.job = newValue;
                } else if (infoDiv.classList.contains('educationDisplay')) {
                    persona.education_background = newValue;
                } else if (infoDiv.classList.contains('incomeDisplay')) {
                    persona.income = newValue;
                } else if (infoDiv.classList.contains('spokenLanguageDisplay')) {
                    persona.spoken_language = newValue;
                } else if (infoDiv.classList.contains('maritalStatusDisplay')) {
                    persona.marital_status = newValue;
                } else if (infoDiv.classList.contains('parentalStatusDisplay')) {
                    persona.parental_status = newValue;
                }

                // 更新 localStorage
                updateLocalStorage(persona);

                // 发送到服务器
                submitChanges(persona, modifiedFields);
            }
            this.style.display = 'none';
            infoDiv.style.display = 'block';
        });
    });*/
});

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
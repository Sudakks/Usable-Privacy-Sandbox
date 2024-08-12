var languageMap = {
    "en": "English",
    "es": "Spanish",
    "zh": "Chinese",
    "hi": "Hindi",
    "ar": "Arabic",
    "pt": "Portuguese",
    "bn": "Bengali",
    "ru": "Russian",
    "ja": "Japanese",
    "de": "German",
    "other": "Other"
};

document.addEventListener("DOMContentLoaded", function () {
    // 存储当前所处界面信息
    sessionStorage.setItem("currentPage", "bg");

    let persona = localStorage.getItem("selectedPersona");

    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        //window.location.href = "../popup.html";
        backModal.style.display = "block";
    });

    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        persona = JSON.parse(personaData);

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

            infoDiv.style.display = 'none';
            input.style.display = 'inline';
            input.focus();
        }
    });

    document.body.addEventListener('blur', function (event) {
        if (event.target.classList.contains('infoInput')) {
            var input = event.target;
            var infoDiv = input.closest('.singleInfo').querySelector('.infoEdit');
            var newValue = input.value.trim();
            //var persona = JSON.parse(localStorage.getItem('selectedPersona')) || {};
            var modifiedFields = {};

            if (newValue !== "") {
                if (infoDiv) {
                    if (infoDiv.classList.contains('educationDisplay')) {
                        var educationValue = document.querySelector('.educationInput').value;
                        var majorInput = document.querySelector('.majorInput').value.trim();
                        newValue = educationValue + (majorInput ? " in " + majorInput : "");
                    }
                    else if (infoDiv.classList.contains('spokenLanguageDisplay')) {
                        var selectedLanguageCode = document.querySelector('.spokenLanguageInput').value;
                        newValue = languageMap[selectedLanguageCode] || newValue; // 将代码转换为名称
                        persona.spoken_language = newValue;
                    }
                    infoDiv.textContent = newValue;
                    modifiedFields[infoDiv.className] = newValue;

                    if (infoDiv.classList.contains('educationDisplay')) {
                        persona.education_background = newValue;
                    } else if (infoDiv.classList.contains('jobDisplay')) {
                        persona.job = newValue;
                    } else if (infoDiv.classList.contains('incomeDisplay')) {
                        persona.income = newValue;
                    }  else if (infoDiv.classList.contains('maritalStatusDisplay')) {
                        persona.marital_status = newValue;
                    } else if (infoDiv.classList.contains('parentalStatusDisplay')) {
                        persona.parental_status = newValue;
                    }

                    // 更新 localStorage
                    updateLocalStorage(persona);

                    // 发送到服务器
                    saveBgChanges(persona, modifiedFields);
                }
            }

            if (infoDiv) {
                infoDiv.style.display = 'inline';
            }
            input.style.display = 'none';
            if (event.target.classList.contains('majorInput')) {
                var inMajorSpan = document.querySelector('.inMajor');
                inMajorSpan.style.display = 'none';
            }
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

    // 自动保存 switch 修改
    // 选择所有的 switch 元素
    const switches = persona.switch
    const switchElements = document.querySelectorAll('.switch input[type="checkbox"]');

    switchElements.forEach(switchElement => {
        const switchClassName = switchElement.parentElement.classList[1]; // 获取开关的类名，例如 nameSwitch
        switchClass = switchClassName.replace('Switch', ''); // 去掉 Switch 后缀，得到属性名，例如 name

        // 根据 localStorage 中的数据设置 switch 状态
        if (switches[switchClass] !== undefined) {
            switchElement.checked = switches[switchClass];
        }
    });

    switchElements.forEach(switchElement => {
        switchElement.addEventListener('change', function () {
            const switchChangedName = this.parentElement.classList[1]; // 获取开关的类名，例如 nameSwitch
            const switchChanged = switchChangedName.replace('Switch', ''); // 去掉 Switch 后缀，得到属性名，例如 name
            
            // 在 localStorage 中更新 switch 状态
            switches[switchChanged] = this.checked;

            // 保存 localStorage
            updateLocalStorage(persona);
                 
            // 调用函数将状态发送到后端
            changeSwitch(persona, switchChanged);
        });
    });

    function changeSwitch(persona, switchChanged) {
        fetch('http://localhost:8000/changeswitch', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: persona.userId,
                info: switchChanged,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Switch state updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating switch state:', error);
        });
    }
});

function saveBgChanges(persona, modifiedFields) {
    sessionStorage.setItem('bgModified', JSON.stringify(modifiedFields));
    sessionStorage.setItem('selectedPersona', JSON.stringify(persona));
}

// 提交修改到后端
/*
function submitChanges(persona, modifiedFields) {
    if (!persona)
        return;
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
}*/

document.addEventListener('DOMContentLoaded', function () {
    var educationSelect = document.querySelector('.educationInput');
    educationSelect.addEventListener('change', function () {
        handleEducationChange(educationSelect);
    });
});

function handleEducationChange(selectElement) {
    var inMajorSpan = document.querySelector('.inMajor');
    var majorInput = document.querySelector('.majorInput');
    if (selectElement.value === "bachelor's degree" || selectElement.value === "advanced degree" || selectElement.value === "attending college") {
        inMajorSpan.style.display = 'inline-block';
    } else {
        inMajorSpan.style.display = 'none';
        majorInput.value = '';  // Clear the input field if it's hidden
    }
}


// Language Selector
$(document).ready(function () {
    // 加载语言数据
    $.ajax({
        url: 'languages.json', // JSON文件路径
        dataType: 'json',
        success: function (data) {
            var $languageSelect = $('#language');
            var $customLanguageInput = $('#customLanguage');

            // 清空现有选项
            $languageSelect.empty();

            // 添加默认选项
            $languageSelect.append('<option value="">Select a language</option>');

            // 创建一个映射，用于将语言代码映射到语言名称
            var languageMap = {};
            data.forEach(function (lang) {
                $languageSelect.append('<option value="' + lang.code + '">' + lang.nativeName + '</option>');
                languageMap[lang.code] = lang.name; // 语言代码到名称的映射
            });
 
            
        },
        error: function (xhr, status, error) {
            console.error('Failed to load language data:', error);
        }
    });
});

$(document).ready(function () {
    $('.educationInput').prepend('<option value="" selected>Select education</option>');
});

$(document).ready(function () {
    $('.maritalStatusInput').prepend('<option value="" selected>Select marital status</option>');
});

$(document).ready(function () {
    $('.parentalInput').prepend('<option value="" selected>Select parental status</option>');
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

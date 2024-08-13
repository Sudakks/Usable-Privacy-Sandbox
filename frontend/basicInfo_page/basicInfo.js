document.addEventListener("DOMContentLoaded", function () {
    // 存储当前所处界面信息
    sessionStorage.setItem("currentPage", "basicInfo");

    let persona = null; // 声明 persona 变量

    var backButton = document.querySelector(".backButton");
    var backModal = document.getElementById("backModal");
    backButton.addEventListener("click", function () {
        async function getResult() {
            let result = await getChangedList();
            if (result === false) {
                //empty
                window.location.href = "../popup.html"
            }
            else {
                backModal.style.display = "block";
            }
        }
        getResult();
    });

    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        persona = JSON.parse(personaData);

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
            var basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {}; // 从 sessionStorage 中读取之前的值

            if (newValue !== "") {
                //var persona = JSON.parse(localStorage.getItem('selectedPersona'));
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
                basicInfoModified[infoDiv.className] = newValue;


                // 更新 localStorage
                updateLocalStorage(persona);

                // 发送到服务器
                saveBasicInfoChanges(persona, basicInfoModified);
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


function saveBasicInfoChanges(persona, modifiedFields) {
    sessionStorage.setItem('basicInfoModified', JSON.stringify(modifiedFields));
    sessionStorage.setItem('selectedPersona', JSON.stringify(persona));
}

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

document.addEventListener('DOMContentLoaded', function () {
    /* 限制不能选择今天之后的日期 */
    // 获取当前日期
    const today = new Date();
    // 格式化日期为 YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];
    // 获取日期输入框元素
    const dateInput = document.querySelector('.dateInput');
    // 设置最大日期
    dateInput.max = formattedDate;
});

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('addressInput');
    const resultsContainer = document.getElementById('autocompleteResults');

    input.addEventListener('input', function () {
        const query = input.value;
        if (query.length > 2) { // Trigger search after 3 characters
            fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&countrycodes=US&accept-languages=en`)
                .then(response => response.json())
                .then(data => {
                    resultsContainer.innerHTML = '';
                    if (data.length > 0) {
                        resultsContainer.style.display = 'block';
                        data.forEach(item => {
                            console.log(item.getItem('display_name'));
                            const div = document.createElement('div');
                            div.classList.add('autocomplete-item');
                            div.textContent = item.display_name;
                            div.addEventListener('click', () => {
                                input.value = item.display_name;
                                console.log(item.display_name);
                                resultsContainer.style.display = 'none';
                            });
                            resultsContainer.appendChild(div);
                        });
                    } else {
                        resultsContainer.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    resultsContainer.style.display = 'none';
                });
        } else {
            resultsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!resultsContainer.contains(event.target) && event.target !== input) {
            resultsContainer.style.display = 'none';
        }
    });

});
/*
    input.addEventListener('input', function () {
        const query = input.value;
        if (query.length > 2) { // Trigger search after 3 characters
            fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&countrycodes=US&accept-languages=en`)
                .then(response => response.json())
                .then(data => {
                    resultsContainer.innerHTML = '';
                    if (data.length > 0) {
                        resultsContainer.style.display = 'block';
                        data.forEach(item => {
                            console.log(item.getItem('display_name'));
                            const div = document.createElement('div');
                            div.classList.add('autocomplete-item');
                            div.textContent = item.display_name;
                            div.addEventListener('click', () => {
                                input.value = item.display_name;
                                console.log(item.display_name);
                                resultsContainer.style.display = 'none';
                            });
                            resultsContainer.appendChild(div);
                        });
                    } else {
                        resultsContainer.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    resultsContainer.style.display = 'none';
                });
        } else {
            resultsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!resultsContainer.contains(event.target) && event.target !== input) {
            resultsContainer.style.display = 'none';
        }
    });

});*/


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
    function backToSelect() {
        window.location.href = "../popup.html";
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

    $('#saveUpdateBack').click(function () {
        showPopupMessageAndBack('Save & Update Successful!');
    });

    $('#saveBack').click(function () {
        showPopupMessageAndBack('Only Saved Changes!');
    });

    $('#discardBack').click(function () {
        backToSelect();
    });
});

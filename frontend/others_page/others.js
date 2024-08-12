document.addEventListener("DOMContentLoaded", function () {
    // 存储当前所处界面信息
    sessionStorage.setItem("currentPage", "others");

    let persona = null; // 声明 persona 变量

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

            // ��popupMessageչʾ��0s������תpopup.html
            setTimeout(function () {
                window.location.href = "../popup.html";
            }, 0);

        }, 1000);  // ��ʾ #popupMessage ��1sʱ��
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
        for (var i = 0; i < obj.length; i++) { //����Radio 
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
            window.location.href = "../popup.html";
        }
    });
});

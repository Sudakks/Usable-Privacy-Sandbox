document.addEventListener("DOMContentLoaded", function () {
    // 存储当前所处界面信息
    sessionStorage.setItem("currentPage", "overview");
    setButtonVisibility();
    
        function setButtonVisibility() {
            const saveButtons = document.querySelectorAll('.saveButton');
            const discardButtons = document.querySelectorAll('.discardButton');
            const activateButtons = document.querySelectorAll('.activateButton');

            const saveButtonVisible = sessionStorage.getItem('saveButtonVisible');
            const discardButtonVisible = sessionStorage.getItem('discardButtonVisible');
            const activateButtonDisabled = sessionStorage.getItem('activateButtonDisabled');

            // 控制 saveButtons 的显示状态
            saveButtons.forEach(button => {
                button.style.display = saveButtonVisible === 'true' ? 'block' : 'none';
            });

            // 控制 discardButtons 的显示状态
            discardButtons.forEach(button => {
                button.style.display = discardButtonVisible === 'true' ? 'block' : 'none';
            });

            // 控制 activateButtons 的显示状态
            activateButtons.forEach(button => {
                if (activateButtonDisabled === 'true') {
                    button.style.display = 'block';
                    button.disabled = true;
                    button.style.backgroundColor = '#ccc';
                    button.style.cursor = 'not-allowed';
                    button.style.opacity = '0.6';
                }
                else if (activateButtonDisabled === 'false') {
                    button.style.display = 'block';
                    button.disabled = false;
                    button.style.backgroundColor = '';
                    button.style.cursor = '';
                    button.style.opacity = '';
                }
            });
        }
        

    // 处理返回按钮的点击事件
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

    var saveButton = document.querySelector(".saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            getChangedList();
        });
    }
    


    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        const persona = JSON.parse(personaData);

        // 获取 DOM 元素
        const personaImage = document.querySelector('.personaImage');
        const briefInfo = document.querySelector('.briefInfo');
        const naturalInfo = document.querySelector('.naturalInfo');

        // 设置 persona 数据到页面元素
        personaImage.src = "../" + persona.profileImgUrl;
        briefInfo.innerHTML = `
            <p><span class="bold">${persona.name}</span>&middot ${persona.age}</p>
            <p>${persona.job} &middot ${persona.city}</p>
        `;
       
        /*
        const onlineBehaviorPresent = onlineBehavior.split(' ').slice(0, 20).join(' ') + "...";
        naturalInfo.innerHTML = `
            <p>${onlineBehaviorPresent}</p>
        `;*/
        const onlineBehavior = persona.online_behavior;

        naturalInfo.innerHTML = `
    <p title="${onlineBehavior}">${onlineBehavior}</p>`;



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


/*
 Code included inside $( document ).ready() will only run 
 once the page Document Object Model (DOM) is ready for JavaScript code to execute
 */
/*
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


document.addEventListener('DOMContentLoaded', function () {
    function showPopupMessage(message) {
        var popupMessage = document.getElementById('popupMessage');
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';

        setTimeout(function () {
            popupMessage.style.display = 'none';
            document.getElementById('saveModal').style.display = 'none';
        }, 1000); // Message shows for 1 second
    }

    function showPopupMessageAndBack(message) {
        var popupMessage = document.getElementById('popupMessage');
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';

        setTimeout(function () {
            popupMessage.style.display = 'none';
            document.getElementById('backModal').style.display = 'none';

            // 在popupMessage展示后0秒立即跳转popup.html
            setTimeout(function () {
                window.location.href = "../popup.html";
            }, 0);

        }, 1000);  // 显示 #popupMessage 的1秒时间
    }

    function onlyExit() {
        document.getElementById('discardModal').style.display = 'none';
    }

    function backToSelect() {
        window.location.href = "../popup.html";
    }

    document.getElementById('saveUpdate').addEventListener('click', function () {
        showPopupMessage('Save & Update Successful!');
    });

    document.getElementById('saveNoUpdate').addEventListener('click', function () {
        showPopupMessage('Only Saved Changes!');
    });

    document.getElementById('Cancel').addEventListener('click', function () {
        onlyExit();
    });

    document.getElementById('Confirm').addEventListener('click', function () {
        onlyExit();
    });

    document.getElementById('saveUpdateBack').addEventListener('click', function () {
        showPopupMessageAndBack('Save & Update Successful!');
    });

    document.getElementById('saveBack').addEventListener('click', function () {
        showPopupMessageAndBack('Only Saved Changes!');
    });

    document.getElementById('discardBack').addEventListener('click', function () {
        backToSelect();
    });
});

*/
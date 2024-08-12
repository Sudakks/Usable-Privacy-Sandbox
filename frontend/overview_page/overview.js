document.addEventListener("DOMContentLoaded", function () {
    // 存储当前所处界面信息
    sessionStorage.setItem("currentPage", "overview");

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
       
        const onlineBehavior = persona.online_behavior;
        /*
        const onlineBehaviorPresent = onlineBehavior.split(' ').slice(0, 20).join(' ') + "...";
        naturalInfo.innerHTML = `
            <p>${onlineBehaviorPresent}</p>
        `;*/
        naturalInfo.innerHTML = `
            <p class = "onlineBehaviorPresent">${onlineBehavior}</p>`;


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


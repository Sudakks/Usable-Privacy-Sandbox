function submitChanges(persona, modifiedFields) {
    console.log('Submitting Changes...');
    if (!persona)
        return;
    console.log("id:" + persona.userId);
    console.log("changes:" + modifiedFields);
    fetch('http://localhost:8000/changepersonainfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: persona.userId, 
            changes: modifiedFields, 
        }),
    }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function saveAllFiled() {
    let bgModified = JSON.parse(sessionStorage.getItem('bgModified')) || {};
    let basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {};
    let selectedPersona = JSON.parse(sessionStorage.getItem('selectedPersona')) || {};
    submitChanges(selectedPersona, bgModified);
    submitChanges(selectedPersona, basicInfoModified);
    /*Be careful!!! should covert it into JSON format!!!*/
    sessionStorage.setItem('basicInfoModified', JSON.stringify({}));
    sessionStorage.setItem('bgModified', JSON.stringify({}));
}

async function discardChanges() {
    console.log("Discarding changes...");
    localStorageDisplay = JSON.stringify(localStorage);
    selected_persona = JSON.parse(localStorage.getItem('selectedPersona'));
    console.log(selected_persona);
    const response = await fetch('http://localhost:8000/restorelocalstorage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selected_persona),
    });
    const restored_persona = await response.json();
    console.log(restored_persona);
    localStorage.setItem('selectedPersona', JSON.stringify(restored_persona));

    // 重新加载当前界面
    current_page = sessionStorage.getItem('currentPage');
    currentPageUrl = current_page + '.html';
    window.location.href = currentPageUrl;
}



document.addEventListener('DOMContentLoaded', function () {
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate'); 
    const confirmDiscardButtons = document.querySelectorAll('.confirmDiscard');

    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            saveAllFiled();
            setButtonStatus(false);
            setButtonVisibility();
        });
    });

    saveUpdateButtons.forEach(button => {
        button.addEventListener('click', function () {
            /* TODO Update */
            saveAllFiled();
            setButtonStatus(false);
            setButtonVisibility();
        });
    });

    confirmDiscardButtons.forEach(button => {
        button.addEventListener('click', function () {
            discardChanges();
            setButtonStatus(false);
            setButtonVisibility();
        });
    });

    
    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 选择所有的 infoEdit 元素
        const infoEdits = document.querySelectorAll('.infoEdit');

        // 创建一个回调函数，当观察到的元素发生变化时会调用该函数
        const callback = (mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    //要看是否需要改变，即changeList是否为空
                    whetherChangeButtonStatus(true);
                }
            }
        }

        // 为每个 infoEdit 创建一个 MutationObserver 实例
        const observers = [];
        infoEdits.forEach(infoEdit => {
            const observer = new MutationObserver(callback);

            // 配置观察选项
            const config = {
                childList: true,  // 监听子节点的更改
                subtree: true,    // 监听整个子树中的节点变化
            };


            observers.push({ observer, infoEdit, config });
        });

        // 初始化完成后再启用观察器
        observers.forEach(({ observer, infoEdit, config }) => {
            observer.observe(infoEdit, config);
        });
    });
    function whetherChangeButtonStatus(flag) {
        //to see something has been changed or not

        async function getResult() {
            let result = await getChangedList();
            if (result === true) {
                setButtonStatus(flag);
                setButtonVisibility();
            }
        }
        getResult();
    }

});

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
        else if (activateButtonDisabled === 'false'){
            button.style.display = 'block'; 
            button.disabled = false; 
            button.style.backgroundColor = ''; 
            button.style.cursor = '';
            button.style.opacity = ''; 
        }
    });
}

function setButtonStatus(flag) {
    sessionStorage.setItem('saveButtonVisible', flag);
    sessionStorage.setItem('discardButtonVisible', flag);
    sessionStorage.setItem('activateButtonDisabled', flag);
}



function fetchChangedList() {
    let selectedPersona = JSON.parse(localStorage.getItem('selectedPersona'));

    return fetch('http://localhost:8000/identifychange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(selectedPersona),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // 解析 JSON 并返回解析后的数据
        });
}


async function getChangedList() {
    try {
        let changeDict = await fetchChangedList(); // 等待 fetchChangedList 完成并返回结果
        let listOfChangesElements = document.querySelectorAll(".listOfChanges");
        if (Object.keys(changeDict).length === 0) {
            //No update
            return false;
            listOfChangesElements.forEach(listOfChanges => {
                listOfChanges.textContent = 'No changes';
                listOfChanges.style.display = "flex";

                listOfChanges.style.justifyContent = "center";
                listOfChanges.style.textAlign = "center";
                listOfChanges.style.fontSize = "1.3em";
                listOfChanges.style.color = "#868585";
            });
            return false;
        }
        listOfChangesElements.forEach(listOfChanges => {
            // Clear existing content in each listOfChanges element
            listOfChanges.innerHTML = '';

            // Append new items to each listOfChanges element
            Object.entries(changeDict).forEach(([key, value]) => {
                //alert("key = " + key + ", value = " + value);
                const containerDiv = document.createElement('div');
                containerDiv.classList.add('changeItem');

                const keyDiv = document.createElement('div');
                keyDiv.classList.add('changeKey');
                keyDiv.textContent = key;

                const valueDiv = document.createElement('div');
                valueDiv.classList.add('changeValue');
                valueDiv.textContent = value;

                containerDiv.appendChild(keyDiv);
                containerDiv.appendChild(valueDiv);

                listOfChanges.appendChild(containerDiv);
            });
        });
        return true;
    } catch (error) {
        console.error('Error fetching changed list:', error);
    }
}


/*
document.addEventListener('DOMContentLoaded', function () {
    function showPopupMessage(message) {
        var popupMessages = document.querySelectorAll(".popup-message");
        popupMessages.forEach(popupMessage => {
            popupMessage.textContent = message;
            popupMessage.style.display = 'block';
            setTimeout(function () {
                popupMessage.style.display = 'none';
                document.getElementById('saveModal').style.display = 'none';
            }, 1000); // Message shows for 1 second
        });
    }

    function showPopupMessageAndBack(message) {
        var popupMessages = document.querySelectorAll(".popup-message");
        popupMessages.forEach(popupMessage => {
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
        });
    }

    function onlyExit() {
        var discardModals = document.querySelectorAll(".discardModal");
        discardModals.forEach(discardModal => {
            discardModals.style.display = 'none';
        });
    }

    function backToSelect() {
        window.location.href = "../popup.html";
    }

    var saveUpdates = document.querySelectorAll(".saveUpdate");
    saveUpdates.forEach(saveUpdate => {
        saveUpdate.addEventListener('click', function () {
            showPopupMessage('Save & Update Successful!');
        });
    });

    var saveNoUpdates = document.querySelectorAll(".saveNoUpdate");
    saveNoUpdates.forEach(saveNoUpdate => {
        saveNoUpdate.addEventListener('click', function () {
            showPopupMessage('Only Saved Changes!');
        });
    });

    var Cancels = document.querySelectorAll(".Cancel");
    Cancels.forEach(Cancel => {
        Cancel.addEventListener('click', function () {
            onlyExit();
        });
    });

    var Confirms = document.querySelectorAll(".Confirm");
    Confirms.forEach(Confirm => {
        Confirm.addEventListener('click', function () {
            onlyExit();
        });
    });

    var saveUpdateBacks = document.querySelectorAll(".saveUpdateBack");
    saveUpdateBacks.forEach(saveUpdateBack => {
        saveUpdateBack.addEventListener('click', function () {
            showPopupMessageAndBack('Save & Update Successful!');
        });
    });

    var saveBacks = document.querySelectorAll(".saveBack");
    saveBacks.forEach(saveBack => {
        saveBack.addEventListener('click', function () {
            showPopupMessageAndBack('Only Saved Changes!');
        });
    });
    var discardBacks = document.querySelectorAll(".discardBack");
    discardBacks.forEach(discardBack => {
        discardBack.addEventListener('click', function () {
            backToSelect();
        });
    });
});
*/

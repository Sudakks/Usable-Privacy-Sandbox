/*
 由于不同的页面会有独立的执行上下文
 globalVar.js 中的全局变量在页面跳转时不会保持其值!!!!
 所以利用localStorage
 */
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
            id: persona.userId, // 传递 persona ID
            changes: modifiedFields, // 只发送变更的字段
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
}


document.addEventListener('DOMContentLoaded', function () {
    // 选择所有具有 'saveNoUpdate' class 的按钮
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate');
    const confirmDiscardButtons = document.querySelectorAll('.confirmDiscard');

    // 遍历所有按钮，并添加 click 事件监听器
    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            saveAllFiled();
        });
    });

    saveUpdateButtons.forEach(button => {
        button.addEventListener('click', function () {
            /* TODO需要更新 */
            saveAllFiled();
        });
    });

    var confirmBack = document.getElementById("confirmBack");
    confirmBack.addEventListener("click", () => {
        const selectedOption = document.querySelector('input[name="backOption"]:checked');

        if (selectedOption) {
            // 获取选中的值
            const selectedValue = selectedOption.value;
            //console.log('选中的值是:', selectedValue);
            switch (selectedValue) {
                case "save-update":
                    /* TODO需要更新 */
                    saveAllFiled();
                    break;
                case "save-only":
                    saveAllFiled();
                    break;
                case "discard":
                    //TODO
                    break;
                default:
                    console.error("No matched selectedValue");
            }
        } else {
            console.log('没有选中任何选项');
        }
    });
        
    
    confirmDiscardButtons.forEach(button => {
        button.addEventListener('click', function () {
            /*
             * TODO
             * 点击此按键之后丢弃所有的更改
             * 方案：
             * 1. 直接从json文件中导入
             * 2. 记住修改的内容，只retrieve修改的项（操作起来不太方便）
             */
        });
    });
});



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

document.addEventListener('DOMContentLoaded', function () {
    // 选择所有具有 'saveNoUpdate' class 的按钮
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate');

    // 遍历所有按钮，并添加 click 事件监听器
    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            let bgModified = JSON.parse(sessionStorage.getItem('bgModified')) || {};
            let basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {};
            let selectedPersona = JSON.parse(sessionStorage.getItem('selectedPersona')) || {};
            submitChanges(selectedPersona, bgModified);
            submitChanges(selectedPersona, basicInfoModified);
        });
    });

    saveUpdateButtons.forEach(button => {
        button.addEventListener('click', function () {
            /* TODO需要更新 */
            let bgModified = JSON.parse(sessionStorage.getItem('bgModified')) || {};
            let basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {};
            let selectedPersona = JSON.parse(sessionStorage.getItem('selectedPersona')) || {};
            submitChanges(selectedPersona, bgModified);
            submitChanges(selectedPersona, basicInfoModified);
        });
    });
});



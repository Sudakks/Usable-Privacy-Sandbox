/*
 ���ڲ�ͬ��ҳ����ж�����ִ��������
 globalVar.js �е�ȫ�ֱ�����ҳ����תʱ���ᱣ����ֵ!!!!
 ��������localStorage
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
            id: persona.userId, // ���� persona ID
            changes: modifiedFields, // ֻ���ͱ�����ֶ�
        }),
    }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    // ѡ�����о��� 'saveNoUpdate' class �İ�ť
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate');

    // �������а�ť������� click �¼�������
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
            /* TODO��Ҫ���� */
            let bgModified = JSON.parse(sessionStorage.getItem('bgModified')) || {};
            let basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {};
            let selectedPersona = JSON.parse(sessionStorage.getItem('selectedPersona')) || {};
            submitChanges(selectedPersona, bgModified);
            submitChanges(selectedPersona, basicInfoModified);
        });
    });
});



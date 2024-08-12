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

function saveAllFiled() {
    let bgModified = JSON.parse(sessionStorage.getItem('bgModified')) || {};
    let basicInfoModified = JSON.parse(sessionStorage.getItem('basicInfoModified')) || {};
    let selectedPersona = JSON.parse(sessionStorage.getItem('selectedPersona')) || {};
    submitChanges(selectedPersona, bgModified);
    submitChanges(selectedPersona, basicInfoModified);
}


document.addEventListener('DOMContentLoaded', function () {
    // ѡ�����о��� 'saveNoUpdate' class �İ�ť
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate');
    const confirmDiscardButtons = document.querySelectorAll('.confirmDiscard');

    // �������а�ť������� click �¼�������
    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            saveAllFiled();
        });
    });

    saveUpdateButtons.forEach(button => {
        button.addEventListener('click', function () {
            /* TODO��Ҫ���� */
            saveAllFiled();
        });
    });

    var confirmBack = document.getElementById("confirmBack");
    confirmBack.addEventListener("click", () => {
        const selectedOption = document.querySelector('input[name="backOption"]:checked');

        if (selectedOption) {
            // ��ȡѡ�е�ֵ
            const selectedValue = selectedOption.value;
            //console.log('ѡ�е�ֵ��:', selectedValue);
            switch (selectedValue) {
                case "save-update":
                    /* TODO��Ҫ���� */
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
            console.log('û��ѡ���κ�ѡ��');
        }
    });
        
    
    confirmDiscardButtons.forEach(button => {
        button.addEventListener('click', function () {
            /*
             * TODO
             * ����˰���֮�������еĸ���
             * ������
             * 1. ֱ�Ӵ�json�ļ��е���
             * 2. ��ס�޸ĵ����ݣ�ֻretrieve�޸ĵ������������̫���㣩
             */
        });
    });
});



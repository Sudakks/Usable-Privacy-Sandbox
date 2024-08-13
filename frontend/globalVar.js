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

async function discardChanges(PageUrl){
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

    // // 重新加载页面
    // current_page = sessionStorage.getItem('currentPage');
    // currentPageUrl = current_page + '.html';
    window.location.href = PageUrl;
}


document.addEventListener('DOMContentLoaded', function () {
    // ѡ�����о��� 'saveNoUpdate' class �İ�ť
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate');
    const confirmDiscardButtons = document.querySelectorAll('.confirmDiscard');

    // �������а�ť�������� click �¼�������
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
                    discardChanges();
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
            discardChanges();
        });
    });
});



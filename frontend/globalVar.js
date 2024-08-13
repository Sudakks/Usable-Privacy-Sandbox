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
    sessionStorage.setItem('basicInfoModified', {});
    sessionStorage.setItem('bgModified', {});

}

async function discardChanges(){
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
}


document.addEventListener('DOMContentLoaded', function () {
    const saveButtons = document.querySelectorAll('.saveNoUpdate');
    const saveUpdateButtons = document.querySelectorAll('.saveUpdate'); 
    const discardButtons = document.querySelectorAll('.discardButton');

    //const confirmDiscardButtons = document.querySelectorAll('.confirmDiscard');

    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            saveAllFiled();
        });
    });

    saveUpdateButtons.forEach(button => {
        button.addEventListener('click', function () {
            /* TODO Update */
            saveAllFiled();
        });
    });

    discardButtons.forEach(button => {
        button.addEventListener('click', function () {
            discardChanges();
        });
    });

});

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
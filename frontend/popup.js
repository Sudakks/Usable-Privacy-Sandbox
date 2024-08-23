/*search for all info*/
document.getElementById('searchInput').addEventListener('input', function () {
    var input = this.value.toLowerCase();
    var personas = document.getElementsByClassName('persona');

    Array.from(personas).forEach(function (persona) {
        var infoSpans = persona.querySelectorAll('.persona-info span');
        var matches = false;

        infoSpans.forEach(function (span) {
            if (span.textContent.toLowerCase().includes(input)) {
                matches = true;
            }
        });

        if (matches) {
            persona.style.display = '';
        } else {
            persona.style.display = 'none';
        }
    });
});

// 处理右键菜单点击事件的函数
function handleContextMenuAction(action, persona) {
    //alert("persona in handle is " + persona.userId);
    //alert("action is " + action);
    if (action === 'Favourite' || action === 'Unfavourite') {
        console.log(`${action} clicked for: ${persona.name}`);
        persona.favourite = !persona.favourite; // 更新属性
        // 发送请求到 FastAPI 服务器
        fetch('http://localhost:8000/changefavourite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: persona.userId }) // 假设 persona 对象中有 id 属性
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log('Server response:', data.message);
                } else {
                    console.error('Failed to change favourite status:', data.detail);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else if (action === 'Delete') {
        // 发送请求到 FastAPI 服务器
        fetch('http://localhost:8000/deletepersona', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: persona.userId }) // 假设 persona 对象中有 id 属性
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert("successfully delete!");
                    console.log('Server response:', data.message);
                } else {
                    console.error('Failed to delete persona:', data.detail);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function setRightClick(HTML, personaDiv, persona) {
    personaDiv.addEventListener('contextmenu', function (e) {
        e.preventDefault();

        // Create the context menu element
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = HTML;

        // Position the menu at the mouse location
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;

        document.body.appendChild(contextMenu);

        // Remove the menu when clicking anywhere else
        document.addEventListener('click', function () {
            contextMenu.remove();
        }, { once: true });
        contextMenu.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', function () {
                const action = item.id;

                handleContextMenuAction(action, persona);
                contextMenu.remove(); // 移除菜单
                window.location.href = "./popup.html";
            });
        });

    });
}


async function loadPersonas() {
    try {
        const response = await fetch('http://localhost:8000/loadpersona');
        const personas = await response.json();
        const personaList = document.getElementById('personaList');
        personaList.innerHTML = ''; // Clear any existing personas
        var flag = false; // to separate normal and favourite persona


        personas.forEach((persona, index) => {
            // Create a div for each persona
            const personaDiv = document.createElement('div');
            personaDiv.id = `persona${index + 1}`;
            alert("img Url = " + persona.profileImgUrl);
            let loadInfo = `
                <img src="${base64Prefix}${persona.profileImgUrl}" alt="${persona.name}" class="avatar">
                    <div class="persona-info">
                        <span class="name">${persona.name}</span>
                        <span class="age">${persona.age}</span>
                        <span class="occupation">${persona.job}</span>
                        <span class="location">${persona.city}</span>
                    </div>
                    <button class="activate-btn"><i class="fa-solid fa-check"></i>Activate</button>
                `;

            if (persona.favourite === true) {
                personaDiv.innerHTML = `
                <div class="persona" style="background-color:rgba(140, 199, 255, 0.2); margin-bottom:3px;">
                    ${loadInfo}
                </div>
            `;
            }
            else if (persona.favourite === false) {
                var display = ``;
                var line = ``;
                if (!flag) {
                    //alert("yes and name is " + persona.name);
                    flag = true;
                    line = `<hr style="border: none; border-top: 1px solid #999999; margin: 5px 0;">`;
                    display = `style="margin-top: 10px;"`;  // Correctly setting margin-top
                }
                personaDiv.innerHTML = `
                ${line}
                <div class="persona" ${display}>
                    ${loadInfo}
                </div>
            `;
            }
            // Add click event listener for persona
            personaDiv.addEventListener('click', function () {
                // Handle persona click event to go to persona detail page
                console.log('Persona clicked: ' + persona.name);
                // Save the selected persona to local storage
                // if the persona has been clicked, add new key and keyvalue
                localStorage.setItem('selectedPersona', JSON.stringify(persona));
                // Go to the next page (overview)
                window.location.href = 'overview_page/overview.html';
            });

            if (persona.favourite === true) {
                setRightClick(`
                <div id="Unfavourite" class="context-item"><i class="fa-solid fa-star" style="color: #FFD43B; margin-right:0.5em"></i>Unfavourite</div>
                <div id="Delete" class="context-item"><i class="fa-solid fa-trash" style="margin-right:0.5em"></i>Delete</div>
            `, personaDiv, persona);
                personaList.prepend(personaDiv);

            }
            else if (persona.favourite === false) {
                setRightClick(`
                <div id="Favourite" class="context-item"><i class="fa-solid fa-star" style="color: #FFD43B; margin-right:0.5em"></i>Favourite</div>
                <div id="Delete" class="context-item"><i class="fa-solid fa-trash" style="margin-right:0.5em"></i>Delete</div>
            `, personaDiv, persona);
                personaList.appendChild(personaDiv);
            }
            else {
                alert("can't be others!!!");
            }
        });
        // Add a "Create New Persona" component

        const newPersonaDiv = document.createElement('div');
        newPersonaDiv.className = 'newPersona';
        newPersonaDiv.id = 'addNewPersona';
        newPersonaDiv.innerHTML = `
            <img src="images/addNew.png" alt="addNewPersona" class="avatar">
            <div class="text">
                <div class="textItem">No matches?</div>
                <div class="textItem"> Create New Persona</div>
            </div>
        `;
        newPersonaDiv.addEventListener("click", () => {
            window.location.href = 'newPersona/newPersona.html';
        });

        personaList.appendChild(newPersonaDiv);

    } catch (error) {
        console.error('Error loading personas:', error);
    }
}

// Call loadPersonas when the page loads
document.addEventListener('DOMContentLoaded', loadPersonas);

document.addEventListener("DOMContentLoaded", () => {
    /*
    sessionStorage.setItem('saveButtonVisible', false);
    sessionStorage.setItem('discardButtonVisible', false);
    sessionStorage.setItem('activateButtonDisabled', true);
    */
});






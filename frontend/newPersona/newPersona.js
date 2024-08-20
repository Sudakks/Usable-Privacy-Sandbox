document.addEventListener('DOMContentLoaded', function () {

    const confirmButton = document.querySelector('.confirmButton');
    confirmButton.style.display = 'block';
    confirmButton.disabled = true;
    confirmButton.style.backgroundColor = '#ccc';
    confirmButton.style.cursor = 'not-allowed';
    confirmButton.style.opacity = '0.6';


    var dspFrame = document.getElementById('dspFrame');
    var displayText = document.getElementById('displayText');
    var editInput = document.getElementById('editInput');
    var persona_profile = '';

    dspFrame.addEventListener('click', () => {
        if (document.activeElement !== editInput) { // 仅在输入框未获得焦点时执行
            displayText.style.display = 'none';
            //editInput.value = "";
            editInput.style.display = 'block';
            editInput.focus();
        }
    });

    editInput.addEventListener('blur', () => {
        updateDisplayText();
    });

    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            updateDisplayText();

        }
    });

    function updateDisplayText() {
        const trimmedValue = editInput.value.trim();
        if (trimmedValue) {
            displayText.textContent = trimmedValue;
        }
        editInput.style.display = 'none';
        displayText.style.display = 'block';
    }

    const generateDesBtn = document.getElementById('generateDes');
    const confirmBtn = document.getElementById('Confirm');
    const generateImgBtn = document.getElementById('generateImg');

    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim();
        generateDesBtn.textContent = "Loading...";
        if (guidance) {
            chrome.runtime.sendMessage({ action: 'generateDescription', guidance: guidance }, function (response) {
                if (response && response.description) {
                    editInput.value = response.description;
                    persona_profile = response.description;
                    displayText.textContent = response.description;
                    editInput.style.display = 'none';
                    displayText.style.display = 'block';
                    generateDesBtn.textContent = "Generate description";
                }
            });
        } else {
            alert('Please enter some guidance in the input field.');
            generateDesBtn.textContent = "Generate description"; // 确保在没有 guidance 的情况下也能恢复按钮文字
        }

        //change confirm color
        confirmButton.style.display = 'block';
        confirmButton.disabled = false;
        confirmButton.style.backgroundColor = '';
        confirmButton.style.cursor = '';
        confirmButton.style.opacity = '';
    });

    confirmBtn.addEventListener('click', function () {
        var profile = editInput.value;
        if (profile) {
            chrome.runtime.sendMessage({ action: 'confirmPersona', profile: profile }, function (response) {
                console.log('Confirming...');
                if (response) {
                    var persona_json = response.persona_json;
                    console.log(persona_json);
                    if (persona_json === "Error generating persona."){
                        alert('Fail to generate persona. Please try again.');
                    }
                    else{
                        chrome.runtime.sendMessage({ action: 'savePersona', persona_json: persona_json }, function (response) {});
                        console.log('Persona json saved successfully'); 
                        //var userId = persona_json['data']['userId'] - 1;
                        //userId = userId.toString();
                        //console.log(userId);         
                        let newpersona; // 声明在外部作用域中
                        fetch('http://localhost:8000/newpersonalocalstorage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(persona_json) 
                        })
                        .then(response => response.json())
                        .then(data => {
                            newpersona = data; // 将数据赋值给外部声明的变量
                            console.log(newpersona);
                            localStorage.setItem('selectedPersona', JSON.stringify(newpersona));
                            window.location.href = "../overview_page/overview.html";
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });                    
                    }
                } else {
                    alert('Failed to confirm persona.');
                }
            });
        } else {
            alert('Please generate a description first.');
        }
    });

    generateImgBtn.addEventListener("click", function () {
        generateImgBtn.textContent = "Loading...";
        const imageGuidance = displayText.textContent;
        if (imageGuidance) {
            chrome.runtime.sendMessage({ action: 'generateImage', guidance: imageGuidance }, function (response) {
                if (response && response.imageUrl) {
                    const imageUrl = response.imageUrl;
                    document.getElementById("photoFrame").style.backgroundImage = `url(${imageUrl})`;
                    alert("Image URL: " + imageUrl);
                    generateImgBtn.textContent = "Generate Image";
                } else {
                    alert('Failed to generate image.');
                    generateImgBtn.textContent = "Generate Image";
                }
            });
        } else {
            alert('Please enter some guidance in the input field.');
            generateImgBtn.textContent = "Generate Image";
        }
    });

    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });
});

// async function loadPersona() {
//     try {
//         const response = await fetch('http://localhost:8000/loadpersona');
//         const personas = await response.json(); // 等待解析为 JSON
//         console.log(personas.length);
//         const newPersona = personas[personas.length - 1];
//         userId = newPersona.get('userId');
//         console.log(userId);
//         localStorage.setItem('selectedPersona', JSON.stringify(newPersona));
//         //window.location.href = "../overview_page/overview.html";
//     } catch (error) {
//         console.error('Error loading persona:', error);
//     }
// }
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
    let img_base64;


    generateDesBtn.addEventListener('click', function () {
        var guidance = displayText.textContent.trim();
        generateDesBtn.textContent = "Loading...";
        generateImgBtn.textContent = "Loading...";
        generateImgBtn.disabled = true;
        generateImgBtn.style.display = 'block';
        generateImgBtn.style.backgroundColor = '#ccc';
        generateImgBtn.style.cursor = 'not-allowed';
        generateImgBtn.style.opacity = '0.6';
        if (guidance) {
            chrome.runtime.sendMessage({ action: 'generateDescription', guidance: guidance }, function (response) {
                if (response && response.description) {
                    editInput.value = response.description;
                    persona_profile = response.description;
                    displayText.textContent = response.description;
                    editInput.style.display = 'none';
                    displayText.style.display = 'block';
                    generateDesBtn.textContent = "Generate description";
                    loadImg(guidance);
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
        confirmButton.textContent = "Loading...";
        var profile = editInput.value;
        if (profile) {
            //convert profile text into json
            chrome.runtime.sendMessage({ action: 'confirmPersona', profile: profile }, function (response) {
                if (response) {
                    var persona_json = response.persona_json;
                    console.log(persona_json);
                    if (persona_json === "Error generating persona."){
                        alert('Fail to generate persona. Please try again.');
                    }
                    else {
                        //save as json
                        //TODO
                        chrome.runtime.sendMessage({ action: 'savePersona', persona_json: persona_json, img_base64: img_base64 }, function (response) {
                            if (response.data) {
                                console.log('Persona json saved successfully');        
                                let newpersona; // 声明在外部作用域中
                                const persona_json = response.data;

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
                            else {
                                console.error('Error: ', response.message);
                            }
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
        generateImgBtn.disabled = true;
        generateImgBtn.style.display = 'block';
        generateImgBtn.style.backgroundColor = '#ccc';
        generateImgBtn.style.cursor = 'not-allowed';
        generateImgBtn.style.opacity = '0.6';
        generateImgBtn.textContent = "Loading...";
        const imageGuidance = displayText.textContent;
        if (imageGuidance) {
            loadImg(imageGuidance);
        } else {
            alert('Please enter some guidance in the input field.');
            generateImgBtn.textContent = "Generate Image";
        }
    });

    function loadImg(imageGuidance) {
        chrome.runtime.sendMessage({ action: 'generateImage', guidance: imageGuidance }, function (response) {
            if (response && response.base64Image) {
                //const imageUrl = response.imageUrl;
                const base64Image = response.base64Image;
                img_base64 = response.base64Image;

                // Set the image URL as background image
                const dataUrl = `data:image/png;base64,${base64Image}`;
                document.getElementById("photoFrame").style.backgroundImage = `url(${dataUrl})`;
                //document.getElementById("photoFrame").style.backgroundImage = `url(${imageUrl})`;
                photoFrame.style.backgroundSize = 'cover'; // Ensure the image covers the frame
                photoFrame.style.backgroundPosition = 'center'; // Center the image
                photoFrame.style.backgroundRepeat = 'no-repeat'; // Prevent repeating the image
                alert("Image base64: " + base64Image);
            } else {
                alert('Failed to generate image!!!');
            }
            generateImgBtn.textContent = "Generate Image";
            generateImgBtn.disabled = false;
            generateImgBtn.style.display = 'block';
            generateImgBtn.style.backgroundColor = '';
            generateImgBtn.style.cursor = '';
            generateImgBtn.style.opacity = '';
        });
    }


    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });
});


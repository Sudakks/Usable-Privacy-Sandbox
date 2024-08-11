document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with the id 'saveNoUpdate'
    const saveNoUpdateBtns = document.querySelectorAll('#saveNoUpdate');

    // Attach click event listeners to each button
    saveNoUpdateBtns.forEach(button => {
        button.addEventListener('click', function () {
            //sendBasicInfoChanges();
            sendBgChanges();
        });
    });
});
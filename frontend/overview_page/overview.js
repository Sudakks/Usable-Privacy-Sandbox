document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";       
    });
});


// Retrieve the persona information from localStorage
const selectedPersona = JSON.parse(localStorage.getItem('selectedPersona'));

// Check if persona data is available
if (selectedPersona) {
    // Populate the overview page with the persona data
    document.getElementById('persona-name').textContent = selectedPersona.name;
    document.getElementById('persona-age').textContent = selectedPersona.age;
    document.getElementById('persona-job').textContent = selectedPersona.job;
    document.getElementById('persona-city').textContent = selectedPersona.city;
    document.getElementById('persona-img').src = "../" + selectedPersona.profileImgUrl;
    document.getElementById('persona-online_behavior').textContent = selectedPersona.online_behavior;
} else {
    console.error('No persona data found');
}
document.addEventListener('DOMContentLoaded', () => {
    showSection('overview');
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

function goBack() {
    // Implement the logic to go back to the previous page
    alert("Going back to the previous selection.");
}

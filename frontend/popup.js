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

async function loadPersonas() {
    try {
        const response = await fetch('http://localhost:8000/loadpersona');
        const personas = await response.json();

        const personaList = document.getElementById('personaList');
        personaList.innerHTML = ''; // Clear any existing personas

        personas.forEach((persona, index) => {
            // Create a div for each persona
            const personaDiv = document.createElement('div');
            //personaDiv.id = `persona${index + 1}`;
            personaDiv.id = persona.id;

            // Add persona content
            personaDiv.innerHTML = `
                <div class="persona">
                    <img src="${persona.profileImgUrl}" alt="${persona.name}" class="avatar">
                    <div class="persona-info">
                        <span class="name">${persona.name}</span>
                        <span class="age">${persona.age}</span>
                        <span class="occupation">${persona.job}</span>
                        <span class="location">${persona.city}</span>
                    </div>
                    <button class="activate-btn"><i class="fa-solid fa-check"></i>Activate</button>
                </div>
            `;

            // Add click event listener for persona
            personaDiv.addEventListener('click', function () {
                // Handle persona click event to go to persona detail page
                //console.log('Persona clicked: ' + persona.name);
                //store the persona
                localStorage.setItem('selectedPersona', JSON.stringify(persona));
                // Go to the next page (overview)
                window.location.href = 'overview_page/overview.html';
            });

            // Append to the persona list
            personaList.appendChild(personaDiv);
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

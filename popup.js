document.addEventListener('DOMContentLoaded', function () {
    const personas = document.querySelectorAll('.persona');
    
    personas.forEach(persona => {
      persona.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#f0f0f0';
          this.querySelector('.activate-btn').style.display = 'inline-block';
      });
      
      persona.addEventListener('mouseout', function () {
        this.style.backgroundColor = '#ffffff';
          this.querySelector('.activate-btn').style.display = 'none';
      });
      
      persona.addEventListener('click', function () {
        // Handle persona click event to go to persona detail page
          console.log('Persona clicked: ' + this.querySelector('.name').textContent);
        //go to next page£¨overview£©
          window.location.href = 'overview_page/overview.html';
      });
    });
});


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


  
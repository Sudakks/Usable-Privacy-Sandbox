document.addEventListener('DOMContentLoaded', function () {
    const personas = document.querySelectorAll('.persona');
    
    personas.forEach(persona => {
      persona.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#f0f0f0';
        this.querySelector('.activate').style.display = 'inline-block';
      });
      
      persona.addEventListener('mouseout', function () {
        this.style.backgroundColor = '#ffffff';
        this.querySelector('.activate').style.display = 'none';
      });
      
      persona.addEventListener('click', function () {
        // Handle persona click event to go to persona detail page
          console.log('Persona clicked: ' + this.querySelector('.name').textContent);
        //go to next page£¨overview£©
          window.location.href = 'overview_page/overview.html';
      });
    });
  });
  
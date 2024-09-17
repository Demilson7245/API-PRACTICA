// Puedes agregar funcionalidades adicionales aquí si lo deseas
document.addEventListener("DOMContentLoaded", function () {
  console.log("Página cargada y lista.");

  // Si quieres agregar funcionalidad de scroll suave
  const enlaces = document.querySelectorAll("nav ul li a");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      const seccion = document.querySelector(this.getAttribute("href"));
      seccion.scrollIntoView({ behavior: "smooth" });
    });
  });
});

let currentIndex = 0;
var idP = 1;
let characters = [];

function mostrarPersonaje() {
  $.ajax({
    type: "GET",
    url: "https://dragonball-api.com/api/characters?page=1&limit=58",
    success: function (data) {
      characters = data.items;
      createCarousel();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching data: ", textStatus, errorThrown);
      $("#personajesDB").html(
        "<p>Error al cargar los personajes. Por favor, intenta más tarde.</p>"
      );
    },
  });
}

function createCarousel() {
  const carouselContainer = document.getElementById("personajesDB");
  carouselContainer.innerHTML = ""; // Limpiar el contenedor
  console.log(characters);
  characters.forEach((character, index) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    const img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;
    item.appendChild(img);
    const info = document.createElement("input");
    info.type = "hidden";
    info.value = character.id;
    item.appendChild(info);
    if (index === 0) item.classList.add("active");

    item.innerHTML += `
                    <p>
                        Nombre: ${character.name}<br>
                        Ki: ${character.ki}<br>
                        MaxKi: ${character.maxKi}<br>
                        Raza: ${character.race}<br>
                        Género: ${character.gender}
                    </p>
                `;

    const button = document.createElement("button");
    button.textContent = "Ver más";
    button.onclick = () => verMas(idP);
    item.appendChild(button);
    // item.onclick = () => id(character.id);
    carouselContainer.appendChild(item);
  });

  // Agregar botones de navegación
  const prevButton = document.createElement("button");
  prevButton.innerHTML = "&#10094;";
  prevButton.classList.add("carousel-button", "prev");
  prevButton.onclick = () => changeSlide(-1);

  const nextButton = document.createElement("button");
  nextButton.innerHTML = "&#10095;";
  nextButton.classList.add("carousel-button", "next");
  nextButton.onclick = () => changeSlide(1);

  carouselContainer.appendChild(prevButton);
  carouselContainer.appendChild(nextButton);
}

function changeSlide(direction) {
  const items = document.querySelectorAll(".carousel-item");
  items[currentIndex].classList.remove("active");
  idP += direction;
  currentIndex += direction;
  if (currentIndex >= items.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = items.length - 1;
  if (idP >= items.length) idP = 1;
  if (idP < 1) idP = items.length;

  items[currentIndex].classList.add("active");
}

// Iniciar el carrusel cuando se cargue la página
$(document).ready(mostrarPersonaje);

function id(a) {
  alert(a);
}

function verMas(id) {
  $.ajax({
    type: "GET",
    url: "https://dragonball-api.com/api/characters/" + id,
    success: function (data) {
       // Obtener el modal
    var modal = document.getElementById("myModal");

    // Obtener el botón de cerrar
    var span = document.getElementsByClassName("close")[0];

    // Obtener la imagen del personaje
    var characterImage = document.getElementById("characterImage");

    // Datos del personaje

      document.getElementById("modalImage").src = data["image"];
      document.getElementById("modalName").textContent = data["name"];
      document.getElementById("modalDescription").textContent = data["description"];
      modal.style.display = "block";
  

    // Cerrar el modal
    span.onclick = function() {
      modal.style.display = "none";
    };

    // Cerrar el modal si se hace clic fuera del contenido
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
      
    },
  });
}

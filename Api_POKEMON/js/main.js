const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}
document.getElementById('searchInputt').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();

    if (searchValue) {
        fetch(`https://pokeapi.co/api/v2/type/${searchValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontró el tipo de Pokémon");
                }
                return response.json();
            })
            .then(data => {
                mostrarPokemonPorTipo(data.pokemon);
            })
            .catch(error => {
                console.error('Error fetching Pokémon:', error);
                document.getElementById('listaPokemon').innerHTML = `<p>Filtrando pokemones "${searchValue}".</p>`;
            });
    }
});

function mostrarPokemonPorTipo(pokemons) {
    const pokemonContainer = document.getElementById('listaPokemon');
    pokemonContainer.innerHTML = '';  // Limpiar resultados anteriores

    pokemons.forEach(pokemonEntry => {
        const pokemonName = pokemonEntry.pokemon.name;

        // Obtener más detalles del Pokémon (como la imagen) con otra llamada a la API
        fetch(pokemonEntry.pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card');

                pokemonCard.innerHTML = `
                    <h3>${pokemonData.name}</h3>
                    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                    <p>Tipo: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
                `;

                pokemonContainer.appendChild(pokemonCard);
            });
    });
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
function buscarPokemon(nombre) {
    fetch(`${URL}${nombre.toLowerCase()}`)
        .then(response => response.json())
        .then(data => mostrarPokemon(data))
        .catch(() => {
            pokemonContainer.innerHTML = `<p>Pokémon no encontrado</p>`;
        });
}
searchButton.addEventListener("click", () => {
    const nombrePokemon = searchInput.value.trim();
    if (nombrePokemon) {
        buscarPokemon(nombrePokemon);
    }
});

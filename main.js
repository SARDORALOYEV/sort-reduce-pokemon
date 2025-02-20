// HTML elementlarini chaqiramiz
const pokemonForm = document.querySelector("#form");
const pokeInput = document.querySelector("#input");
const pokeSort = document.querySelector("#select");
const pokeWeightSort = document.querySelector("#select__weight");
const pokeHeightSort = document.querySelector("#select__height");
const pokeBox = document.querySelector("#pokewrapper");

const toggleSidebarBtn = document.querySelector("#toggleSidebar");
const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#closeSidebar");
const savedPokemonsList = document.querySelector("#savedPokemonsList");

let savedPokemons = JSON.parse(localStorage.getItem("savedPokemons")) || [];

toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    renderSavedPokemons();
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
});

function renderPokemon(poki) {
    pokeBox.innerHTML = "";

    if (poki.length === 0) {
        pokeBox.innerHTML = `<p class="errorr">Afsuski, ${pokeInput.value} POKEMON mavjud emas!</p>`;
        return;
    }

    poki.forEach(obyektlar => {
        const li = document.createElement("li");
        li.className = "item__poki";
        const isSaved = savedPokemons.some(p => p.num === obyektlar.num);
        
        li.innerHTML = `
            <div>
                <span class="item__num">${obyektlar.num}</span>
            </div>
            <h2 class="item__name">${obyektlar.name}</h2>
            <div class="center"><img src="${obyektlar.img}" alt="${obyektlar.name}"></div>
            <span> ${obyektlar.weight}</span><br>
            <span class="save material-symbols-outlined" data-id="${obyektlar.num}">
                ${isSaved ? "verified" : "star"}
            </span>
            <span> ${obyektlar.height}</span><br>
            <span> ${obyektlar.type.join(", ")}</span><br>
            <span class="bottom">${obyektlar.weaknesses.join(", ")}</span><br>
            <span class="timebaby">${obyektlar.spawn_time}</span>
        `;
        pokeBox.append(li);
    });

    document.querySelectorAll(".save").forEach(star => {
        star.addEventListener("click", () => {
            const pokemonId = star.dataset.id;
            const selectedPokemon = pokemons.find(p => p.num === pokemonId);

            if (!savedPokemons.some(p => p.num === selectedPokemon.num)) {
                savedPokemons.push(selectedPokemon);
                star.textContent = "verified";
            } else {
                savedPokemons = savedPokemons.filter(p => p.num !== selectedPokemon.num);
                star.textContent = "star";
            }

            localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
            renderSavedPokemons();
        });
    });
}

function renderSavedPokemons() {
    savedPokemonsList.innerHTML = "";

    if (savedPokemons.length === 0) {
        savedPokemonsList.innerHTML = "<p class='empty-msg'>Siz hech nima tanlamagansiz!</p>";
        return;
    }

    savedPokemons.forEach(pokemon => {
        const li = document.createElement("li");
        li.classList.add("saved-item");
        li.innerHTML = `
            <div class="saved-card">
                <img src="${pokemon.img}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <p>Vazni: ${pokemon.weight}</p>
                <p>Bo‘yi: ${pokemon.height}</p>
                <p>Turi: ${pokemon.type.join(", ")}</p>
                <button class="remove-btn" data-id="${pokemon.num}">❌</button>
            </div>
        `;
        savedPokemonsList.appendChild(li);
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            savedPokemons = savedPokemons.filter(p => p.num !== id);
            localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
            renderPokemon(pokemons);
            renderSavedPokemons();
        });
    });
}

pokemonForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const searchText = pokeInput.value.trim().toLowerCase();
    const weightFilter = pokeWeightSort.value;
    const heightFilter = pokeHeightSort.value;

    let filteredPokemons = pokemons.filter(poki => 
        poki.name.toLowerCase().includes(searchText)
    );

    if (weightFilter === "TomWeight") {
        filteredPokemons.sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
    } else if (weightFilter === "FromWeight") {
        filteredPokemons.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
    }

    if (heightFilter === "TomHeight") {
        filteredPokemons.sort((a, b) => parseFloat(a.height) - parseFloat(b.height));
    } else if (heightFilter === "FromHeight") {
        filteredPokemons.sort((a, b) => parseFloat(b.height) - parseFloat(a.height));
    }

    renderPokemon(filteredPokemons);
});

renderPokemon(pokemons);

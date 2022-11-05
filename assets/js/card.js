const $close = document.querySelector(".close"),
  $modal = document.querySelector(".modal"),
  $modalContent = document.querySelector(".modal-content"),
  $modalContainer = document.querySelector(".modal-container"),
  $pokeTypes = document.querySelector(".types"),
  $pokeStats = document.querySelector(".stats");

let POKE_API = "https://pokeapi.co/api/v2/pokemon/";

const capitalLetter = (name) => `${name[0].toUpperCase()}${name.slice(1)}`;

document.addEventListener("click", async (e) => {
  if (
    e.target.matches(".pokemon-card") ||
    e.target.matches(".pokemon-card > *")
  ) {
    $modalContainer.style.opacity = "1";
    $modalContainer.style.visibility = "visible";
    $modal.classList.toggle("modal-close");

    try {
      let res = await fetch(`${POKE_API}${e.target.dataset.id}/`),
        json = await res.json();

      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      pokemonData(json);
    } catch (err) {
      let message = err.statusText || "An error has occurred";
    }
  }

  if (e.target.matches(".close")) {
    $modal.classList.toggle("modal-close");
    setTimeout(() => {
      $modalContainer.style.opacity = "0";
      $modalContainer.style.visibility = "hidden";
    }, 400);
  }
});

window.addEventListener("click", (e) => {
  if (e.target.matches(".modal-container")) {
    $modal.classList.toggle("modal-close");
    setTimeout(() => {
      $modalContainer.style.opacity = "0";
      $modalContainer.style.visibility = "hidden";
    }, 400);
  }
});

const pokemonData = (data) => {
  const { stats, types, sprites } = data;

  $modalContainer.querySelector("h2").textContent = data.name;
  $modalContainer.querySelector("img").src = sprites.front_default;
  $modalContainer.querySelector("img").alt = capitalLetter(data.name);

  pokemonTypes(types);
  pokemonStats(stats);
};

const pokemonTypes = (types) => {
  $pokeTypes.innerHTML = "";
  types.forEach((type) => {
    const $typeText = document.createElement("div");
    $typeText.textContent = capitalLetter(type.type.name);
    $pokeTypes.appendChild($typeText);
  });
};

const pokemonStats = (stats) => {
  $pokeStats.innerHTML = "";
  stats.forEach((stat) => {
    const $statText = document.createElement("div");
    const $statAmount = document.createElement("div");
    $statText.textContent = capitalLetter(stat.stat.name);
    $statAmount.textContent = stat.base_stat;
    $pokeStats.appendChild($statText);
    $pokeStats.appendChild($statAmount);
  });
};

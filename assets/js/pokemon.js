const $main = document.querySelector("main"),
  $body = document.querySelector("body"),
  $loader = document.querySelector(".loader"),
  $template = document.getElementById("template-pokemon").content,
  $fragment = document.createDocumentFragment(),
  $links = document.querySelector(".links");

let API = "https://pokeapi.co/api/v2/pokemon/";

const capitalize = (name) => `${name[0].toUpperCase()}${name.slice(1)}`;

async function loadPokemons(url) {
  try {
    $body.classList.add("footer-static");
    $main.innerHTML = "";
    $links.innerHTML = "";

    $loader.style.display = "block";

    let res = await fetch(url),
      json = await res.json(),
      $prevLink,
      $nextLink;

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      try {
        let res = await fetch(json.results[i].url);
        pokemon = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        $template.querySelector("figure").dataset.id = pokemon.id;
        $template.querySelector("img").dataset.id = pokemon.id;
        $template.querySelector("figcaption").dataset.id = pokemon.id;
        $template.querySelector("img").src = `${pokemon.sprites.front_default}`;
        $template.querySelector("img").alt = `${capitalize(pokemon.name)}`;
        $template.querySelector("figcaption").textContent = `${capitalize(
          pokemon.name
        )}`;
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
      } catch (err) {
        let message = err.statusText || "An error has occurred";
        $template.querySelector(
          "figcaption"
        ).textContent = `Error ${err.status}: ${message}`;
        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
      }
    }
    $loader.style.display = "none";
    $main.innerHTML = "";
    $body.classList.remove("footer-static");
    $main.appendChild($fragment);
    $prevLink = json.previous ? `<a href="${json.previous}"><<<a/>` : "";
    $nextLink = json.next ? `<a href="${json.next}">>><a/>` : "";
    $links.innerHTML = `${$prevLink} ${$nextLink}`;
  } catch (err) {
    $main.innerHTML = "";
    let message = err.statusText || "An error has occurred.";
    $main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadPokemons(API));

document.addEventListener("click", (e) => {
  if (e.target.matches(".links a")) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute("href"));
  }
});

import { API_KEY, IMG, PERSON_IMG } from "./api.js";
import { loadMovies, loadTV } from "./movies.js";
import { loadPersons } from "./person.js";

const java = () => {
  const hero = document.querySelector("#homeHero");

  const topRatedBtn = document.querySelector("#topRatedBtn");
  const popularBtn = document.querySelector("#popularBtn");
  const tvBtn = document.querySelector("#tvBtn");
  const personBtn = document.querySelector("#personBtn");

  const searchForm = document.querySelector("#search_form");
  const searchInput = document.querySelector("#search_input");
  const personContent = document.querySelector("#personcontent");
  const filmContent = document.querySelector("#filmcontent");
  const headerContent = document.querySelector("#headerContent");
  const personPagination = document.querySelector("#personPagination");

  let currentPersonPage = 1;

  function hideHero() {
    if (hero) hero.classList.add("hidden");
  }

  topRatedBtn.addEventListener("click", () => {
    hideHero();
    loadMovies(
      "top_rated",
      filmContent,
      personContent,
      headerContent,
      personPagination
    );
  });

  popularBtn.addEventListener("click", () => {
    hideHero();
    loadMovies(
      "popular",
      filmContent,
      personContent,
      headerContent,
      personPagination
    );
  });

  tvBtn.addEventListener("click", () => {
    hideHero();
    loadTV(filmContent, personContent, headerContent, personPagination);
  });

  personBtn.addEventListener("click", () => {
    hideHero();
    currentPersonPage = 1;
    loadPersons(
      currentPersonPage,
      personContent,
      filmContent,
      headerContent,
      personPagination
    );
  });

  async function searchTMDB(query) {
    hideHero();
    filmContent.innerHTML = "";
    personContent.innerHTML = "";
    if (personPagination) personPagination.innerHTML = "";
    headerContent.innerHTML = `<h2>Sökresultat för "${query}"</h2>`;

    try {
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      if (!movieRes.ok) throw new Error(`Response status: ${movieRes.status}`);
      const movieData = await movieRes.json();

      if (movieData.results.length > 0) {
        movieData.results.forEach((movie) => {
          filmContent.innerHTML += `
            <div class="movie">
              <img src="${
                movie.poster_path
                  ? IMG + movie.poster_path
                  : "https://via.placeholder.com/200x300"
              }" alt="${movie.title}">
              <h3>${movie.title}</h3>
              <p>Utgivning: ${movie.release_date}</p>
              <p>${movie.overview}</p>
            </div>
          `;
        });
      } else {
        const personRes = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
            query
          )}&page=1`
        );
        if (!personRes.ok)
          throw new Error(`Response status: ${personRes.status}`);
        const personData = await personRes.json();

        if (personData.results.length > 0) {
          personData.results.forEach((person) => {
            let knownForHTML = "";
            if (person.known_for && person.known_for.length > 0) {
              person.known_for.slice(0, 3).forEach((work) => {
                const typeLabel = work.media_type === "movie" ? "Movie" : "TV";
                const title = work.title || work.name || "Ingen titel";
                knownForHTML += `<li>${typeLabel}: ${title}</li>`;
              });
            }

            personContent.innerHTML += `
              <div class="person">
                <img src="${
                  person.profile_path
                    ? PERSON_IMG + person.profile_path
                    : "https://via.placeholder.com/200x300"
                }" alt="${person.name}">
                <h3>${person.name}</h3>
                <p>${person.known_for_department}</p>
                <ul>${knownForHTML}</ul>
              </div>
            `;
          });
        } else {
          filmContent.innerHTML =
            "<p style='color: red;'>No results found.</p>";
        }
      }
    } catch (error) {
      alert(error + " Something went wrong during the search.!");
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      searchTMDB(query);
    });
  }

  gsap.from(".hero-title", { y: -40, opacity: 0, duration: 1 });
  gsap.from(".hero-text", { y: 20, opacity: 0, duration: 1, delay: 0.3 });
  gsap.from(".hero-search", {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    delay: 0.6,
  });
};

document.addEventListener("DOMContentLoaded", java);

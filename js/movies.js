import { API_KEY, IMG } from "./api.js";

export async function loadMovies(
  type,
  filmContent,
  personContent,
  headerContent,
  personPagination
) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    const data = await res.json();

    filmContent.innerHTML = "";
    personContent.innerHTML = "";
    if (personPagination) personPagination.innerHTML = "";

    headerContent.innerHTML = `<h2>${
      type === "top_rated" ? "Top 10 Högst Rankade" : "10 Mest Populära"
    } Filmer</h2>`;

    data.results.slice(0, 10).forEach((movie) => {
      filmContent.innerHTML += `
        <div class="movie">
          <img src="${
            movie.poster_path
              ? IMG + movie.poster_path
              : "https://via.placeholder.com/200x300"
          }" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>Utgivning: ${movie.release_date}</p>
        </div>
      `;
    });
  } catch (err) {
    alert(err + " Something went wrong! Check the API key.");
  }
}

export async function loadTV(
  filmContent,
  personContent,
  headerContent,
  personPagination
) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    const data = await res.json();

    filmContent.innerHTML = "";
    personContent.innerHTML = "";
    if (personPagination) personPagination.innerHTML = "";

    headerContent.innerHTML = `<h2>Populära TV-serier</h2>`;

    data.results.forEach((tv) => {
      filmContent.innerHTML += `
        <div class="movie">
          <img src="${
            tv.poster_path
              ? IMG + tv.poster_path
              : "https://via.placeholder.com/200x300"
          }" alt="${tv.name}">
          <h3>${tv.name}</h3>
          <p>Första sändning: ${tv.first_air_date}</p>
        </div>
      `;
    });
  } catch (err) {
    alert(err + " Something went wrong while fetching TV shows!");
  }
}

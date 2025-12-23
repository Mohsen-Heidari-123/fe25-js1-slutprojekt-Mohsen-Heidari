import { API_KEY, PERSON_IMG } from "./api.js";

export async function loadPersons(
  page,
  personContent,
  filmContent,
  headerContent,
  personPagination
) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    const data = await res.json();

    personContent.innerHTML = "";
    filmContent.innerHTML = "";
    headerContent.innerHTML = "<h2>Populära personer</h2>";

    const totalPages = data.total_pages;

    data.results.forEach((person) => {
      personContent.innerHTML += `
        <div class="person">
          <img src="${
            person.profile_path
              ? PERSON_IMG + person.profile_path
              : "https://via.placeholder.com/200x300"
          }" alt="${person.name}">
          <h3>${person.name}</h3>
          <p>${person.known_for_department}</p>
        </div>
      `;
    });

    renderPagination(
      personPagination,
      page,
      totalPages,
      personContent,
      filmContent,
      headerContent
    );
  } catch (err) {
    alert(err + " Something went wrong while fetching people!");
  }
}

function renderPagination(
  pagination,
  currentPage,
  totalPages,
  personContent,
  filmContent,
  headerContent
) {
  if (!pagination) return;
  pagination.innerHTML = "";

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "«";
    prevBtn.onclick = () =>
      loadPersons(
        currentPage - 1,
        personContent,
        filmContent,
        headerContent,
        pagination
      );
    pagination.appendChild(prevBtn);
  }

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () =>
      loadPersons(i, personContent, filmContent, headerContent, pagination);
    pagination.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "»";
    nextBtn.onclick = () =>
      loadPersons(
        currentPage + 1,
        personContent,
        filmContent,
        headerContent,
        pagination
      );
    pagination.appendChild(nextBtn);
  }
}

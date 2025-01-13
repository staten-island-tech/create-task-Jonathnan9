import "./style.css";

const apiKey = "c316867d022cfd3d7aa2ddfd17c693b3";
const apiEntry = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`;

let currentPage = 1;
let totalPages = 1;

async function fetchData(page = 1) {
  try {
    const response = await fetch(`${apiEntry}&page=${page}`);
    const data = await response.json();
    totalPages = data.total_pages;
    createMovieCard(data.results);
    pageChange(page);
    genreSearch(data);
    yearSearch(data);
    ratingSearch(data);
    ageRatingSearch(data);
    sortBy(data);
  } catch (err) {
    console.error(err);
  }
}

function createMovieCard(movies) {
  const container = document.querySelector("#boxes");
  container.innerHTML = "";

  if (movies.length === 0) {
    container.insertAdjacentHTML(
      "beforeend",
      `<p class="mx-auto font-bold text-neutral text-xl mt-40">No movies found!</p>`
    );
    return;
  }

  movies.forEach((movie) => {
    const movieTitle = movie.title || movie.name;
    const movieOverview = movie.overview;
    const moviePosterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const movieReleaseDate = movie.release_date || movie.first_air_date;

    let genreNames = "";
    if (Array.isArray(movie.genres)) {
      movie.genres.forEach((genre, index) => {
        genreNames += genre.name;
        if (index < movie.genres.length - 1) {
          genreNames += ", ";
        }
      });
    } else {
      genreNames = "N/A";
    }

    container.insertAdjacentHTML(
      "beforeend",
      `
        <div class="movie-card rounded-2xl bg-neutral border-secondary border mx-auto my-3 h-96 p-4 min-w-[20em] text-center md:w-46 xl:w-31 w-78 transition-shadow duration-300 ease-in-out hover:shadow-2xl shadow-purple-800">
          <h2 class="text-lg font-bold">${movieTitle}</h2>
          <div class="content flex items-start gap-4 mt-4">
            <img src="${moviePosterUrl}" alt="Poster of ${movieTitle}" class="h-60 w-[17em] border-r-2 border-base-100 pr-4">
            <div class="details text-left space-y-2">
              <p class="line-clamp-4"><strong>Overview:</strong> ${movieOverview}</p>
              <p><strong>Release Date:</strong> ${movieReleaseDate}</p>
              <p><strong>Rating:</strong> ${movie.vote_average}</p>
              <p><strong>Genres:</strong> ${genreNames}</p>
            </div>
          </div>
        </div>
      `
    );
  });
}

function pageChange(page) {
  const pageChange = document.querySelector("#pageChange");
  pageChange.innerHTML = "";

  const prevDisabled = page === 1 ? "disabled" : "";
  const nextDisabled = page === totalPages ? "disabled" : "";

  pageChange.insertAdjacentHTML(
    "beforeend",
    `
        <div class="btn-group">
          <button class="btn btn-primary ${prevDisabled}" id="prevPage">Previous</button>
          <span class="mx-2 text-lg">Page</span>
          <input id="pageInput" class="input input-bordered input-primary w-20 text-center" type="number" min="1" max="${totalPages}" value="${page}">
          <span class="mx-2 text-lg">/ ${totalPages}</span>
          <button class="btn btn-primary ${nextDisabled}" id="nextPage">Next</button>
        </div>
      `
  );

  document.querySelector("#prevPage").addEventListener("click", () => {
    if (page > 1) {
      currentPage--;
      fetchData(currentPage);
    }
  });

  document.querySelector("#nextPage").addEventListener("click", () => {
    if (page < totalPages) {
      currentPage++;
      fetchData(currentPage);
    }
  });

  const pageInput = document.querySelector("#pageInput");
  pageInput.addEventListener("change", () => {
    let requestedPage = parseInt(pageInput.value);

    if (requestedPage >= 1 && requestedPage <= totalPages) {
      currentPage = requestedPage;
      fetchData(currentPage);
    } else {
      pageInput.value = currentPage;
      alert(`Please enter a page number between 1 and ${totalPages}`);
    }
  });

  pageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      pageInput.dispatchEvent(new Event("change"));
    }
  });
}

function genreSearch(data) {
  const genreInputs = document.querySelectorAll("[name='genre']");
  genreInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selectedGenres = Array.from(genreInputs)
        .filter((input) => input.checked)
        .map((input) => parseInt(input.value));

      let filteredMovies = Array.isArray(data.results)
        ? data.results.filter((movie) =>
            movie.genre_ids.some((id) => selectedGenres.includes(id))
          )
        : [];

      if (selectedGenres.length === 0) {
        filteredMovies = data.results;
      }

      createMovieCard(filteredMovies);
    });
  });
}

function yearSearch(data) {
  const yearInput = document.querySelector("#yearInput");

  if (yearInput) {
    yearInput.addEventListener("input", () => {
      const selectedYear = parseInt(yearInput.value);

      let filteredMovies = Array.isArray(data.results)
        ? data.results.filter((movie) => {
            const releaseYear = new Date(movie.release_date).getFullYear();
            return releaseYear === selectedYear;
          })
        : [];

      if (!selectedYear) {
        filteredMovies = data.results;
      }

      createMovieCard(filteredMovies);
    });
  }
}

function ratingSearch(data) {
  const ratingInput = document.querySelector("#ratingInput");

  if (ratingInput) {
    ratingInput.addEventListener("input", () => {
      const minRating = parseFloat(ratingInput.value);

      let filteredMovies = Array.isArray(data.results)
        ? data.results.filter((movie) => movie.vote_average >= minRating)
        : [];

      if (!minRating) {
        filteredMovies = data.results;
      }

      createMovieCard(filteredMovies);
    });
  }
}

function sortBy(data) {
  const sortByInputs = document.querySelectorAll("[name='sortBy']");

  sortByInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const sortByValue = input.value;
      let sortedMovies;

      if (Array.isArray(data.results)) {
        if (sortByValue === "popularity.desc") {
          sortedMovies = [...data.results].sort(
            (a, b) => b.popularity - a.popularity
          );
        } else if (sortByValue === "vote_average.desc") {
          sortedMovies = [...data.results].sort(
            (a, b) => b.vote_average - a.vote_average
          );
        } else if (sortByValue === "release_date.desc") {
          sortedMovies = [...data.results].sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
          );
        }
      } else {
        sortedMovies = [];
      }

      createMovieCard(sortedMovies);
    });
  });
}

function ageRatingSearch(data) {
  const ageRatingInputs = document.querySelectorAll("[name='ageRating']");

  ageRatingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const selectedRating = input.value;

      let filteredMovies = Array.isArray(data.results)
        ? data.results.filter(
            (movie) => movie.adult === (selectedRating === "adult")
          )
        : [];

      if (!selectedRating) {
        filteredMovies = data.results;
      }

      createMovieCard(filteredMovies);
    });
  });
}

fetchData(currentPage);

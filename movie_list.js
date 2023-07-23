const apiKey = "907cdfa9";
const moviesPerPage = 15;
let currentPage = 1;
let totalResults = 0;
let searchQuery = ""; 

const searchBox = document.getElementById("search-box");
const movieList = document.getElementById("movie-list");
const paginationContainer = document.getElementById("pagination");
const movieDetailsContainer = document.getElementById("movie-details");

// Function to fetch movies from OMDB API 
async function fetchMoviesBySearch(query, page) {
    try {
        if (query === "") {
            query = "har";
        }
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.Response === "True") {
            movieList.innerHTML = ""; 
            totalResults = parseInt(data.totalResults);

            data.Search.forEach(movie => {
                createMovieCard(movie);
            });

            createPaginationButtons();
        } else {
            console.error("Error fetching movies:", data.Error);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function createMovieCard(movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const poster = document.createElement("img");
    poster.src = movie.Poster === "N/A" ? "placeholder.png" : movie.Poster;
    poster.classList.add("movie-poster");

    const title = document.createElement("div");
    title.textContent = movie.Title;
    title.classList.add("movie-title");

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Details";
    detailsButton.classList.add("details-button");

    movieCard.appendChild(poster);
    movieCard.appendChild(title);
    movieCard.appendChild(detailsButton);
    movieList.appendChild(movieCard);

    detailsButton.addEventListener("click", () => {
        const imdbId = movie.imdbID;
        const movieDetailsURL = `movie_details.html?imdbId=${imdbId}`;
        window.open(movieDetailsURL, "_blank");
    });
}

function createPaginationButtons() {
    paginationContainer.innerHTML = ""; 

    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        currentPage--;
        handleSearchInput();
    });

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === Math.ceil(totalResults / moviesPerPage);
    nextButton.addEventListener("click", () => {
        currentPage++;
        handleSearchInput();
    });

    const totalPages = Math.ceil(totalResults / moviesPerPage);
    console.log(totalPages);

    const pageList = document.createElement("ul");
    pageList.classList.add("page-list");

    for (let i = currentPage; i <= currentPage+totalPages; i++) {
        const pageItem = document.createElement("li");
        const pageNumber = document.createElement("button");
        pageNumber.textContent = i;
        pageNumber.disabled = i === currentPage;
        pageNumber.addEventListener("click", () => {
            currentPage = i;
            handleSearchInput();
        });

        pageItem.appendChild(pageNumber);
        pageList.appendChild(pageItem);
    }

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageList);
    paginationContainer.appendChild(nextButton);
}


function handleSearchInput() {
    const query = searchBox.value.trim();

    if (query !== searchQuery) {
        searchQuery = query;
        currentPage = 1;
    }
    fetchMoviesBySearch(searchQuery, currentPage);
}

searchBox.addEventListener("input", () => {
    handleSearchInput();
});

window.addEventListener("load", () => {
    fetchMoviesBySearch(searchQuery, currentPage);
});

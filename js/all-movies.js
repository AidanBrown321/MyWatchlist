// Store all movies for filtering
let allMovies = [];

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners when the page is loaded
    document.getElementById("load-data").addEventListener('click', loadAllMovies);
    
    // Add filter event listeners
    document.getElementById("status-filter").addEventListener('change', applyFilters);
    document.getElementById("genre-filter").addEventListener('change', applyFilters);
    document.getElementById("search-filter").addEventListener('input', applyFilters);
    
    // Automatically load movies when the page opens
    loadAllMovies();
});

/**
 * Loads all movies from the API and displays them as cards
 */
function loadAllMovies() {
    let lambda = document.getElementById("lambda-info");
    lambda.innerHTML = '<p>Loading movies...</p>';
    
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const response = JSON.parse(xhr.response);
        
        // Store movies globally for filtering
        allMovies = response;

        if (response.length === 0) {
            lambda.innerHTML = '<p class="empty-message">No movies in your watchlist. Add some!</p>';
            return;
        }
        
        // Populate genre filter dropdown after loading movies
        populateGenreFilter(response);
        
        // Display all movies initially
        displayMovies(response);
    });
    xhr.open("GET", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.send();
}

/**
 * Populates the genre filter dropdown with unique genres from movies
 * @param {Array} movies - The array of movie objects
 */
function populateGenreFilter(movies) {
    const genreFilter = document.getElementById("genre-filter");
    const uniqueGenres = new Set();
    
    // Clear existing options except "All Genres"
    while (genreFilter.options.length > 1) {
        genreFilter.remove(1);
    }
    
    // Collect unique genres from movies
    movies.forEach(movie => {
        const genre = movie.genre || "Unknown";
        if (genre) {
            uniqueGenres.add(genre);
        }
    });
    
    // Add each unique genre as an option
    uniqueGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

/**
 * Applies the selected filters to the movies list
 */
function applyFilters() {
    const statusFilter = document.getElementById("status-filter").value;
    const genreFilter = document.getElementById("genre-filter").value;
    const searchFilter = document.getElementById("search-filter").value.toLowerCase();
    
    // Filter movies based on all criteria
    const filteredMovies = allMovies.filter(movie => {
        // Status filter
        const matchesStatus = statusFilter === 'all' || 
                              (statusFilter === 'watched' && movie.status === 'watched') ||
                              (statusFilter === 'towatch' && movie.status !== 'watched');
        
        // Genre filter
        const movieGenre = movie.genre || "Unknown";
        const matchesGenre = genreFilter === 'all' || movieGenre === genreFilter;
        
        // Search filter (case insensitive)
        const movieTitle = (movie.title || '').toLowerCase();
        const matchesSearch = movieTitle.includes(searchFilter);
        
        return matchesStatus && matchesGenre && matchesSearch;
    });
    
    // Display the filtered movies
    displayMovies(filteredMovies);
}

/**
 * Displays the provided movies as cards
 * @param {Array} movies - The array of movie objects to display
 */
function displayMovies(movies) {
    let lambda = document.getElementById("lambda-info");
    
    if (movies.length === 0) {
        lambda.innerHTML = '<p class="empty-message">No movies match your filters. Try adjusting your criteria.</p>';
        return;
    }
    
    let cardsContainer = '<div class="movie-cards-container">';

    movies.forEach(item => {
        const statusText = item.status === 'watched' ? 'Watched' : 'To Watch';
        const statusClass = item.status === 'watched' ? 'status-watched' : 'status-towatch';
        
        cardsContainer += `
            <div class="movie-card ${statusClass}">
                <h3 class="movie-title">${item.title || 'Untitled'}</h3>
                <p class="movie-genre">${item.genre || 'Unknown'}</p>
                <div class="movie-status">Status: <span class="status-badge">${statusText}</span></div>
                <div class="movie-actions">
                    <button class="delete-btn" onclick="deleteMovie('${item.id}')">Delete</button>
                    ${item.status !== 'watched' ? 
                        `<button class="watch-btn" onclick="markAsWatched('${item.id}')">Mark Watched</button>` : ''}
                </div>
            </div>
        `;
    });
    
    cardsContainer += '</div>';
    lambda.innerHTML = cardsContainer;
}

/**
 * Deletes an item from the database
 * @param {string} id - The ID of the item to delete
 */
function deleteMovie(id) {
    if (confirm(`Are you sure you want to delete this movie?`)) {
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", `https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items/${id}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener("load", function() {
            // Refresh the movie list after deletion
            loadAllMovies();
        });
        xhr.send();
    }
}

/**
 * Marks a movie as watched
 * @param {string} id - The ID of the movie to mark as watched
 */
function markAsWatched(id) {
    // First, fetch the current movie data
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items/${id}`);
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            const movie = JSON.parse(xhr.response);
            
            // Prepare the updated movie data
            const updatedMovie = {
                "id": movie.id,
                "title": movie.title || movie.name,
                "genre": movie.genre || movie.price,
                "status": "watched"
            };
            
            // Send the update request
            let updateXhr = new XMLHttpRequest();
            updateXhr.open("PUT", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
            updateXhr.setRequestHeader("Content-Type", "application/json");
            updateXhr.addEventListener("load", function() {
                // Refresh the movie list
                loadAllMovies();
            });
            updateXhr.send(JSON.stringify(updatedMovie));
        }
    });
    xhr.send();
}

// Makes the deleteMovie function globally available
window.deleteMovie = deleteMovie;

// Makes the markAsWatched function globally available
window.markAsWatched = markAsWatched;
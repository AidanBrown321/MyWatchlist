document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners when the page is loaded
    document.getElementById("load-data").addEventListener('click', loadAllMovies);
    document.getElementById("add-movie-form").addEventListener('submit', function(event) {
        event.preventDefault();
        addNewMovie();
    });

    // Automatically load movies when the page opens
    loadAllMovies();
});

/**
 * Loads all movies from the API and displays them in a table
 */
function loadAllMovies() {
    let lambda = document.getElementById("lambda-info");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const response = JSON.parse(xhr.response);

        if (response.length === 0) {
            lambda.innerHTML = '<p class="empty-message">No movies in your watchlist. Add some!</p>';
            return;
        }

        let cardsContainer = '<div class="movie-cards-container">';

        response.forEach(item => {
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
    });
    xhr.open("GET", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.send();
}

/**
 * Adds a new item to the database
 */
function addNewMovie() {
    const id = document.getElementById("movie-id").value;
    const title = document.getElementById("movie-title").value;
    const genre = document.getElementById("movie-genre").value;
    const movieStatus = document.querySelector('input[name="movie-status"]:checked').value;



    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        // Clear form fields after successful submission
        document.getElementById("movie-id").value = '';
        document.getElementById("movie-title").value = '';
        document.getElementById("movie-genre").value = '';
        document.getElementById("status-towatch").checked = true;
        
        // Refresh the movie list
        loadAllMovies();
    });

    xhr.send(JSON.stringify({
        "id": id,
        "title": title,
        "genre": genre,
        "status": movieStatus,
    }));
}

/**
 * Deletes an item from the database
 * @param {string} id - The ID of the item to delete
 */
function deleteMovie(id) {
    if (confirm(`Are you sure you want to delete movie ${id}?`)) {
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
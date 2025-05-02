document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for form submission
    document.getElementById("add-movie-form").addEventListener('submit', function(event) {
        event.preventDefault();
        addNewMovie();
    });
});

/**
 * Adds a new movie to the database and redirects back to all-movies
 */
function addNewMovie() {
    const title = document.getElementById("movie-title").value;
    const genre = document.getElementById("movie-genre").value;
    const movieStatus = document.querySelector('input[name="movie-status"]:checked').value;
    
    // Generate a simple ID using timestamp
    const id = "movie-" + Date.now();
    
    // Set the ID to the hidden field
    document.getElementById("movie-id").value = id;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            // Show success message briefly
            const successMsg = document.getElementById("success-message");
            successMsg.innerHTML = '<p class="success">Movie added successfully! Redirecting...</p>';
            
            // Redirect back to all-movies after a short delay
            setTimeout(() => {
                window.location.href = "all-movies.html";
            }, 1000);
        } else {
            alert("Error adding movie. Please try again.");
        }
    });

    xhr.send(JSON.stringify({
        "id": id,
        "title": title,
        "genre": genre,
        "status": movieStatus,
    }));
}
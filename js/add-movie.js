document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for form submission - check if element exists first
    const form = document.getElementById("add-movie-form");
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            addNewMovie();
        });
    }
});

/**
 * Adds a new movie to the database and redirects back to all-movies
 */
function addNewMovie() {
    // Get and sanitize user input
    const rawTitle = document.getElementById("movie-title").value;
    const rawGenre = document.getElementById("movie-genre").value;
    const movieStatus = document.querySelector('input[name="movie-status"]:checked').value;
    
    // Sanitize inputs
    const title = sanitizeInput(rawTitle);
    const genre = sanitizeInput(rawGenre);
    
    // Validate inputs
    if (!title || !genre) {
        alert("Please provide both a title and genre.");
        return;
    }
    
    // Generate a simple ID using timestamp
    const id = "movie-" + Date.now();
    
    // Set the ID
    document.getElementById("movie-id").value = id;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            // Show success message 
            const successMsg = document.getElementById("success-message");
            successMsg.innerHTML = '<p class="success">Movie added successfully! Redirecting...</p>';
            
            // Redirect back to all-movies
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

/**
 * Sanitizes user input to prevent attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} The sanitized input
 */
function sanitizeInput(input) {
    if (!input) return '';
    
    // Trim whitespace
    let sanitized = input.trim();
    
    // Convert HTML special characters
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    
    // Remove any extra script tags
    sanitized = sanitized.replace(/script/gi, 'scr-ipt');
    
    // Limit length to prevent issues
    const MAX_LENGTH = 100;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }
    
    return sanitized;
}

export {sanitizeInput};
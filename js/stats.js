document.addEventListener('DOMContentLoaded', function() {
    loadMovieStats();
});

/**
 * Loads movie data and generates statistics
 */
function loadMovieStats() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            const movies = JSON.parse(xhr.response);
            displayStats(movies);
        } else {
            document.getElementById('total-count').textContent = 'Error loading data';
        }
    });
    xhr.open("GET", "https://5qgtokv6k4.execute-api.eu-north-1.amazonaws.com/items");
    xhr.send();
}

/**
 * Calculates and displays stats based on movie data
 * @param {Array} movies - The array of movie objects
 */
function displayStats(movies) {
    // Display total movie count
    document.getElementById('total-count').textContent = movies.length;
    
    // Calculate stats for watch status
    const watchStats = calculateWatchStats(movies);
    
    // Calculate stats for genres
    const genreStats = calculateGenreStats(movies);
    
    // Create the charts
    createStatusChart(watchStats);
    createGenreChart(genreStats);
}

/**
 * Calculates statistics about watch status
 * @param {Array} movies - The array of movie objects
 * @returns {Object} An object containing watched and unwatched counts
 */
function calculateWatchStats(movies) {
    let watched = 0;
    let toWatch = 0;
    
    movies.forEach(movie => {
        if (movie.status === 'watched') {
            watched++;
        } else {
            toWatch++;
        }
    });
    
    return { watched, toWatch };
}

/**
 * Calculates statistics about genres
 * @param {Array} movies - The array of movie objects
 * @returns {Object} An object with genre counts
 */
function calculateGenreStats(movies) {
    const genreCounts = {};
    
    movies.forEach(movie => {
        // Get the genre, handling both title/genre and name/price structures
        const genre = movie.genre || movie.price;
        
        // If it's a number, it's likely not properly formatted in the database
        if (typeof genre === 'number') {
            genreCounts['Unknown'] = (genreCounts['Unknown'] || 0) + 1;
            return;
        }
        
        // Otherwise count by genre
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    
    return genreCounts;
}

/**
 * Creates the watch status chart
 * @param {Object} watchStats - Statistics about watched vs unwatched
 */
function createStatusChart(watchStats) {
    const ctx = document.getElementById('status-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Watched', 'To Watch'],
            datasets: [{
                data: [watchStats.watched, watchStats.toWatch],
                backgroundColor: ['#4CAF50', '#2196F3'],
                borderColor: ['#388E3C', '#1976D2'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 20
                }
            }
        }
    });
}

/**
 * Creates the genre breakdown chart
 * @param {Object} genreStats - Statistics about genres
 */
function createGenreChart(genreStats) {
    const ctx = document.getElementById('genre-chart').getContext('2d');
    
    // Convert the genreStats object to arrays for Chart.js
    const labels = Object.keys(genreStats);
    const data = Object.values(genreStats);
    
    // Generate a set of colors based on number of genres
    const colors = generateColors(labels.length);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'center'
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 20
                }
            }
        }
    });
}

/**
 * Generates an array of colors for the chart
 * @param {number} count - Number of colors needed
 * @returns {Object} Object with background and border color arrays
 */
function generateColors(count) {
    // Predefined colors for common genres
    const colorPalette = [
        { bg: '#FF6384', border: '#E91E63' }, // Red
        { bg: '#36A2EB', border: '#2196F3' }, // Blue
        { bg: '#FFCE56', border: '#FFC107' }, // Yellow
        { bg: '#4BC0C0', border: '#009688' }, // Teal
        { bg: '#9966FF', border: '#673AB7' }, // Purple
        { bg: '#FF9F40', border: '#FF5722' }, // Orange
        { bg: '#8CD3FF', border: '#03A9F4' }, // Light blue
        { bg: '#FFDB8E', border: '#FFC107' }, // Light yellow
        { bg: '#FF8A80', border: '#F44336' }, // Light red
        { bg: '#A5D6A7', border: '#4CAF50' }  // Green
    ];
    
    // If we need more colors than in our palette, generate them
    const background = [];
    const border = [];
    
    for (let i = 0; i < count; i++) {
        if (i < colorPalette.length) {
            background.push(colorPalette[i].bg);
            border.push(colorPalette[i].border);
        } else {
            // Generate a random color for additional genres
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            background.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
            border.push(`rgba(${r}, ${g}, ${b}, 1)`);
        }
    }
    
    return { background, border };
}

export { calculateWatchStats, calculateGenreStats, generateColors };
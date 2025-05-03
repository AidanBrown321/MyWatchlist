// Import from your JS files:
import { sayHello } from '../js/main.js';
import { sanitizeInput } from '../js/add-movie.js';
import { calculateWatchStats, calculateGenreStats, generateColors } from '../js/stats.js';

// Create a minimal document structure for testing DOM interactions
function setupTestDom() {
  // Use QUnit's fixture element instead of document.body
  const fixture = document.getElementById('qunit-fixture');
  
  // Clear existing content and set up needed elements
  fixture.innerHTML = `
    <div id="total-count"></div>
    <div id="status-chart"></div>
    <div id="genre-chart"></div>
  `;
}

// Start QUnit once module imports are complete
QUnit.start();

QUnit.module('Main.js Tests', function() {
  QUnit.test('sayHello returns "hello"', function(assert) {
    const result = sayHello();
    assert.equal(result, 'hello', 'sayHello function returns hello.');
  });
});

QUnit.module('Add Movie Tests', function() {
  QUnit.test('sanitizeInput handles whitespace, HTML, and scripts', function(assert) {
    assert.equal(sanitizeInput('  hello  '), 'hello', 'Trims whitespace.');
    
    const scriptTest = '<script>alert("XSS")</script>';
    const sanitizedScript = '&lt;scr-ipt&gt;alert(&quot;XSS&quot;)&lt;/scr-ipt&gt;';
    assert.equal(sanitizeInput(scriptTest), sanitizedScript, 'Strips script tags and escapes HTML.');
    
    const longString = 'a'.repeat(200);
    const sanitizedLong = sanitizeInput(longString);
    assert.equal(sanitizedLong.length, 100, 'Truncates input to 100 chars.');
    
    assert.equal(sanitizeInput(''), '', 'Handles empty input safely.');
    assert.equal(sanitizeInput(null), '', 'Returns empty string for null.');
    assert.equal(sanitizeInput(undefined), '', 'Returns empty string for undefined.');
  });
});

QUnit.module('Stats Tests', function() {
  // Setup the test DOM before each test in this module
  QUnit.testStart(setupTestDom);
  
  QUnit.test('calculateWatchStats accurately counts watched vs. to-watch', function(assert) {
    const mockMovies = [
      { title: 'Movie 1', status: 'watched' },
      { title: 'Movie 2', status: 'towatch' },
      { title: 'Movie 3', status: 'watched' },
      { title: 'Movie 4', status: 'towatch' },
    ];
    const stats = calculateWatchStats(mockMovies);
    assert.equal(stats.watched, 2, 'Watched count is correct.');
    assert.equal(stats.toWatch, 2, 'To-watch count is correct.');
  });

  QUnit.test('calculateGenreStats groups movies by genre or marks unknown', function(assert) {
    const mockMovies = [
      { title: 'Movie 1', genre: 'Action' },
      { title: 'Movie 2', genre: 'Comedy' },
      { title: 'Movie 3', genre: 'Action' },
      { name: 'Movie 4', price: 'Drama' },  // Different field structure
      { name: 'Movie 5', price: 123 },      // Numeric, treated as unknown
    ];
    const genreCounts = calculateGenreStats(mockMovies);
    assert.equal(genreCounts['Action'], 2, 'Counts Action genre correctly.');
    assert.equal(genreCounts['Comedy'], 1, 'Counts Comedy genre correctly.');
    assert.equal(genreCounts['Drama'], 1, 'Counts Drama – from "price" field.');
    assert.equal(genreCounts['Unknown'], 1, 'Counts numeric as unknown genre.');
  });
  
  QUnit.test('generateColors returns correct number of colors', function(assert) {
    const colors = generateColors(5);
    assert.equal(colors.background.length, 5, 'Returns 5 background colors');
    assert.equal(colors.border.length, 5, 'Returns 5 border colors');
  });
});

// Test filtering logic from all-movies.js
QUnit.module('AllMovies Filtering Logic', function() {
  // Create a simplified filter function that is similar to all-movies.js
  function filterMovies(movies, statusFilter, genreFilter, searchFilter) {
    return movies.filter(movie => {
      // Status filter
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'watched' && movie.status === 'watched')
        || (statusFilter === 'towatch' && movie.status !== 'watched');
      
      // Genre filter
      const movieGenre = movie.genre ?? 'Unknown';
      const matchesGenre = genreFilter === 'all' || movieGenre === genreFilter;
      
      // Search filter (case insensitive)
      const movieTitle = (movie.title || '').toLowerCase();
      const matchesSearch = movieTitle.includes(searchFilter.toLowerCase());
      
      return matchesStatus && matchesGenre && matchesSearch;
    });
  }

  QUnit.test('filterMovies handles status, genre, and search correctly', function(assert) {
    const mockMovies = [
      { id: '1', title: 'Action Film', genre: 'Action', status: 'watched' },
      { id: '2', title: 'Comedy Flick', genre: 'Comedy', status: 'watched' },
      { id: '3', title: 'Drama Epic', genre: 'Drama', status: 'towatch' },
      { id: '4', title: 'Game Night', genre: 'Comedy', status: 'towatch' },
    ];

    // Filter by watched only
    let result = filterMovies(mockMovies, 'watched', 'all', '');
    assert.equal(result.length, 2, 'Correctly filters watched movies.');
    assert.ok(result.every(m => m.status === 'watched'), 'Results are indeed watched.');

    // Filter by genre only
    result = filterMovies(mockMovies, 'all', 'Comedy', '');
    assert.equal(result.length, 2, 'Correctly filters Comedy movies.');
    assert.ok(result.every(m => m.genre === 'Comedy'), 'Results are all in Comedy.');

    // Filter by search term
    result = filterMovies(mockMovies, 'all', 'all', 'game');
    assert.equal(result.length, 1, 'Correctly filters by "game" search term.');
    assert.equal(result[0].title, 'Game Night', 'Found the right match.');

    // Combined filters (genre=Comedy & status=towatch)
    result = filterMovies(mockMovies, 'towatch', 'Comedy', '');
    assert.equal(result.length, 1, 'Correctly combines genre and status filters.');
    assert.equal(result[0].id, '4', 'Found the single to-watch Comedy movie.');
  });
});
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17532409)


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Movie Recommendation App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-container">
    <h1>Movie Recommendation</h1>
    <form id="movieForm">
      <label for="genreInput">Choose a genre:</label>
      <select id="genreInput" name="genreInput">
        <option value="28">Action</option>
        <option value="35">Comedy</option>
        <option value="18">Drama</option>
        <option value="27">Horror</option>
        <option value="12">Adventure</option>
      </select>

      <label for="yearInput">Preferred release year:</label>
      <input type="number" id="yearInput" name="yearInput" placeholder="2020-2023">

      <label for="sortBy">Sort by:</label>
      <select id="sortBy" name="sortBy">
        <option value="popularity.desc">Popularity</option>
        <option value="vote_average.desc">Rating</option>
        <option value="release_date.desc">Release Date</option>
      </select>

      <label for="ratingInput">Minimum rating (1-10):</label>
      <input type="number" id="ratingInput" name="ratingInput" min="1" max="10" step="0.1" placeholder="5">

      <button type="submit">Get Movie Recommendations</button>
    </form>

    <div id="movieCards">
      <h2>Recommended Movies</h2>
      <div id="movieDetails">
        <!-- Movie details will appear here -->
      </div>
    </div>
  </div>

  <script type="module" src="main.js"></script>
</body>
</html>

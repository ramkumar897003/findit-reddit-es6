import reddit from "./redditapi";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// Form event listener
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get search term
  const searchTerm = searchInput.value;
  // Get sort
  const sortBy = document.querySelector("input[name='sortby']:checked").value;

  // Get limit
  const searchLimit = document.querySelector("#limit").value;

  // Check input
  if (!searchTerm) {
    // Show message
    return showMessage("Please add a search term.", "alert-danger");
  }

  // Clear input
  searchInput.value = "";

  //Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = `<div class="card-columns">`;
    // Loop through posts
    results.forEach(post => {
      // Check for image
      const image = post.preview
        ? post.preview.images[0].source.url
        : "https://wearesocial-net.s3.amazonaws.com/us/wp-content/uploads/sites/7/2015/07/2A326ECA00000578-3148329-California_based_Reddit_logo_shown_has_fired_an_employee_called_-a-6_1435919411902.jpg";
      output += `
        <div class="card" style="width: 18rem;">
            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateText(post.selftext, 100)}</p>
                <a href="${
                  post.url
                }" target="_Blank class="btn btn-primary">Read More</a>
                <hr />
                <span class="badge badge-secondary">Subreddit: ${
                  post.subreddit
                }</span>
                <span class="badge badge-dark">Subreddit: ${post.score}</span>
            </div>
        </div>
        `;
    });
    output += `</div>`;

    document.querySelector("#results").innerHTML = output;
  });
});

// Show message
function showMessage(message, className) {
  // Create a div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.querySelector("#search-container");
  // Get search
  const search = document.querySelector("#search");

  // Insert message
  searchContainer.insertBefore(div, search);

  // Timeout alert
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

// Truncate text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}

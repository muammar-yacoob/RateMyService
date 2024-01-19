document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const refreshButton = e.target.closest(".refresh-button");
        if (refreshButton) {
            e.preventDefault(); // Prevent the default link behavior

            const action = refreshButton.getAttribute("data-action");
            if (action === "reload") {
                location.reload();  // Reload the page
            }
        }
    });
});

function fetchAndDisplayRatings(buttonElement) {
    const userId = buttonElement.getAttribute('data-userid');
    fetch('http://localhost:5001/api/rate/' + userId)
        .then(response => response.json())
        .then(data => {
            displayRatings(data);
            displayAverageRating(data);
        })
        .catch(error => console.error('Error fetching ratings:', error));
}

function displayRatings(ratings) {
    const tableBody = document.getElementById('ratingsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    ratings.forEach(rating => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = rating.customerName;
        row.insertCell(1).textContent = rating.rating;
        row.insertCell(2).textContent = rating.comments;
        row.insertCell(3).textContent = rating.ipAddress;
        row.insertCell(4).textContent = new Date(rating.ratingDate).toLocaleString();
    });
}

function displayAverageRating(ratings) {
    if (ratings.length === 0) return;

    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
    const avgRatingStars = generateStars(avgRating);

    document.getElementById('avgRatingStars').innerHTML = avgRatingStars;
}

function generateStars(avgRating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(avgRating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(avgRating) && avgRating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

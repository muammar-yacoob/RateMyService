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

    let totalRatings = 0;
    let avgRating = 0;
    let ratingCount = 0;

    ratings.forEach(rating => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = rating.customerName;
        row.insertCell(1).textContent = rating.rating;
        row.insertCell(2).textContent = rating.comments;
        row.insertCell(3).textContent = new Date(rating.ratingDate).toLocaleDateString();
        // row.insertCell(4).textContent = rating.ipAddress;

        totalRatings += rating.rating; // Sum up the ratings
        ratingCount++; // Count the number of ratings
    });

    // Append a total row
    const totalRow = tableBody.insertRow();
    avgRating
    totalRow.insertCell(0).textContent = `Total: ${ratingCount} ratings`;
    totalRow.insertCell(1).textContent = `Average: ${Math.round(totalRatings / ratingCount * 10) / 10}`
    totalRow.insertCell(2); // Leave empty
    totalRow.insertCell(3); // Leave empty
    // totalRow.insertCell(4); // Leave empty

    // Optionally, you can style the total row differently
    totalRow.style.fontWeight = 'bold';
}

function displayAverageRating(ratings) {
    if (ratings.length === 0) return;

    const totalRatingsCount = ratings.length;
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatingsCount;
    const avgRatingRounded = Math.round(avgRating * 10) / 10; // Round to one decimal place
    const avgRatingStars = generateStars(avgRating);

    document.getElementById('avgRatingStars').innerHTML = avgRatingStars;
    document.getElementById('numericAvgRating').textContent = `Average Rating: ${avgRatingRounded} (${totalRatingsCount} ratings)`;
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
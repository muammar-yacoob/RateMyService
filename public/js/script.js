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
            const tableBody = document.getElementById('ratingsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach(rating => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = rating.customerName;
                row.insertCell(1).textContent = rating.rating;
                row.insertCell(2).textContent = rating.comments;
                row.insertCell(3).textContent = rating.ipAddress;
                row.insertCell(4).textContent = new Date(rating.ratingDate).toLocaleString();
            });
        })
        .catch(error => console.error('Error fetching ratings:', error));
}
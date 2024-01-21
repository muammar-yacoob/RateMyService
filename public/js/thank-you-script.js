document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const refreshButton = e.target.closest(".refresh-button");
        if (refreshButton) {
            e.preventDefault();
            const action = refreshButton.getAttribute("data-action");
            if (action === "reload") {
                fetch('/api/random-image')
                    .then(response => response.json())
                    .then(data => {
                        document.querySelector('.thank-you-image').src = data.imageUrl;
                    })
                    .catch(error => console.error('Error:', error));
            }
        }
    });
});
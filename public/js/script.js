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

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("home-button")) {
            e.preventDefault(); // Prevent the default link behavior
            
            const action = e.target.getAttribute("data-action");
            if (action === "reload") {
                location.reload();  // Reload the page
            }
        }
    });
});

document.querySelectorAll('.client-star-rating input').forEach(input => {
    input.addEventListener('change', function() {
        const ratingValue = this.value;
        let message = '';
        switch (ratingValue) {
            case '5': message = 'Excellent! We are thrilled!'; break;
            case '4': message = 'Great! Thank you!'; break;
            case '3': message = 'Good, but we can do better.'; break;
            case '2': message = 'Sorry to hear that. How can we improve?'; break;
            case '1': message = 'We will work on being better.'; break;
            default:  message = '';
        }
        document.getElementById('ratingMessage').textContent = message;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const refreshButton = e.target.closest(".submitRating");
        if (refreshButton) {
            e.preventDefault(); 
        }
    });
});
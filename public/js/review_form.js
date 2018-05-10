(function() {
    document.getElementById("add-review-form").addEventListener("submit", (event) => {

        const rating = document.getElementById("rating").value;
        const review = document.getElementById("review").value;

        if (review == "") {
            event.preventDefault();
            return alert("Review can not be blank");
        }
        if (rating == "") {
            event.preventDefault();
            return alert("Please provide a rating  from 1 to 5)");
        }
        if (isNaN(rating)) {
            event.preventDefault();
            return alert("Rating must be a number");
        }
        if(rating < 1 || rating > 5){
            event.preventDefault();
            return alert("Rating must be from 1-5");
        }
    });

})();
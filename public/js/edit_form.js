(function() {

    document.getElementById("edit-campground-form").addEventListener("submit", (event) => {

        const title = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const contact = document.getElementById("contact_info").value;

        if (title == "") {
            event.preventDefault();
            return alert("Please enter a campground title");
        }
        if (price == "") {
            event.preventDefault();
            return alert("Price can not be blank");
        }
        if (isNaN(price)) {
            event.preventDefault();
            return alert("Price must be a number");
        }
        if (contact == "") {
            event.preventDefault();
            return alert("Please provide contact information");
        }
    });
})();
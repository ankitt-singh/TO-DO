document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const categories = document.querySelectorAll(".category");

    // Create a "No results" message
    const noResultsMessage = document.createElement("div");
    noResultsMessage.textContent = "No results found, try again";
    noResultsMessage.style.color = "#888";
    noResultsMessage.style.fontSize = "1em";
    noResultsMessage.style.marginTop = "5px";
    noResultsMessage.style.padding = "5px";
    noResultsMessage.style.backgroundColor = "#f9f9f9";
    noResultsMessage.style.border = "1px solid #ccc";
    noResultsMessage.style.borderRadius = "5px";
    noResultsMessage.style.display = "none";

    // Insert the message directly below the search box
    searchBox.parentElement.insertAdjacentElement("afterend", noResultsMessage);

    searchBox.addEventListener("input", () => {
        const query = searchBox.value.trim().toLowerCase();
        let hasResults = false;

        if (query.length >= 1) {
            categories.forEach(category => {
                // Correctly select category titles using `.search-title`
                const categoryName = category.querySelector(".search-title").textContent.toLowerCase();
                const items = category.querySelectorAll(".search-item");
                let categoryVisible = false;

                items.forEach(item => {
                    const itemName = item.textContent.toLowerCase();
                    if (itemName.includes(query) || categoryName.includes(query)) {
                        item.style.display = "block";
                        categoryVisible = true;
                        hasResults = true;
                    } else {
                        item.style.display = "none";
                    }
                });

                // Toggle the visibility of the entire category
                category.style.display = categoryVisible ? "block" : "none";
            });

            // Show "No results" message if no matches found
            noResultsMessage.style.display = hasResults ? "none" : "block";
        } else {
            // If the search box is cleared or less than 1 letter, show all items and categories
            categories.forEach(category => {
                category.style.display = "block";
                const items = category.querySelectorAll(".search-item"); // Use `.search-item` instead of `.item`
                items.forEach(item => {
                    item.style.display = "block";
                });
            });
            noResultsMessage.style.display = "none";
        }
    });
});



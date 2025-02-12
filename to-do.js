// Initialize a map to store todos for each category
const todoMap = {};

// Add event listeners to all categories
document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll(".category");

    categories.forEach((category) => {
        const categoryName = category.dataset.category;
        const inputField = category.querySelector(".input-field");
        const addButton = category.querySelector(".btn");
        const deleteAllButton = category.querySelector(".delete-all-btn");
        const todoList = category.querySelector(".scroll");

        // Initialize todos for this category
        todoMap[categoryName] = JSON.parse(localStorage.getItem(categoryName)) || [];

        // Add listeners
        addButton.addEventListener("click", () => addTask(categoryName, inputField, todoList));
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                addTask(categoryName, inputField, todoList);
            }
        });
        deleteAllButton.addEventListener("click", () => deleteAllTasks(categoryName, todoList));

        // Display existing tasks
        displayTasks(categoryName, todoList);
    });
});

// Define dropdown options for each category
const categoryOptions = {
    "Airline Membership": ["Delta", "American Airlines", "United", "Southwest", "JetBlue"],
    "Hotel Membership": ["Marriott", "Hilton", "Hyatt", "InterContinental", "Best Western"],
    "Airport Lounge Membership": ["Priority Pass", "Amex Centurion Lounge", "Delta Sky Club", "United Club", "Plaza Premium"],
    "Credit Card Travel Membership": ["Chase Sapphire", "Amex Platinum", "Citi Prestige", "Capital One Venture", "Discover Miles"],
    "Others": ["Custom Option 1", "Custom Option 2", "Custom Option 3"]
};

function addTask(categoryName, inputField, todoList) {
    const newTask = inputField.value.trim();
    if (newTask !== "") {
        todoMap[categoryName].push({
            task: newTask,
            disabled: false,
        });
        saveToLocalStorage(categoryName);
        inputField.value = "";
        displayTasks(categoryName, todoList);
    }
}

function deleteAllTasks(categoryName, todoList) {
    todoMap[categoryName] = [];
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

function displayTasks(categoryName, todoList) {
    todoList.innerHTML = "";
    todoMap[categoryName].forEach((item, index) => {
        const taskContainer = document.createElement("div");
        taskContainer.className = "todo-container";

        taskContainer.innerHTML = `
            <input type="checkbox" class="todo-checkbox" id="input-${categoryName}-${index}" ${
            item.disabled ? "checked" : ""
        }>
            <p id="todo-${categoryName}-${index}" class="${item.disabled ? "disabled" : ""}">
              ${item.task}
            </p>
        `;

        const taskElement = taskContainer.querySelector(`#todo-${categoryName}-${index}`);
        // taskElement.addEventListener("click", () => editTask(categoryName, index, todoList));

        taskContainer.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(categoryName, index, todoList)
        );

        todoList.appendChild(taskContainer);
    });
}


function editTask(categoryName, index, todoList) {
    const todoItem = document.getElementById(`todo-${categoryName}-${index}`);

    // Make the <p> element editable instead of replacing it
    todoItem.setAttribute("contenteditable", "true");
    todoItem.style.outline = "none"; // Remove default outline
    todoItem.style.borderBottom = "1px solid yellow"; // Optional visual cue

    todoItem.focus(); // Automatically focus for editing

    // Save when Enter is pressed or loses focus
    todoItem.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent new line
            todoItem.removeAttribute("contenteditable");
            todoItem.style.borderBottom = "none"; // Remove border
            updateTask(categoryName, index, todoItem.textContent.trim());
        }
    });

    todoItem.addEventListener("blur", () => {
        todoItem.removeAttribute("contenteditable");
        todoItem.style.borderBottom = "none";
        updateTask(categoryName, index, todoItem.textContent.trim());
    });

    input.style.width = `${input.value.length + 2}ch`; // Adjust input width based on text length

}

// Function to update the task in local storage
function updateTask(categoryName, index, newText) {
    if (newText) {
        todoMap[categoryName][index].task = newText;
        saveToLocalStorage(categoryName);
    }
}



function toggleTask(categoryName, index, todoList) {
    todoMap[categoryName][index].disabled = !todoMap[categoryName][index].disabled;
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

// function deleteTask(categoryName, index, todoList) {
//     todoMap[categoryName].splice(index, 1);
//     saveToLocalStorage(categoryName);
//     displayTasks(categoryName, todoList);
// }

function saveToLocalStorage(categoryName) {
    localStorage.setItem(categoryName, JSON.stringify(todoMap[categoryName]));
}

// Dynamic todo categories

document.addEventListener("DOMContentLoaded", () => {
    // Existing category logic remains here...

    // Add event listener to the "Add Category" button
    const addCategoryButton = document.getElementById("add-category-btn");
    const newCategoryInput = document.getElementById("new-category-input");
    const itemsContainer = document.querySelector(".items-container");

    addCategoryButton.addEventListener("click", () => {
        const categoryName = newCategoryInput.value.trim();
        if (categoryName) {
            if (!document.querySelector(`[data-category="${categoryName}"]`)) {
                createCategory(categoryName);  // Ensures all categories are initialized
            }
            newCategoryInput.value = ""; 
        }
    });
    
});

// Function to create a new category dynamically
// Array of different background images
const backgroundImages = [
    "url('img1.gif')",
    "url('img2.webp')",
    "url('img3.webp')",
    "url('img4.webp')",
    "url('img5.webp')",
    "url('img6.webp')",
    "url('img7.gif')",
    "url('img8.webp')" 
];

let lastUsedBackground = -1; // To track the last used background index

// Function to assign a random background (different from the last one)
function assignRandomBackground(categoryDiv) {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * backgroundImages.length);
    } while (randomIndex === lastUsedBackground); // Ensure it's different from the last used one
    lastUsedBackground = randomIndex; // Update the last used background index

    // Set the background image for the category
    const searchItem = categoryDiv.querySelector(".search-item");
    searchItem.style.backgroundImage = backgroundImages[randomIndex];
    searchItem.style.backgroundSize = "cover";
    searchItem.style.backgroundPosition = "center";
    searchItem.style.backgroundRepeat = "no-repeat";
}

// Use this function to create a category (same as your existing function)
function createCategory(categoryName) {
    const itemsContainer = document.querySelector(".items-container");

    // Check if the category already exists
    if (todoMap[categoryName]) {
        alert("This category already exists!");
        return;
    }

    // Create the new category container
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.setAttribute("data-category", categoryName);

    // Add draggable functionality
    categoryDiv.setAttribute("draggable", "true");

    // Create the dropdown for the category
    const dropdown = document.createElement("select");
    dropdown.className = "category-dropdown";

    // Add options to the dropdown based on the category
    categoryOptions[categoryName].forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });

    categoryDiv.innerHTML = `
    <div class="search-item">
        <button class="delete-category-btn">Delete</button>
        <div class="search-title">
            ${dropdown.outerHTML}
        </div>
        <section class="todo">
            <div class="input">
                <input type="text" class="input-field" placeholder="Add an item" />
                <button class="btn"><i class="fa-solid fa-link"></i></button>
            </div>
            <ul class="scroll"></ul>
            <div>
                <hr class="counter" />
                <div class="counter-container">
                    <!--<button class="delete-all-btn">Delete All</button>-->
                </div>
            </div>
        </section>
    </div>
    `;

    // Assign a random background
    assignRandomBackground(categoryDiv);

    // Append the new category to the items container
    itemsContainer.prepend(categoryDiv);

    // Initialize the new category in todoMap and add functionality
    todoMap[categoryName] = [];
    const inputField = categoryDiv.querySelector(".input-field");
    const addButton = categoryDiv.querySelector(".btn");
    const todoList = categoryDiv.querySelector(".scroll");

    addButton.addEventListener("click", () => addTask(categoryName, inputField, todoList));
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask(categoryName, inputField, todoList);
        }
    });

    // Display tasks (if any) for the new category
    displayTasks(categoryName, todoList);

    // Add delete functionality
    const deleteButton = categoryDiv.querySelector(".delete-category-btn");
    deleteButton.addEventListener("click", () => deleteCategory(categoryName, categoryDiv));
}

// Add the category creation logic as is



// Event listener for category creation
document.addEventListener("DOMContentLoaded", () => {
    const categoryInput = document.querySelector("#new-category-input");
    const addCategoryButton = document.querySelector("#add-category-btn");

    // Trigger category creation on button click
    addCategoryButton.addEventListener("click", () => {
        const categoryName = categoryInput.value.trim();
        if (categoryName) {
            createCategory(categoryName);
            categoryInput.value = ""; // Clear the input field
        }
    });

    // Trigger category creation on Enter key press
    categoryInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const categoryName = categoryInput.value.trim();
            if (categoryName) {
                createCategory(categoryName);
                categoryInput.value = ""; // Clear the input field
            }
        }
    });
});
// document.addEventListener("DOMContentLoaded", () => {
//     // Add event listener to all search-title elements
//     document.addEventListener("click", (event) => {
//         if (event.target.classList.contains("search-title")) {
//             makeTitleEditable(event.target);
//         }
//     });
// });

// Function to make the search-title editable

// function makeTitleEditable(titleElement) {
//     const originalText = titleElement.textContent.trim();

//     // Use `contenteditable` instead of replacing with an input field
//     titleElement.setAttribute("contenteditable", "true");
//     titleElement.style.outline = "none"; // Remove focus outline
//     titleElement.style.borderBottom = "1px solid yellow"; // Optional visual cue

//     titleElement.focus(); // Automatically focus on the text

//     // Save changes when Enter is pressed or loses focus
//     titleElement.addEventListener("keydown", (event) => {
//         if (event.key === "Enter") {
//             event.preventDefault(); // Prevent new line
//             titleElement.removeAttribute("contenteditable");
//             titleElement.style.borderBottom = "none"; // Remove border
//         }
//     });

//     titleElement.addEventListener("blur", () => {
//         titleElement.removeAttribute("contenteditable");
//         titleElement.style.borderBottom = "none";
//     });
    
// }


// Function to save the edited title
function saveTitleEdit(input) {
    const newText = input.value.trim() || "Untitled"; // Default to "Untitled" if input is empty

    // Create a new title element
    const updatedTitle = document.createElement("h3");
    updatedTitle.className = "search-title";
    updatedTitle.textContent = newText;

    // Replace the input with the updated title
    input.replaceWith(updatedTitle);
}

// adding drag and drop

document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.querySelector(".items-container");

    let draggedItem = null;

    // Handle drag start
    itemsContainer.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("category")) {
            draggedItem = e.target;
            e.target.style.opacity = "0.5"; // Add some visual feedback for the dragged item
        }
    });

    // Handle drag over
    itemsContainer.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow dropping by preventing the default behavior
    });

    // Handle drop
    itemsContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedItem && e.target.closest(".category")) {
            const target = e.target.closest(".category");
            if (target !== draggedItem) {
                const categories = Array.from(itemsContainer.children);
                const draggedIndex = categories.indexOf(draggedItem);
                const targetIndex = categories.indexOf(target);

                // Rearrange the DOM elements
                if (draggedIndex < targetIndex) {
                    target.after(draggedItem);
                } else {
                    target.before(draggedItem);
                }
            }
        }
        draggedItem.style.opacity = "1"; // Reset opacity after drop
        draggedItem = null; // Clear the reference
    });

    // Handle drag end
    itemsContainer.addEventListener("dragend", (e) => {
        if (e.target.classList.contains("category")) {
            e.target.style.opacity = "1"; // Reset opacity after drag ends
        }
    });
});

// function for dark mode and the dark mode text 
document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const darkModeText = document.querySelector(".dark-mode-text");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to update the dark-mode-text color based on the current mode
    // function updateDarkModeTextColor() {
    //     if (body.classList.contains("dark-mode")) {
    //         // If dark mode is enabled, set the text color to white
    //         darkModeText.style.color = "#f0f0f0"; // Light color text for dark mode
    //     } else {
    //         // If light mode is enabled, set the text color to black
    //         darkModeText.style.color = "#000"; // Dark color text for light mode
    //     }
    // }

    // Set the body theme based on system preference on initial load
    if (prefersDarkScheme.matches) {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true; // Make the switch "on" if system is dark mode
    }

    // Update the text color based on the initial theme
    // updateDarkModeTextColor();

    // Listen for system theme changes and update body class and text color
    prefersDarkScheme.addEventListener("change", (e) => {
        if (e.matches) {
            // System switched to dark mode
            body.classList.add("dark-mode");
            toggleSwitch.checked = true;
        } else {
            // System switched to light mode
            body.classList.remove("dark-mode");
            toggleSwitch.checked = false;
        }
        updateDarkModeTextColor(); // Update the text color on system theme change
    });

    // Listen for changes on the toggle switch
    // toggleSwitch.addEventListener("change", function() {
    //     if (this.checked) {
    //         // Enable dark mode
    //         body.classList.add("dark-mode");
    //     } else {
    //         // Disable dark mode
    //         body.classList.remove("dark-mode");
    //     }
    //     updateDarkModeTextColor(); // Update the text color when switch is toggled
    // });
});

document.getElementById("new-category-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter" && this.value.trim() !== "") {
        // Create a new category div
        const newCategory = document.createElement("div");
        newCategory.className = "category";
        newCategory.innerHTML = `<h3>${this.value.trim()}</h3>`;

        // Get the container and the add-category-container
        const container = document.querySelector(".items-container");
        const addCategoryContainer = document.querySelector(".add-category-container");

        // Insert the new category before the add-category-container
        container.insertBefore(newCategory, addCategoryContainer);

        // Move the add-category-container to the end of the container
        container.appendChild(addCategoryContainer);

        // Clear the input field
        this.value = "";
    }
});

// deleteCategory
function deleteCategory(categoryName, categoryDiv) {
    // Remove from localStorage
    localStorage.removeItem(categoryName);
    
    // Remove from todoMap
    delete todoMap[categoryName];

    // Remove from DOM
    categoryDiv.remove();
}
console.log(todoMap);

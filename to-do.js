// Initialize an empty map for categories and their todos
const todoMap = {};

// Add event listener to the "Add Category" button
document.addEventListener("DOMContentLoaded", () => {
    const addCategoryInput = document.querySelector("#new-category-name");
    const addCategoryButton = document.querySelector("#add-category-btn");
    const categoriesContainer = document.querySelector(".categories-container");

    // Add event listener for creating a new category
    addCategoryButton.addEventListener("click", () => {
        createNewCategory(addCategoryInput.value.trim(), categoriesContainer);
    });

    // Allow pressing "Enter" to create a category
    addCategoryInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            createNewCategory(addCategoryInput.value.trim(), categoriesContainer);
        }
    });
});

// Function to create a new category
function createNewCategory(categoryName, container) {
    if (!categoryName) return; // Do nothing if the input is empty
    if (todoMap[categoryName]) {
        alert("This category already exists!");
        return;
    }

    // Create a new category in the map
    todoMap[categoryName] = [];

    // Create the category box
    const categoryBox = document.createElement("div");
    categoryBox.className = "category";
    categoryBox.dataset.category = categoryName;

    categoryBox.innerHTML = `
        <h3 class="search-title">${categoryName}</h3>
        <div class="search-item">
            <section class="todo">
                <div class="input">
                    <input type="text" class="input-field" placeholder="Add an item" />
                    <button class="btn">+</button>
                </div>
                <ul class="scroll"></ul>
                <div>
                    <hr class="counter" />
                    <div class="counter-container">
                        <button class="delete-all-btn">Delete All</button>
                    </div>
                </div>
            </section>
        </div>
    `;

    container.appendChild(categoryBox);

    // Add functionality to the category's buttons and inputs
    initializeCategory(categoryBox, categoryName);
}

// Initialize the functionality for a category
function initializeCategory(categoryElement, categoryName) {
    const inputField = categoryElement.querySelector(".input-field");
    const addButton = categoryElement.querySelector(".btn");
    const deleteAllButton = categoryElement.querySelector(".delete-all-btn");
    const todoList = categoryElement.querySelector(".scroll");

    // Add event listeners for the input and buttons
    addButton.addEventListener("click", () => addTask(categoryName, inputField, todoList));
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask(categoryName, inputField, todoList);
        }
    });
    deleteAllButton.addEventListener("click", () => deleteAllTasks(categoryName, todoList));
}

// Add a new task to a category
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

// Display all tasks in a category
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
        taskElement.addEventListener("click", () => editTask(categoryName, index, todoList));

        taskContainer.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(categoryName, index, todoList)
        );

        todoList.appendChild(taskContainer);
    });
}

// Delete all tasks in a category
function deleteAllTasks(categoryName, todoList) {
    todoMap[categoryName] = [];
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

// Toggle task completion
function toggleTask(categoryName, index, todoList) {
    todoMap[categoryName][index].disabled = !todoMap[categoryName][index].disabled;
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

// Edit a task
function editTask(categoryName, index, todoList) {
    const todoItem = document.getElementById(`todo-${categoryName}-${index}`);
    const existingText = todoMap[categoryName][index].task;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    inputElement.className = "edit-input";
    todoItem.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todoMap[categoryName][index].task = updatedText;
            saveToLocalStorage(categoryName);
        }
        displayTasks(categoryName, todoList);
    });

    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            inputElement.blur();
        }
    });
}

// Save to localStorage
function saveToLocalStorage(categoryName) {
    localStorage.setItem(categoryName, JSON.stringify(todoMap[categoryName]));
}

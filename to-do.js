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
        taskElement.addEventListener("click", () => editTask(categoryName, index, todoList));

        taskContainer.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(categoryName, index, todoList)
        );

        todoList.appendChild(taskContainer);
    });
}


function editTask(categoryName, index, todoList) {
    const todoItem = document.getElementById(`todo-${categoryName}-${index}`); // Get the task element
    const existingText = todoMap[categoryName][index].task; // Get the task text from the correct category
    const inputElement = document.createElement("input"); // Create an input element

    inputElement.value = existingText; // Set the current task text in the input
    inputElement.className = "edit-input"; // Optional: Add a class for styling
    todoItem.replaceWith(inputElement); // Replace the task text with the input
    inputElement.focus(); // Focus the input for editing

    // Handle when the user finishes editing (on blur)
    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim(); // Get the updated text
        if (updatedText) {
            todoMap[categoryName][index].task = updatedText; // Update the task in the map
            saveToLocalStorage(categoryName); // Save changes to localStorage
        }
        displayTasks(categoryName, todoList); // Re-render the task list
    });

    // Handle "Enter" key to save and exit editing mode
    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            inputElement.blur(); // Trigger the blur event to save changes
        }
    });
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

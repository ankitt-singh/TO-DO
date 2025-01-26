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
            <button class="delete-task-btn" id="delete-${categoryName}-${index}">Delete</button>
        `;

        taskContainer.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(categoryName, index, todoList)
        );
        taskContainer.querySelector(".delete-task-btn").addEventListener("click", () =>
            deleteTask(categoryName, index, todoList)
        );

        todoList.appendChild(taskContainer);
    });
}

function toggleTask(categoryName, index, todoList) {
    todoMap[categoryName][index].disabled = !todoMap[categoryName][index].disabled;
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

function deleteTask(categoryName, index, todoList) {
    todoMap[categoryName].splice(index, 1);
    saveToLocalStorage(categoryName);
    displayTasks(categoryName, todoList);
}

function saveToLocalStorage(categoryName) {
    localStorage.setItem(categoryName, JSON.stringify(todoMap[categoryName]));
}

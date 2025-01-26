// Retriving todo from the local storage or initilizing the empty array

let todo = JSON.parse(localStorage.getItem('todo')) || [];

const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.querySelector("#deleteButton");

// initializing 

document.addEventListener("DOMContentLoaded", function() {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== ""){
    todo.push({
        task: newTask,
        disabled: false,
    });
    saveToLocalStorage();
    todoInput.value="";
    displayTasks();
  }
}

function deleteAllTasks(){
    todo = [];
    saveToLocalStorage();
    displayTasks();
}

function displayTasks(){
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const taskContainer = document.createElement("div");
        taskContainer.className = "todo-container";

        taskContainer.innerHTML = `
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
            <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">
                ${item.task}
            </p>
            <button class="delete-task-btn" id="delete-${index}">Delete</button>
        `;

        // Add event listeners
        taskContainer.querySelector(".todo-checkbox").addEventListener("change", () => toggleTask(index));
        taskContainer.querySelector(".delete-task-btn").addEventListener("click", () => deleteTask(index));

        todoList.appendChild(taskContainer);
    });
    todoCount.textContent = todo.length;
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`); // Get the task element
    const existingText = todo[index].task; // Use the correct key: 'task'
    const inputElement = document.createElement("input"); // Create an input element

    inputElement.value = existingText; // Set the current text in the input
    inputElement.className = "edit-input"; // Optional: Add a class for styling
    todoItem.replaceWith(inputElement); // Replace the task text with the input
    inputElement.focus(); // Focus the input for editing

    // Handle when the user finishes editing (on blur)
    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim(); // Get the updated text
        if (updatedText) {
            todo[index].task = updatedText; // Update the task in the array
            saveToLocalStorage(); // Save changes to localStorage
        }
        displayTasks(); // Re-render the task list
    });

    // Handle "Enter" key to save and exit editing mode
    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            inputElement.blur(); // Trigger the blur event to save changes
        }
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}
function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
}

function deleteTask(index) {
    todo.splice(index, 1); // Remove the task at the given index
    saveToLocalStorage(); // Update localStorage
    displayTasks(); // Refresh the task list
}




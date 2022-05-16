const input = document.querySelector(".input input"),
categories = document.querySelectorAll(".controls .categories span"),
clear = document.querySelector(".clear"),
taskBox= document.querySelector(".tasks");

let editID;
let isEditedTask = false;
// getting localstorage todo list
let todos = JSON.parse(localStorage.getItem("todo-list"));

categories.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(category){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            // if status is completed then set isCompleted to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(category == todo.status || category == "all"){
                li += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <span onclick="showMenu(this)" class="material-symbols-outlined">more_horiz</span>
                            <ul class="menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><span class="material-symbols-outlined"id="edit">edit</span>Edit</li>
                                <li onclick="deleteTask(${id})"><span class="material-symbols-outlined"id="delete">delete</span>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>No tasks here!</span>`;
}

showTodo("all");

function showMenu(selectedTask){
    let menu = selectedTask.parentElement.lastElementChild;
    menu.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "SPAN" || e.target != selectedTask){
            menu.classList.remove("show");
        }
    });
}

function editTask(taskID, taskName){
    editID = taskID;
    isEditedTask = true;
    input.value = taskName;
}

function deleteTask(deleteID){
    // deleting task from array
    todos.splice(deleteID, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clear.addEventListener("click", () => {
    // remove everything
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
})
function updateStatus(selectedTask){
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        //updating status to completed
        todos[selectedTask.id].status = "completed";
    } else{
        taskName.classList.remove("checked");
        //updating status to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

input.addEventListener("keyup", e => {
    // trim to prevent user from submitting empty value
    let task = input.value.trim();
    if(e.key == "Enter" && task){
        if (!isEditedTask){
            if(!todos){
                // if doesn't exist, pass empty array to todos;
                todos = [];
            }
            let taskInfo = {name: task, status:"pending"};
            todos.push(taskInfo); // pushing new task to todos
        }else{
            isEditedTask = false;
            todos[editID].name= task;
        }

        input.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});
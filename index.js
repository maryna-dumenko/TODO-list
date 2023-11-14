'use strict';

const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const form = document.querySelector(".create-task-form");

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if(taskInput.value.trim() === '') {
        return;
    }

    const id = Date.now();

    createSingleTaskElement(taskInput.value, id);

    storeTaskInLocalStorage(taskInput.value, id);

    taskInput.value = '';
})

document.addEventListener('DOMContentLoaded', renderTasks)

taskList.addEventListener('click', (event) => {
    const iconContainer = event.target.parentElement;
    const tasks = getTasksFromStorage();

    if(iconContainer.classList.contains('delete-item')) {
        if (confirm('Are you sure?')) {
            iconContainer.parentElement.remove();

            tasks.forEach((task, index) => {
                if (Number(iconContainer.parentElement.dataset.id) === task.id) {
                    tasks.splice(index, 1);
                }
            })
        }
    } else if (iconContainer.classList.contains('edit-item')) {
        const newValueTask = prompt("Please edit task", iconContainer.parentElement.textContent).trim();
        iconContainer.parentElement.querySelector('.collection-item-text').textContent = newValueTask;

        tasks.forEach((task, index) => {
            if (Number(iconContainer.parentElement.dataset.id) === task.id) {
                task.taskName = newValueTask;
            }
        })
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
})
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        localStorage.clear();
        taskList.innerHTML = '';
    }
})
function createSingleTaskElement(newTask, id) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.dataset.id = id;

    const taskName = document.createElement('span');
    taskName.className = 'collection-item-text';
    taskName.innerHTML = newTask;
    li.appendChild(taskName);

    const deleteElement = document.createElement('span');
    deleteElement.className = 'delete-item';
    deleteElement.innerHTML = '<i class="fa fa-trash"></i>';

    const editElement = document.createElement('span');
    editElement.className = 'edit-item';
    editElement.innerHTML = '<i class="fa fa-edit"></i>';

    li.appendChild(editElement);
    li.appendChild(deleteElement);
    taskList.appendChild(li);
}

function getTasksFromStorage() {
    return localStorage.getItem('tasks') !== null
        ? JSON.parse(localStorage.getItem('tasks'))
        : [];
}

function storeTaskInLocalStorage(newTask, id) {
    const tasks = getTasksFromStorage();

    tasks.push({
        id: id,
        taskName: newTask
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const tasks = getTasksFromStorage();

    tasks.forEach((task) => {
        let { taskName, id } = task;
        createSingleTaskElement(taskName, id)
    })
}
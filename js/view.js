/* TODO: 
    -Añadir boton para borrar todo el input
    -Añadir lista de tareas completadas
    -Arreglar que al añadir una nueva tarea sólo me la muestre en la lista actual si estamos filtrando las tareas que pertenecen a esa categoría o estamos mostrando todas. Si no, se añade al array de tareas peo no se muestra.
 */

let pendingTasksSection = document.getElementById('pending-tasks');
let inputAddTask = document.querySelector('#input-add-task');
let addTaskIcon = document.getElementById('add-task-icon'); // Icon that adds a new pending task
let inputFilter = document.querySelector('#input-filter-task'); // Input that filters tasks by title
let selectFilter = document.querySelector('#select-filter-priority'); // Select that filters tasks by priority
let cancelDelete = document.getElementById('cancel-delete'); // Banner that shows up when deleting a task
let cancelDeleteBtn = cancelDelete.querySelector('span:last-child'); // Button of the cancel delete task banner
let idCount = 1; // This variable increases everytime we create a new task. Represents the id of that new task. It can only increase
let timeout_deletingTask, timeout_cancelBtn;
let idToRemove;
let cancelingTask;

addTaskIcon.addEventListener('click', addTask);
inputAddTask.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        addTask(e);
    }
});
inputFilter.addEventListener('input', executeFilterTasks);
selectFilter.addEventListener('change', executeFilterTasks);
cancelDeleteBtn.addEventListener('click', cancelDeleteTask);

function showPendingTasks(tasks = arrayPendingTasks, addingTask = false, removingTask = false) {
    let tasksList = '';

    for (task of tasks) {
        let priority = '';

        if (task.prioridad == 'monthly') {
            priority = 'MENSUAL';
        } else if (task.prioridad == 'weekly') {
            priority = 'SEMANAL';
        } else {
            priority = 'URGENTE'
        }

        tasksList += '<article class="task add-task-animation pending-task ' + task.prioridad + '" data-id="' + idCount + '"><h3>' + priority + '</h3><div><p>' + task.titulo + '</p><div class="task-actions"> <i class="fas fa-check"></i><i class="fas fa-trash"></i></div></div></article>'

        idCount++;
    }
    addingTask ? pendingTasksSection.innerHTML += tasksList : pendingTasksSection.innerHTML = tasksList;

    let trashIcons = document.querySelectorAll('.fa-trash')
    for (icon of trashIcons) {
        icon.addEventListener('click', removeTask);
    }
}

showPendingTasks(arrayPendingTasks);

function addTask(e) {
    e.preventDefault();
    let newTask = new Array();
    let inputAdd = document.querySelector('#input-add-task');
    let taskPriority = document.querySelector('#select-add-priority');
    let taskAddedHeader = document.getElementById('task-added');
    let tasksHTML = document.getElementsByClassName('pending-task'); // Si busco por 'add-task-animation' me coge todos los elementos que la tienen pero en el for() no me itera por todos ellos.

    if (inputAdd.value.trim() == '') {
        let errorTooltip = document.querySelector('.input-add-error-tooltip');

        errorTooltip.classList.add('show-error-tooltip');
        inputAdd.classList.add('show-error-border');

        setTimeout(() => {
            errorTooltip.classList.remove('show-error-tooltip');
            inputAdd.classList.remove('show-error-border');
        }, 3000)

        return;
    }

    for (task of tasksHTML) {
        task.classList.remove('add-task-animation');
    };

    newTask = [
        {
            idTarea: idCount,
            titulo: inputAdd.value,
            prioridad: taskPriority.value
        }
    ];

    inputAdd.value = ''; // Clean new task input
    inputAdd.focus(); // Focus again that input to add new task
    arrayPendingTasks.push(...newTask); // Add task to array containing all pending tasks
    showPendingTasks(newTask, true); // Show this new task along with the others already shown
    taskAddedHeader.classList.add('task-added'); // Animate 'Task added' header
    setTimeout(() => {
        taskAddedHeader.classList.remove('task-added') // Remove animation class from 'Task added' header
    }, 2100)
}

function executeFilterTasks() {
    let input = document.querySelector('#input-filter-task').value; // Input that filters tasks by title
    let select = document.querySelector('#select-filter-priority').value; // Select that filters tasks by priority

    showPendingTasks(filterTasks(input, select));
};

// Hide (display: none) task to delete
function removeTask(event) {
    // If we are already on the process of deleting a task (cancel deleting task banner is already showing) then delete that task and prepare to delete this new one
    if (cancelDelete.classList.contains('show-cancel-delete')) {
        console.log('Dentro del if')
        deletingTask(idToRemove, cancelingTask);
        // Clear timeout of old (currently going) deleting task before setting up the new one
        // clearTimeout(timeout_deletingTask);
        // console.log(timeout_cancelBtn);
        // clearTimeout(timeout_cancelBtn);
        // console.log(timeout_cancelBtn);
        // timeout_cancelBtn = setTimeout(removingCancelBtn, 4000);
        // We have to clone the node to reinitialize the animation, or force reflow (https://css-tricks.com/restart-css-animation/)
        let cancelDelete2 = cancelDelete.cloneNode(true);
        cancelDelete.parentNode.replaceChild(cancelDelete2, cancelDelete);
        cancelDelete = cancelDelete2;
        cancelDelete.classList.add('show-cancel-delete');
        cancelDeleteBtn = cancelDelete.querySelector('span:last-child'); // Re-get button so that the event listener works
        cancelDeleteBtn.addEventListener('click', cancelDeleteTask); //  Re-assign event listener to the new cancelDeleteBtn
        // clearTimeout(timeout_cancelBtn);
    }
    console.log('Fuera del if')
    // event.path is an array of tags going up the DOM tree beginning from the tag clicked (in this case the trash icon).
    // event.path[3] refers to the task being deleted. The <article> itself.
    idToRemove = parseInt(event.path[3].dataset.id);
    cancelingTask = event.path[3];
    console.log(event.path[3]);
    cancelingTask.style.display = 'none'; // Hide task that is going to be removed 
    cancelDelete.classList.add('show-cancel-delete'); // Cancel delete task button shows up

    cancelDelete.addEventListener('animationend', () => {
        removingCancelBtn();
        deletingTask(idToRemove, cancelingTask);
    });

    // After 4 seconds if the 'cancel delete' button has not been clicked, delete the task from the DOM and from the pending tasks array
    // timeout_deletingTask = setTimeout(deletingTask, 4000, idToRemove, cancelingTask, timeout_deletingTask);
}

// Hide 'cancel delete task' banner
function removingCancelBtn() {
    console.log('Removing cancel delete');
    cancelDelete.classList.remove('show-cancel-delete');
}

// Undo deleting the last clicked task (while 'cancel delete task' banner is showing (4s))
function cancelDeleteTask(event) {
    // clearTimeout(timeout_deletingTask);

    cancelDelete.classList.remove('show-cancel-delete');
    cancelingTask.style.display = 'block';
}

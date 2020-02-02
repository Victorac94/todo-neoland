/* TODO: 
    -Animar tareas para que ocupen el espacio de la tarea eliminada
    -Animar tarea que esta siendo eliminada
    -Agregar animacion de tarea restaurada (h2)
    -Arreglar que al restaurar una tarea solo se me muestre en la lista de tareas pendientes actual si no tengo filtro o las prioridades coinciden

   Hecho:
    -
 */

let pendingTasksSection = document.querySelector('#pending-tasks');
let inputAddTask = document.querySelector('#input-add-task');
let addTaskIcon = document.querySelector('#add-task-icon'); // Icon that adds a new pending task
let clearInputIcons = document.querySelectorAll('.clear-input');
let inputFilter = document.querySelector('#input-filter-task'); // Input that filters tasks by title
let selectFilter = document.querySelector('#select-filter-priority'); // Select that filters tasks by priority
let cancelDelete = document.querySelector('#cancel-delete'); // Banner that shows up when deleting a task
let cancelDeleteBtn = cancelDelete.querySelector('span:last-child'); // Button of the cancel delete task banner
let idCount = arrayPendingTasks.length; // This variable increases everytime we add a new task. Represents the id of that new task. It can only increase
let idToRemove;
let cancelingTask;

addTaskIcon.addEventListener('click', addNewTask);
inputAddTask.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        addNewTask(e);
    }
});
inputAddTask.addEventListener('keyup', toggleClearInputButton)
inputFilter.addEventListener('keyup', toggleClearInputButton);
inputFilter.addEventListener('input', executeFilterTasks);
selectFilter.addEventListener('change', executeFilterTasks);
clearInputIcons[0].addEventListener('click', clearInputFields);
clearInputIcons[1].addEventListener('click', clearInputFields);
cancelDeleteBtn.addEventListener('click', cancelDeleteTask);

// Show / hide clear input button
function toggleClearInputButton(e) {
    // If this function has been called by typing in the input fields
    if (e.target.tagName == 'INPUT') {
        if (e.target.value.trim() != '') {
            e.target.nextElementSibling.classList.add('show-clear-input');
        } else {
            e.target.nextElementSibling.classList.remove('show-clear-input');
        }
    }
    // If this function has been called by clicking on the clear input icon
    else {
        e.currentTarget.classList.remove('show-clear-input');
    }
}

// Delete input field values
function clearInputFields(e) {
    e.currentTarget.previousElementSibling.value = '';
    toggleClearInputButton(e);
    e.currentTarget.previousElementSibling.focus();
    // If it is the filter input
    if (e.currentTarget.parentNode.id == 'input-filter-task-wrapper') {
        executeFilterTasks();
    }
}

// Show all pending tasks
function showPendingTasks(tasks = arrayPendingTasks, addingTask = false) {
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

        tasksList += '<article class="task add-task-animation pending-task ' + task.prioridad + '" data-id="' + task.idTarea + '"><h3>' + priority + '</h3><div><p>' + task.titulo + '</p><div class="task-actions"> <i class="fas fa-check"></i><i class="fas fa-trash"></i></div></div></article>'
    }
    addingTask ? pendingTasksSection.innerHTML += tasksList : pendingTasksSection.innerHTML = tasksList;

    let addedTasks = document.querySelectorAll('.pending-task');

    addedTasks.forEach(task => {
        task.addEventListener('animationend', () => {
            task.classList.remove('add-task-animation');
            task.removeEventListener('animationend', this);
        })
    })

    let trashIcons = document.querySelectorAll('.fa-trash');
    let tickIcons = document.querySelectorAll('.fa-check');
    for (icon of trashIcons) {
        icon.addEventListener('click', removeTask);
    }
    for (icon of tickIcons) {
        icon.addEventListener('click', addCompletedTask);
    }
}

showPendingTasks(arrayPendingTasks, true);
inputAddTask.focus();

function addNewTask(e) {
    e.preventDefault();
    let newTask = new Array();
    let inputAdd = document.querySelector('#input-add-task');
    let taskPriority = document.querySelector('#select-add-priority');
    let selectedFilter = document.querySelector('#select-filter-priority');
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
            idTarea: ++idCount,
            titulo: inputAdd.value,
            prioridad: taskPriority.value
        }
    ];

    inputAdd.value = ''; // Clean new task input
    inputAdd.focus(); // Focus again that input to add new task
    arrayPendingTasks.push(...newTask); // Add task to array containing all pending tasks
    if (taskPriority.value == selectedFilter.value || selectedFilter.value == '') {
        showPendingTasks(newTask, true); // Show this new task along with the others already shown
    }
    taskAddedHeader.classList.add('task-added'); // Animate 'Task added' header
    taskAddedHeader.addEventListener('animationend', () => {
        taskAddedHeader.classList.remove('task-added') // Remove animation class from 'Task added' header
        taskAddedHeader.removeEventListener('animationend', this);
    })
}

function addCompletedTask(e) {
    let completedTasks = document.querySelector('#completed-tasks');
    let completedTasksWrapper = document.querySelector('.completed-tasks-wrapper');
    // let restoreTaskIcon;
    // 'e.target.parentNode.parentNode.parentNode' refers to the task where the tick icon was clicked, the <article>
    let task = e.target.parentNode.parentNode.parentNode;
    let [yElemMove, ySiblingsMove] = calculatePositions(task, completedTasks);

    let nextElems = moveAffectedElements(task, ySiblingsMove, completedTasksWrapper, false);

    // Translate the completed task to the 'completed tasks' section
    // task.style.transform = `translateY(${yElemMove}px)`;
    // task.style.zIndex = '10';
    // task.querySelector('i:first-child').classList.remove('fa-check');
    // task.querySelector('i:first-child').classList.add('fa-level-up-alt');
    // task.querySelector('i:last-child').classList.remove('fa-trash');
    // task.addEventListener('transitionend', () => {
    //     let taskCompleted = task.cloneNode(true); // If true, also copies the inner nodes
    //     nextElems.forEach(elem => {
    //         elem.style.transition = '0s'; // 0s makes the trick. If not, transition from class 'pending-task' remains active
    //         elem.style.transform = '';
    //     })
    //     task.remove();
    //     restoreTaskIcon = taskCompleted.querySelector('.fa-level-up-alt');
    //     restoreTaskIcon.addEventListener('click', restoreTask);
    //     taskCompleted.style.transition = '';
    //     taskCompleted.style.transform = '';
    //     taskCompleted.style.zIndex = 'initial';
    //     taskCompleted.classList.remove('pending-task');
    //     taskCompleted.classList.add('completed-task');
    //     completedTasks.appendChild(taskCompleted);
    //     swapTaskBetweenLists(taskCompleted.dataset.id, arrayPendingTasks, arrayCompletedTasks);
    // })
    manipulateTasks(task, nextElems, completedTasks, yElemMove, false);
}

function manipulateTasks(task, nextElems, sectionToAppend, yElemMove, isRestoringTask) {
    task.style.transform = `translateY(${yElemMove}px)`;
    task.style.zIndex = '10';
    if (isRestoringTask) {
        task.querySelector('i:first-child').classList.remove('fa-level-up-alt');
        task.querySelector('i:first-child').classList.add('fa-check');
        task.querySelector('i').parentNode.innerHTML += '<i class="fas fa-trash"></i>';
    } else {
        task.querySelector('i:first-child').classList.remove('fa-check');
        task.querySelector('i:first-child').classList.add('fa-level-up-alt');
        task.querySelector('i:last-child').classList.remove('fa-trash');
    }

    task.addEventListener('transitionend', () => {
        let taskCompleted = task.cloneNode(true); // If true, also copies the inner nodes

        nextElems.forEach(elem => {
            elem.style.transition = '0s'; // 0s makes the trick. If not, transition from class 'pending-task' remains active
            elem.style.transform = '';
        })
        task.remove();

        if (isRestoringTask) {
            taskCompleted.querySelector('i:first-child').addEventListener('click', addCompletedTask);
            taskCompleted.querySelector('i:last-child').addEventListener('click', removeTask);
            taskCompleted.classList.remove('completed-task');
            taskCompleted.classList.add('pending-task');
        } else {
            let restoreTaskIcon = taskCompleted.querySelector('.fa-level-up-alt');
            restoreTaskIcon.addEventListener('click', restoreTask);
            taskCompleted.classList.remove('pending-task');
            taskCompleted.classList.add('completed-task');
        }
        taskCompleted.style.transition = '';
        taskCompleted.style.transform = '';
        taskCompleted.style.zIndex = 'initial';
        sectionToAppend.appendChild(taskCompleted);
        if (isRestoringTask) {
            swapTaskBetweenLists(taskCompleted.dataset.id, arrayCompletedTasks, arrayPendingTasks);
        } else {
            swapTaskBetweenLists(taskCompleted.dataset.id, arrayPendingTasks, arrayCompletedTasks);
        }
    })
}

function restoreTask(e) {
    let task = e.target.parentNode.parentNode.parentNode; // The task itself, the <article>
    // let taskRestoredHeader = document.querySelector('#task-restored');
    let completedTasksWrapper = document.querySelector('.completed-tasks-wrapper');
    let [yElemMove, ySiblingsMove] = calculatePositions(task, pendingTasksSection);
    let nextElems = moveAffectedElements(task, ySiblingsMove, completedTasksWrapper, true);

    // task.style.transform = `translateY(${yElemMove}px)`;
    // task.style.zIndex = '10';
    // task.querySelector('i:first-child').classList.remove('fa-level-up-alt');
    // task.querySelector('i:first-child').classList.add('fa-check');
    // task.querySelector('i').parentNode.innerHTML += '<i class="fas fa-trash"></i>';
    // task.addEventListener('transitionend', () => {
    //     let taskCompleted = task.cloneNode(true); // If true, also copies the inner nodes
    //     nextElems.forEach(elem => {
    //         elem.style.transition = '0s'; // 0s makes the trick. If not, transition from class 'pending-task' remains active
    //         elem.style.transform = '';
    //     })
    //     task.remove();
    //     taskCompleted.querySelector('i:first-child').addEventListener('click', addCompletedTask);
    //     taskCompleted.querySelector('i:last-child').addEventListener('click', removeTask);
    //     taskCompleted.style.transition = '';
    //     taskCompleted.style.transform = '';
    //     taskCompleted.style.zIndex = 'initial';
    //     taskCompleted.classList.remove('completed-task');
    //     taskCompleted.classList.add('pending-task');
    //     pendingTasksSection.appendChild(taskCompleted);
    //     swapTaskBetweenLists(taskCompleted.dataset.id, arrayCompletedTasks, arrayPendingTasks);
    // })
    manipulateTasks(task, nextElems, pendingTasksSection, yElemMove, true);
    // taskRestoredHeader.classList.add('task-added');
    // taskRestoredHeader.addEventListener('animationend', () => {
    //     taskRestoredHeader.classList.remove('task-added');
    //     taskRestoredHeader.removeEventListener('animationend', this);
    // })
}

// Translate the tasks that come after the one completed/re-added and the tasks completed section to occupy its position
function moveAffectedElements(task, distance, completedTasksWrapper, isRestoring) {
    let nextElems = new Array();
    isRestoring = isRestoring ? '+' : '-';

    completedTasksWrapper.style.transition = 'all 0.5s';
    completedTasksWrapper.style.transform = `translateY(${isRestoring + distance + 2}px)`; // '+ 2' counts for the margin-top of the tasks
    while (task) {
        task.style.transition = 'all 0.5s';
        task.style.transform = `translateY(-${distance + 2}px)`; // '+ 2' counts for the margin-top of the tasks
        nextElems.push(task);
        task.addEventListener('transitionend', e => {

            e.target.removeEventListener('transitionend', this);
        })

        task = task.nextElementSibling;
    }

    completedTasksWrapper.addEventListener('transitionend', () => {
        completedTasksWrapper.style.transition = '';
        completedTasksWrapper.style.transform = '';
        completedTasksWrapper.removeEventListener('transitionend', this);
    })

    return nextElems;
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
        deletingTask(idToRemove, cancelingTask, arrayPendingTasks);
        // We have to clone the node to reinitialize the animation, or force reflow (https://css-tricks.com/restart-css-animation/)
        let cancelDelete2 = cancelDelete.cloneNode(true); // If true, also copies the inner nodes
        cancelDelete.parentNode.replaceChild(cancelDelete2, cancelDelete);
        cancelDelete = cancelDelete2;
        cancelDelete.classList.add('show-cancel-delete');
        cancelDeleteBtn = cancelDelete.querySelector('span:last-child'); // Re-get button so that the event listener works
        cancelDeleteBtn.addEventListener('click', cancelDeleteTask); //  Re-assign event listener to the new cancelDeleteBtn
    }
    // event.path is an array of tags going up the DOM tree beginning from the tag clicked (in this case the trash icon).
    // event.path[3] refers to the task being deleted. The <article> itself.
    idToRemove = parseInt(event.path[3].dataset.id);
    cancelingTask = event.path[3];
    cancelingTask.style.display = 'none'; // Hide task that is going to be removed 
    cancelDelete.classList.add('show-cancel-delete'); // Cancel delete task button shows up

    cancelDelete.addEventListener('animationend', () => {
        removingCancelBtn();
        deletingTask(idToRemove, cancelingTask, arrayPendingTasks);
    });
}

// Hide 'cancel delete task' banner
function removingCancelBtn() {
    cancelDelete.classList.remove('show-cancel-delete');
}

// Undo deleting the last clicked task (while 'cancel delete task' banner is showing (4s))
function cancelDeleteTask(event) {
    cancelDelete.classList.remove('show-cancel-delete');
    cancelingTask.style.display = 'block';
}


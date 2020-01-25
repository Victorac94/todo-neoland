let arrayPendingTasks = [
    {
        idTarea: 1,
        titulo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        prioridad: 'monthly'
    },
    {
        idTarea: 2,
        titulo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        prioridad: 'weekly'
    },
    {
        idTarea: 3,
        titulo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        prioridad: 'monthly'
    },
    {
        idTarea: 4,
        titulo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        prioridad: 'urgent'
    },
];

let pendingTasksSection = document.getElementById('pending-tasks');
let idCount = 1; // This variable increases everytime we create a new task. Represents the id of that new task. It can only increase

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
}

showPendingTasks(arrayPendingTasks);

function addTask(titulo, priority = 'urgent') {
    let newTask = new Array();
    let taskAddedHeader = document.getElementById('task-added');
    let tasksHTML = document.getElementsByClassName('pending-task'); // Si busco por 'add-task-animation' me coge todos los elementos que la tienen pero en el for() no me itera por todos ellos.
    console.log(tasksHTML);

    for (task of tasksHTML) {
        console.log(task);
        task.classList.remove('add-task-animation');
    };

    newTask = [
        {
            idTarea: idCount,
            titulo: titulo,
            prioridad: priority
        }
    ];

    arrayPendingTasks.push(...newTask);
    showPendingTasks(newTask, true);
    taskAddedHeader.classList.add('task-added'); // Animate 'Task added' header
    setTimeout(() => {
        taskAddedHeader.classList.remove('task-added') // Remove animation class from 'Task added' header
    }, 2100)
}

function removeTask(id, event) {
    let pendingTasksContainer = document.querySelectorAll('.pending-task');
    let idToRemove = id || event.target.dataset.id;



    // for (let i = 0; i < arrayPendingTasks.length; i++) {
    //     let task = arrayPendingTasks[i];

    //     if (idToRemove === task.idTarea) {
    //         arrayPendingTasks.splice(i, 1);
    //     }
    // }
    // console.log(arrayPendingTasks);
    // showPendingTasks();
}
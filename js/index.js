let arrayPendingTasks = [
    {
        id: 1,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        priority: 'low'
    },
    {
        id: 2,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        priority: 'medium'
    },
    {
        id: 3,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        priority: 'low'
    },
    {
        id: 4,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, natus?',
        priority: 'high'
    },
];

let pendingTasksSection = document.getElementById('pending-tasks');

function showPendingTasks(tasks = arrayPendingTasks) {
    let tasksList = '';
    for (task of tasks) {
        let priority = '';

        if (task.priority == 'low') {
            priority = 'Prioridad baja';
        } else if (task.priority == 'medium') {
            priority = 'Prioridad media';
        } else {
            priority = 'Prioridad alta'
        }

        tasksList += '<article class="task add-task-animation ' + task.priority + '"><h3>' + priority + '</h3><div><p>' + task.text + '</p><div class="task-actions"> <i class="fas fa-check"></i><i class="fas fa-trash"></i></div></div></article>'
    }
    pendingTasksSection.innerHTML = tasksList;
}

showPendingTasks();
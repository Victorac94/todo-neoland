// Calculate the distance a task has to translate when completing it or restoring it
function calculatePositions(fromElem, toElem) {
    let fromPos = fromElem.getBoundingClientRect();
    let toPos = toElem.getBoundingClientRect();
    let yDistance = toPos.bottom - fromPos.bottom + 2; // '2' counts for the margin-top of the task

    return [yDistance, fromPos.height];
}

// Filter tasks by priority and content
function filterTasks(input, select) {
    input = input.trim().toLowerCase();
    select = select.trim().toLowerCase();

    let listaFiltrada = arrayPendingTasks.filter(task => {
        return task.titulo.toLowerCase().includes(input) && task.prioridad.toLowerCase().includes(select);
    })

    return listaFiltrada;
}

// Delete selected task from DOM and from array containing all pending tasks
function deletingTask(idToRemove, cancelingTask, fromList) {
    cancelingTask.remove(); // Delete from DOM

    // Search the corresponding task on the array of pending tasks
    for (let i = 0; i < fromList.length; i++) {
        let task = fromList[i];

        if (idToRemove === task.idTarea) {
            fromList.splice(i, 1);
            console.log(fromList);
        }
    }
}

// Delete selected task from one list and push it to the other
function swapTaskBetweenLists(taskId, fromList, toList) {
    fromList.forEach((t, i) => {
        if (taskId == t.idTarea) {
            fromList.splice(i, 1);
            toList.push(t);
            console.log(fromList, toList);
        }
    })
}
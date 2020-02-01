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
function deletingTask(idToRemove, cancelingTask) {
    console.log('Dentro del timeout()');
    cancelingTask.remove(); // Delete from DOM

    // Search the corresponding task on the array of pending tasks
    for (let i = 0; i < arrayPendingTasks.length; i++) {
        let task = arrayPendingTasks[i];

        if (idToRemove === task.idTarea) {
            arrayPendingTasks.splice(i, 1);
        }
    }
    // clearTimeout(timeout_deletingTask); // Opcional?
    // timeout_deletingTask
}
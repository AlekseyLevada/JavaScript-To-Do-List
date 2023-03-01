const addTaskBtn = document.getElementById('add-btn')
const upTaskBtn = document.getElementById('up-btn')
const tasksList = document.getElementById('tasks-list')
const popupOverlay = document.getElementById('popup-overlay')
const popup = document.getElementById('popup')
let modeObjects
let checkBtns
let inputMainTask
let popupSubList
let curentTask
let modeUp = false

let tasks
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))

function Task(){
    this.description = 'New task'
    this.completed = 'processed'
    this.subGoals = [
        new SubTask,
        new SubTask
    ]
}
function SubTask(){
    this.description = 'New sub-task'
    this.completed ='processed'
}

function updateLocal(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function templateAdd(item, index){
    return `
        <div id='task-${index}' class="task">
            <div class="main-goal">
                <button onClick="checkedMainTask(${index})" id='btn-status-${index}' class="btn-status"></button>
                <p id='task-title-${index}'>${item.description}</p>
                <button onClick="editTask(${index})" class="btn-editTask">Edit Task</button>
                <button onClick="delTask(${index})" class="btn-delTask">Delete Task</button>
            </div>
            <div id='sub-goal-${index}' class="sub-goal"></div>
        </div>
    `
}
function templateEdit(index){
    curentTask = index
    return `
        <div class='popup-header'>
            <p class='popup-title'>Edit task</p>
            <button onClick='popupClose()' class='popup-close'>Close</button>
        </div>
        <div class='popup-input--maintask' placeholder='name task'>
            <input id='input-maintask' value='${tasks[index].description}' placeholder='Main task'></input>
            <p>- main task</p>
        </div>
        <div id='popup-subslist' class='popup-subslist'></div>
        <button onClick='addSubTask()' class='add-sub-task'>Add SubTask</button>
        <button onClick='editConfirm(${index})' class='popup-done'>Done</button>
    `
}
function templateSubs(item, index, MT){
    return `
        <div class='sub-task'>
            <button onClick="checkedSubTask(${index}, ${MT})" id='btn-status-sub(${MT}-${index})' class="btn-status"></button>
            <p id='title-sub(${MT}-${index})'>${item.description}</p>
        </div>
    `
}
function templatePopupSubs(index){
    return `
        <div id='popup-subtask-${index}' class='popup-subtask popup-subtask-${index}'>
            <input id='input-subtask-${index}' value='${tasks[curentTask].subGoals[index].description}' placeholder='Subtask'></input>
            <p>- subtask #${index+1}</p>
            <button onClick='subDel(${index})' class='sub-del'>Delete</button>
        </div>
    `
}

function fillHTML(){
    tasksList.innerHTML = ''
    if(tasks.length > 0){
        tasks.forEach((item, index) => {
            tasksList.innerHTML += templateAdd(item, index)
            fillSubTask(index)
        })
    }
    modeObjects = document.querySelectorAll('.btn-editTask, .btn-delTask')
    checkProcesed()
    checkProcesedSub()
}
function fillSubTask(index){
    const localSubs = document.getElementById(`sub-goal-${index}`)
    const MT = index
    if(tasks[index].subGoals.length > 0){
        tasks[index].subGoals.forEach((item, index) => {
            localSubs.innerHTML += templateSubs(item, index, MT)
        })
    }
}

addTaskBtn.addEventListener('click', () => {
    tasks.push(new Task)
    updateLocal()
    fillHTML()
    exameMode()
})
upTaskBtn.addEventListener('click', () => {
    modeUp === false ? modeUp = true : modeUp = false
    exameMode()
})
function delTask(index){
    tasks.splice(index, 1)
    updateLocal()
    fillHTML()
    exameMode()
}
function addSubTask(){
    tasks[curentTask].subGoals.push(new SubTask)
    updateLocal()
    fillHTML()
    editTask(curentTask)
    exameMode()
}
function subDel(index){
    const localsubDel = document.getElementById(`popup-subtask-${index}`)
    tasks[curentTask].subGoals.splice(index, 1)
    localsubDel.classList.add('disable')
    updateLocal()
    fillHTML()
    editTask(curentTask)
    exameMode()
}
function editTask(index){
    popupOverlay.classList.remove('disable')
    popup.innerHTML = ''
    popup.innerHTML += templateEdit(index)
    inputMainTask = document.getElementById('input-maintask')
    popupSubList = document.getElementById('popup-subslist')
    popupSubList.innerHTML = ''
    if(tasks[index].subGoals.length > 0){
        tasks[index].subGoals.forEach((item, index) => {
            popupSubList.innerHTML += templatePopupSubs(index)
        })
    }
}
function popupClose(){
    popupOverlay.classList.add('disable')
}
function editConfirm(index){
    tasks[index].description = inputMainTask.value
    for(i = 0; i < tasks[index].subGoals.length; i++){
        const localfor = document.getElementById(`input-subtask-${i}`)
        tasks[index].subGoals[i].description = localfor.value
    }
    updateLocal()
    fillHTML()
    exameMode()
    popupClose()
}
function checkProcesed(){
    for(i = 0; i < tasks.length; i++){
        const taskTitle = document.getElementById(`task-title-${i}`)
        const task = document.getElementById(`task-${i}`)
        const btnStatus = document.getElementById(`btn-status-${i}`)
        if(tasks[i].completed === 'completed'){
            taskTitle.classList.add('completed')
            task.classList.add('completed-task')
            btnStatus.classList.add('btn-status-completed')
        }else if(tasks[i].completed === 'failed'){
            taskTitle.classList.add('failed')
            taskTitle.classList.remove('completed')
            task.classList.add('failed-task')
            task.classList.remove('completed-task')
            btnStatus.classList.add('btn-status-failed')
            btnStatus.classList.remove('btn-status-completed')
        }else if(tasks[i].completed === 'processed'){
            taskTitle.classList.remove('failed')
            task.classList.remove('failed-task')
            btnStatus.classList.remove('btn-status-failed')
        }
    }
}
function checkedMainTask(index){
    if(tasks[index].completed === 'processed'){
        tasks[index].completed = 'completed'
    }else if(tasks[index].completed === 'completed'){
        tasks[index].completed = 'failed'
    }else if(tasks[index].completed === 'failed'){
        tasks[index].completed = 'processed'
    }
    updateLocal()
    checkProcesed()
}
function checkProcesedSub(){
    for(i = 0; i < tasks.length; i++){
        for(subs = 0; subs < tasks[i].subGoals.length; subs++){
            const taskTitle = document.getElementById(`title-sub(${i}-${subs})`)
            const btnStatus = document.getElementById(`btn-status-sub(${i}-${subs})`)
            if(tasks[i].subGoals[subs].completed === 'completed'){
                taskTitle.classList.add('completed')
                btnStatus.classList.add('btn-status-completed')
            }else if(tasks[i].subGoals[subs].completed === 'failed'){
                taskTitle.classList.add('failed')
                taskTitle.classList.remove('completed')
                btnStatus.classList.add('btn-status-failed')
                btnStatus.classList.remove('btn-status-completed')
            }else if(tasks[i].subGoals[subs].completed === 'processed'){
                taskTitle.classList.remove('failed')
                btnStatus.classList.remove('btn-status-failed')
            }
        }
    }
}
function checkedSubTask(index, MT){
    if(tasks[MT].subGoals[index].completed === 'processed'){
        tasks[MT].subGoals[index].completed = 'completed'
    }else if(tasks[MT].subGoals[index].completed === 'completed'){
        tasks[MT].subGoals[index].completed = 'failed'
    }else if(tasks[MT].subGoals[index].completed === 'failed'){
        tasks[MT].subGoals[index].completed = 'processed'
    }
    updateLocal()
    checkProcesedSub()
}
function exameMode(){
    if(modeUp === true){
        upTaskBtn.classList.add('active')
        modeObjects.forEach(function(elem){
            elem.classList.add('mode')
        })
    }else if(modeUp === false){
        upTaskBtn.classList.remove('active')
        modeObjects.forEach(function(elem){
            elem.classList.remove('mode')
        })
    }
}

fillHTML()
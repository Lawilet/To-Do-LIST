const taskList = document.querySelector('.tasks-list')
const createBtn = document.querySelector('.create-task-block__button')
const taskInput = document.querySelector('.create-task-block__input')
const createTaskBlock = document.querySelector('.create-task-block')
const taskAlert = document.querySelector('.alert-task')
const validTask = document.querySelector('.valid-task')
const body = document.querySelector('body')


let tasks = []


!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'))


createBtn.addEventListener('click', addTask)

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function addTask(event) {
  event.preventDefault()
  if(checkdublicateTasks() && checkTaskValidation()) {
    pushTask()
  } 
  taskInput.value = ''
  updateLocalStorage()
  createTask()
}

function createTask() {
  taskList.innerHTML = ''
  if(tasks.length > 0) {
    filterTasks()
    tasks.forEach((element) => {
      taskList.innerHTML += `
      <div class="task-item ${element.completed ? 'checked' : ''}" data-task-id="${element.id}">
        <div class="task-item__main-container">
          <div class="task-item__main-content">
            <form class="checkbox-form">
              <input onclick="isTaskChecked(event)" ${element.completed ? "checked" : ''} class="checkbox-form__checkbox" type="checkbox" id="task-${element.id}">
              <label for="task-${element.id}"></label>
            </form>
            <span class="task-item__text">${element.text}</span>
          </div>
          <button onclick="showModal(event)" class="task-item__delete-button default-button delete-button" data-delete-task-id="${element.id}">Удалить</button>
        </div>
      </div>`
    })
  }
}

createTask()

function pushTask() {
  let task = {
    id: Date.now(),
    completed: false,
    text: taskInput.value
  }
  tasks.push(task)
}

function checkdublicateTasks() {
  if(tasks.length <= 0) {
    return true
  }else {
    const findElements = tasks.some((element) => {
      return element.text === taskInput.value
    })
    if(!findElements) {
      validTask.classList.remove('block')
      return true
    }else {
      validTask.classList.add('block')
      return false
    }
  }
}

function checkTaskValidation() {
  if(taskInput.value) {
    taskAlert.classList.remove('block')
    return true
  }else {
    taskAlert.classList.add('block')
    return false
  }
}

function filterTasks() {
  const activeTasks = tasks.length > 0 && tasks.filter((element) => element.completed == false)
  const completedTasks = tasks.length > 0 && tasks.filter((element) => element.completed == true)
  tasks = [...activeTasks, ...completedTasks]
}

function deleteItem(event) {

  const { target } = event
  const test = document.querySelector(`div[data-task-id="${target.dataset.deleteTaskId}"]`)
  test.classList.add('delete')
  setTimeout(() => {
    tasks = tasks.filter((element) => element.id != target.dataset.deleteTaskId)
    updateLocalStorage()
    createTask()
  },600)
  closeModal()
}

function isTaskChecked(event) {
  const { target } = event
  tasks.filter((element) => {
    if(element.id == target.id.slice(5)) {
      element.completed = !element.completed
    }
  })
  updateLocalStorage()
  createTask()
}

const modal = document.querySelector('.modal-overlay')
const deleteButton = document.querySelector('.delete-modal__buttons')

function showModal(event) {
  const { target } = event
  if(target.dataset.deleteTaskId) {
    modal.classList.toggle('modal-overlay_hidden')
    const deleteBtn = document.querySelector('.delete-modal__confirm-button')
    deleteBtn.dataset.deleteTaskId = target.dataset.deleteTaskId
  }
}

function closeModal() {
  modal.classList.toggle('modal-overlay_hidden')
}


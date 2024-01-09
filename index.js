var taskTitle = document.getElementById("task-title")
var taskPriority = document.getElementById("task-priority")
var tasks = []

function saveAndReload() {
    var jsonTasks = JSON.stringify(tasks)
    localStorage.setItem("tasks-list", jsonTasks)
    window.location.reload()
}

function sortTask(a, b) {
    if (a.priority == b.priority) {
	return sortTaskByAge(a, b)
    }
    return a.priority - b.priority
}

function sortTaskByAge(a, b) {
    return b.age - a.age
}

function addTask() {
    var title = taskTitle.value
    var priority = taskPriority.value
    tasks.push({"title": title, "priority": priority, "oldPriority": priority, "age": 0})
    saveAndReload()
}

function removeTask() {
    var i = tasks.indexOf(this.task)
    tasks.splice(i, 1);
    saveAndReload()
}

function step() {
    tasks = tasks.sort(sortTask)
    var currentTask = tasks[0]
    tasks.splice(0, 1)
    currentTask.priority = currentTask.oldPriority
    currentTask.age = 0
    for (var i = 0; i < tasks.length; i++) {
	tasks[i].age++
    }
    tasks = tasks.sort(sortTaskByAge)
    tasks[0].priority = Math.max(tasks[0].priority - 1, 1)
    tasks[0].age = 0
    
    tasks.push(currentTask)
    saveAndReload()
}

function main() {
    var localData = localStorage.getItem("tasks-list")
    
    if (localData == null) {
	return;
    }

    tasks = JSON.parse(localData)
    tasks = tasks.sort(sortTask)
    for (var i = 0; i < tasks.length; i++) {
	var elem = document.createElement("li")
	if (i == 0) {
	    var bold = document.createElement("b")
	    bold.innerText = tasks[i].title
	    elem.appendChild(bold)
	} else {
	    elem.innerText = tasks[i].title
	}
	var removeButton = document.createElement("button")
	removeButton.innerText = "X"
	removeButton.addEventListener("click", removeTask)
	removeButton.task = tasks[i]
	elem.appendChild(removeButton)
	document.getElementById("task-list").appendChild(elem)
    }
}
main()

if (Notification.permission != "granted") {
    Notification.requestPermission()
}

function notify() {
    var notification = new Notification("Tasks: Time Quantum Up!");    
}

setTimeout(notify, 1000 * 60 * 15);

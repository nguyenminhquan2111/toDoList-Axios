import Task from "./models/task.js";
import TaskService from "./models/taskService.js";

const taskService = new TaskService();

const getEle = (id) => document.getElementById(id);

// const findIndexById = (id, list) => {
//   return list.findIndex((item) => item.id === id);
// };

const flag = (boolean) => {
  if (boolean) {
    getEle("loader").style.display = "block";
    getEle("todo").style.display = "none";
    getEle("completed").style.display = "none";
  }
  if (!boolean) {
    getEle("loader").style.display = "none";
    getEle("todo").style.display = "block";
    getEle("completed").style.display = "block";
  }
};

const renderHTML = () => {
  const content = `
    <div class="card">
        <div class="card__header">
            <img src="./img/X2oObC4.png" />
        </div>
        <!-- <h2>hello!</h2> -->
        <div class="card__body">
            <div class="card__content">
            <div class="card__title">
                <h2>My Tasks</h2>
                <p id="currentDay"></p>
            </div>
            <div class="card__add">
                <input id="newTask" type="text" placeholder="Enter an activity..."/>
                <button id="addItem">
                <i class="fa fa-plus"></i>
                </button>
            </div>
            <div id="notiInput" class="alert-danger" style="display: none"></div>
            <div class="card__todo">
                <div class="lds-ellipsis" id="loader"><div></div><div></div><div></div><div></div></div>
                <!-- Uncompleted tasks -->
                <ul class="todo" id="todo"></ul>
                <!-- Completed tasks -->
                <ul class="todo" id="completed"></ul>
            </div>
            </div>
        </div>
    </div>`;

  getEle("root").innerHTML = content;
};
renderHTML();

const getDay = () => {
  let d = new Date();

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var stringMonth = month[d.getMonth()];
  let day = d.getDate();
  let year = d.getFullYear();

  let content = `${stringMonth} ${day},${year}`;
  getEle("currentDay").innerHTML = content;
};
getDay();

const createList = (list) => {
  let content = "";
  for (let i in list) {
    content += `
      <li>
          ${list[i].textTask}
          <div class="buttons">
              <button class="remove" onclick="handleDeleteTask('${list[i].id}')"><i class="far fa-trash-alt"></i></button>
              <button class="complete" onclick="handleCompleteTask('${list[i].id}')"><i class="far fa-check-circle"></i></button>
          </div>
      </li>
      `;
  }
  getEle("todo").innerHTML = content;
  getEle("newTask").value = "";
};

const createListCompleted = (list) => {
  let listCompletedTaskHTML = "";
  for (let i in list) {
    listCompletedTaskHTML += `<li>${list[i].textTask}
                  <div class="buttons">
                      <button class="remove" onclick="handleDeleteTask('${list[i].id}')"><i class="far fa-trash-alt"></i></button>
                      <button class="complete" onclick="handleUncompleteTask('${list[i].id}')"><i class="fas fa-check-circle"></i></button>
                  </div>
                </li>`;
  }

  getEle("completed").innerHTML = listCompletedTaskHTML;
};

const showListTask = () => {
  const listTaskToDo = [];
  const listTaskComplete = [];
  flag(true);
  taskService
    .getListTask()
    .then((res) => {
      flag(false);
      for (let i in res.data) {
        if (res.data[i].status === "todo") {
          listTaskToDo.push(res.data[i]);
        }
        if (res.data[i].status === "complete") {
          listTaskComplete.push(res.data[i]);
        }
      }
      console.log(listTaskToDo);
      console.log(listTaskComplete);
      createList(listTaskToDo);
      createListCompleted(listTaskComplete);
    })
    .catch((err) => console.log(err));
};

showListTask();

const getInfoTask = (id) => {
  return taskService
    .getTaskById(id)
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

const handleCompleteTask = async (id) => {
  const updateTask = await getInfoTask(id);
  updateTask.status = "complete";
  taskService
    .updateTask(updateTask)
    .then(() => {
      showListTask();
    })
    .catch((err) => console.log(err));
};

const handleUncompleteTask = async (id) => {
  const updateTask = await getInfoTask(id);
  updateTask.status = "todo";
  taskService
    .updateTask(updateTask)
    .then(() => {
      showListTask();
    })
    .catch((err) => console.log(err));
};

const handleDeleteTask = (id) => {
  taskService
    .deleteTask(id)
    .then(() => showListTask())
    .catch((err) => console.log(err));
};

getEle("addItem").addEventListener("click", () => {
  let nameTask = getEle("newTask").value;

  const newTask = new Task("", nameTask, "todo");
  taskService
    .addTask(newTask)
    .then(() => showListTask())
    .catch((err) => console.log(err));
});

window.handleCompleteTask = handleCompleteTask;
window.handleUncompleteTask = handleUncompleteTask;
window.handleDeleteTask = handleDeleteTask;

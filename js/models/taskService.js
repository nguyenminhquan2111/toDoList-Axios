import { callAPI } from "../utils/callAPI.js";
class TaskService {
  getListTask() {
    return callAPI("textTask", "GET", null);
  }
  addTask(newTask) {
    return callAPI("textTask", "POST", newTask);
  }
  deleteTask(id) {
    return callAPI(`textTask/${id}`, "DELETE", null);
  }
  getTaskById(id) {
    return callAPI(`textTask/${id}`, "GET", null);
  }
  updateTask(updateTask) {
    return callAPI(`textTask/${updateTask.id}`, "PUT", updateTask);
  }
}
export default TaskService;

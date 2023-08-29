import taskModel from "../../database/models/task.model.js";
import taskStatusService from "./task.status.service.js";

const create = async (req) => {
  const resp = await taskModel.create(req);
  return resp;
};

const findByOrderId = async (orderId) => {
  const resp = await taskModel.find({ order_id: orderId }).populate("status.status_logs order_details.payment_type");
  return { data: resp };
};

const findBytaskIdAndType = async (taskId, type) => {
  const taskExist = await taskModel.findOne({ task_id: taskId, type });
  if (taskExist) {
    throw new Error("Couldn't found task!");
  }
  return taskExist;
};

const updateTaskStatusBySlug = async (taskId, type, slug) => {
  const taskExist = await findBytaskIdAndType(taskId, type);
  const statusIsValid = await taskStatusService.findBySlug(slug);
  let newTaskArray = taskExist.status;
  newTaskArray.map((v, i) => {
    newTaskArray[i].active = false;
  });
  newTaskArray.push({ status_logs: statusIsValid.data._id, active: true });
  const response = await updateTaskStatus({ taskId, type, tasks: newTaskArray });
  return { data: response };
};

const updateTaskStatus = async (req) => {
  const updatedTask = await taskModel.findOneAndUpdate({ _id: req.taskId }, { status: [...req.tasks] });
  return { data: updatedTask };
};

const findById = async (req) => {
  const response = await taskModel.findById(req).populate("rider status.status_logs order_details.payment_type");
  if (!response) {
    throw new Error("Invalid task id!");
  }
  return { data: response };
};

const findByRiderId = async (riderId) => {
  const response = await taskModel.find({ rider: riderId }).populate("rider status.status_logs issues order_details.payment_type").exec();
  return { data: response };
};

const assignRiderToTask = async (taskId, riderId) => {
  const updatedTask = await taskModel.findOneAndUpdate({ _id: taskId }, { rider: riderId });
  return { data: updatedTask };
};
const TaskService = {
  create,
  updateTaskStatusBySlug,
  findByOrderId,
  updateTaskStatus,
  findById,
  findByRiderId,
  assignRiderToTask,
};
export default TaskService;

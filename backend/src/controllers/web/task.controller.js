import TaskDto from "../../dto/task.dto.js";
import taskService from "../../services/web/task.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import taskAssignmentService from "../../services/web/task.assign.service.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/task.assignment.status.slug.js";
import taskStatusService from "../../services/web/task.status.service.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import moment from "moment";
import { emit, socket } from "../../config/socket.js";
import TaskAssignSocketDto from "../../dto/socket/task.assign.dto.js";
import { statusChange } from "../../utils/task.status.helper.js";

const create = async (req, res, next) => {
  try {
    let response = await taskService.create(req);
    response.data = await Promise.all(response.data.map(TaskDto))
    response.message = `Task has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    let response = await taskService.findAll();
    let taskList = response.data.map(TaskDto);
    response.data = await Promise.all(taskList)
    response.message = `Task has been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const find = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    let response = await taskService.findById(taskId);
    if (!response.data) {
      throw Error("Invalid task id");
    }
    response.data = await TaskDto(response.data);
    response.message = `Task retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const riderTasks = async (req, res, next) => {
  try {
    const riderId = req.params.riderId;
    let response = await taskService.findByRiderId(riderId);
    let taskList = response.data.map(TaskDto);
    response.data = await Promise.all(taskList);
    response.message = `Task retrieved successfully`;
    if (!response.data) {
      response.message = `No Task Found`;
    }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const assignTaskRiderRequest = async (req, res, next) => {
  try {
    const payload = req.body;
    let response = await taskAssignmentService.createOrUpdate(payload);
    response = await taskAssignmentService.findById(response.data._id);
    response.data.task_id.status = response.data.task_id.status.filter((v,i) => {
      return v.active == true
    }) 
    const socketResponse = await emit(
      "TASK_REQUEST",
      TaskAssignSocketDto(response.data)
    );
    response.message = `Task assignment requested successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const assignTaskToRider = async (req, res, next) => {
  try {
    const payload = req.body;
    const record = await taskService.findById(payload.taskId);
    if (record.data.rider && record.data.rider._id) {
      const body = {
        riderId: record.data.rider._id,
        taskId: payload.taskId,
      };
      await taskAssignmentService.createOrUpdate(
        body,
        TASK_ASSIGNMENT_STATUS.removed
      );
    }
    let assignRequest = await taskAssignmentService.createOrUpdate(payload,TASK_ASSIGNMENT_STATUS.accepted);
    let taskStatuses = record.data.status;
    taskStatuses.map((v, i) => {
      taskStatuses[i].active = false;
    });
    const status = await taskStatusService.findBySlug(
      APP_CONSTANT.TASK_ASSIGNED_STATUS_SLUG
    );
    taskStatuses.push({
      status_logs: status.data._id,
      active: true,
      createdAt: moment(),
    });
    payload.status = taskStatuses;
    let task = await taskService.assignRiderToTask(payload);
    let response = await taskService.findById(payload.taskId);
    response.data = await TaskDto(response.data);
    response.message = `Task assigned to rider successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId, status, taskStatus } = req.body;
    let reason = req.body?.reason;
    const taskExist = await taskService.findById(taskId);
    let taskStatuses = taskExist.data.status;
    taskStatuses.map((v, i) => {
      taskStatuses[i].active = false;
    });
    taskStatuses.push({
      status_logs: status,
      active: true,
      createdAt: moment(),
      reason: reason,
    });
    const updatedTask = await taskService.updateTaskStatus({
      taskId,
      status: taskStatuses,
    });
    const response = await taskService.findById(taskId);
    await statusChange(taskStatus,response.data);
    response.data = await TaskDto(response.data);
    response.message = `Task status has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const update = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const validated = req.body;
    const task = await taskService.update(taskId, validated);
    const response = await taskService.findById(taskId);
    response.data = await TaskDto(response.data);
    response.message = `Task status has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const response = await taskService.findByOrderId(orderId);
    let taskList = response.data.map(TaskDto);
    response.data = await Promise.all(taskList)
    response.message = `Task retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const socketTest = async (req, res, next) => {
  try {
    let { riderId, type } = req.params;
    const task = await taskService.socketTest(type);
    if(!task.data) {
      throw new Error('No task found!');
    }
    if(task.data.status.length < 1) {
      throw new Error('No task with status exist!');
    }
    task.data.status = task.data.status.filter((v,i) => {
      return v.active == true;
    })
    const response = {
      task_id: task.data,
      rider_id : {
        _id : riderId 
      }
    };
    const socketResponse = await emit(
      "TASK_REQUEST",
      TaskAssignSocketDto(response)
    );
    response.data = TaskAssignSocketDto(response);
    response.message = `Task retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const removeRider = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    let validated = req.body.task;
    validated.rider = null;
    const task = await taskService.update(taskId, validated);
    const payload = {
      riderId: req.body.task?.rider?._id,
      taskId,
    };
    await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.removed);
    const response = await taskService.findById(taskId);
    response.data = await TaskDto(response.data);
    response.message = `Rider removed successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};


const TaskController = {
  create,
  findAll,
  find,
  riderTasks,
  assignTaskRiderRequest,
  assignTaskToRider,
  updateTaskStatus,
  update,
  findByOrderId,
  socketTest,
  removeRider
};

export default TaskController;

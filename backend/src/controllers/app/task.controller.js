import taskStatusService from "../../services/app/task.status.service.js";
import taskService from "../../services/app/task.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import { config } from "dotenv";
import PaymentMethodService from "../../services/app/payment.method.service.js";
import TaskDto from "../../dto/task.dto.js";
import taskModel from "../../database/models/task.model.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import moment from "moment";
import taskAssignmentService from "../../services/app/task.assign.service.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/rider.assignment.status.slug.js";
import { statusChange } from "../../utils/task.status.helper.js";
import { STATUS_SLUG } from "../../utils/mobile.status.slugs.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
config();

const create = async (req, res, next) => {
  try {
    const validated = req.body;
    const requests = [];
    const status = await taskStatusService.findBySlug(process.env.TASK_DEFAULT_STATUS);
    validated.status = { status_logs: status.data._id, active: true, createdAt: moment() };
    const payment_type = await PaymentMethodService.findBySlug(req.body.order_details.payment_type);
    validated.order_details.payment_type = payment_type.data._id;
    validated.delivery.datetime = moment(validated.delivery.datetime);
    validated.pickup.datetime = moment(validated.pickup.datetime);
    if (validated.has_delivery) {
      validated.type = "delivery";
      requests.push(taskService.create(validated));
    }
    if (validated.has_pickup) {
      validated.type = "pickup";
      requests.push(taskService.create(validated));
    }
    const tasks = await Promise.all(requests);
    const response = await taskService.findByOrderId(validated.order_id);
    let taskList = response.data.map(TaskDto);
    response.data = await Promise.all(taskList)
    response.message = `Task has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    let response = await batchService.findAll();
    response.message = `Task has been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { order_id, type, status } = req.body;
    const statusIsValid = await taskStatusService.findBySlug(status);
    if (!statusIsValid) {
      const error = new Error("Invalid status slug");
      error.statusCode = STATUS_CODE.not_found;
      throw error;
    }
    const taskExist = await taskModel.findOne({ order_id, type });
    if (!taskExist) {
      const error = new Error("Task was not found");
      error.statusCode = STATUS_CODE.not_found;
      throw error;
    }
    let newTaskArray = taskExist.status;
    newTaskArray.map((v, i) => {
      newTaskArray[i].active = false;
    });
    newTaskArray.push({ 
      status_logs: statusIsValid.data._id, 
      active: true,
      createdAt: moment(), 
      // overdue_minutes: req.body?.overdue_minutes ? overdue_minutes : 0
    });
    const response = await taskService.updateTaskStatus({ order_id, type, tasks: newTaskArray });
    await statusChange(statusIsValid.data.slug,taskExist);
    response.message = `Task status has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findOne = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    let response = await taskService.findById(taskId);
    response.data = await TaskDto(response.data);
    response.message = `Task retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findTasksByOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    let response = await taskService.findByOrderId(orderId);
    if(response.data.length !== 2) {
      throw new Error(`Invalid Order id!`);
    }
    response.data[0] = await TaskDto(response.data[0]);
    response.data[1] = await TaskDto(response.data[1]);
    response.data = {
      pickup: response.data[0].type == APP_CONSTANT.TASK_TYPES.pickup ? response.data[0] : response.data[1],
      delivery: response.data[0].type == APP_CONSTANT.TASK_TYPES.delivery ? response.data[0] : response.data[1],
    } 
  
    response.message = `Tasks retrieved successfully`;
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
    response.data = await Promise.all(taskList)
    response.message = `Task retrieved successfully`;
    if (!response.data) {
      response.message = `No Task Found`;
    }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const acceptTask = async (req, res, next) => {
  try {
    const taskId = req.body.taskId;
    const riderId = req.body.riderId;
    let response = await taskService.assignRiderToTask(taskId, riderId);
    const payload = {
      riderId,
      taskId,
    };
    if(!response.data) {
      throw new Error("No task found!");
    } else {
      let taskAssignRequest = await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.accepted);
      response.data = await TaskDto(response.data);
      response.message = `Rider assigned successfully`;
    }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const rejectTask = async (req, res, next) => {
  try {
    const riderId = req.body.riderId;
    const taskId = req.body.taskId;
    let response = await taskService.findById(taskId);
    if (!response.data) {
      throw new Error("No task found!");
    } else {
      const payload = {
        riderId,
        taskId,
      };
      let taskAssignRequest = await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.declined);
      response.data = await TaskDto(response.data);
      response.message = `Task rejected successfully`;
    }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const arrivedTask = async (req, res, next) => {
  try {
    const riderId = req.body.riderId;
    const taskId = req.body.taskId;
    // const overdue_minutes = req.body?.overdue_minutes;
    let response = await taskService.findById(taskId);
    if (!response.data) {
      throw new Error("No task found!");
    } else {
      const payload = {
        riderId,
        taskId,
      };
      // let taskArriveRequest = await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.arrived, overdue_minutes);
      let taskArriveRequest = await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.arrived);
      response.data = await TaskDto(response.data);
      response.message = `Task arrived successfully`;
    }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const orderPickupTask = async (req, res, next) => {
  try {
    const riderId = req.body.riderId;
    const taskId = req.body.taskId;
    // const overdue_minutes = req.body?.overdue_minutes;
    const tasks = await taskService.findByOrderId(req.body.orderId);
    if(tasks.data.length != 2) {
      throw new Error("Tasks not found!");
    }
    const updatePickupStatus = async () => {
      let pickupTask = {};
      tasks.data.map((v, i) => {
        if(v.type == APP_CONSTANT.TASK_TYPES.pickup) {
          pickupTask = v
        }
      }) 
      return taskService.updateTaskStatusBySlug(pickupTask._id, type)
    }
    const updateDeliveryStatus = async () => {
      let deliveryTask = {};
      tasks.data.map((v, i) => {
        if(v.type == APP_CONSTANT.TASK_TYPES.delivery) {
          deliveryTask = v
        }
      }) 
      return taskService.updateTaskStatusBySlug(deliveryTask._id, type)
    }
    await Promise.all([updatePickupStatus, updateDeliveryStatus])
    // const riderId = req.body.riderId;
    // const taskId = req.body.taskId;
    // const overdue_minutes = req.body?.overdue_minutes;
    // let response = await taskService.findById(taskId);
    // if (!response.data) {
    //   throw new Error("No task found!");
    // } else {
    //   if(response.data.type !== 'pickup') {
    //     throw new Error("No task found!");
    //   }
    //   const payload = {
    //     riderId,
    //     taskId,
    //   };
    //   let taskArriveRequest = await taskAssignmentService.createOrUpdate(payload, TASK_ASSIGNMENT_STATUS.arrived, overdue_minutes);
    //   response.data = await TaskDto(response.data);
    //   response.message = `Task arrived successfully`;
    // }
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
}

const TaskController = {
  create,
  findAll,
  updateTaskStatus,
  findOne,
  riderTasks,
  acceptTask,
  rejectTask,
  arrivedTask,
  orderPickupTask,
  findTasksByOrderId
};

export default TaskController;

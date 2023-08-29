import taskIssueService from "../../services/app/task.issue.service.js";
import taskService from "../../services/app/task.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import taskIssueDto from "../../dto/task.issue.dto.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";

const create = async (req, res, next) => {
  try {
    const validated = req.body;
    validated.task_id = validated.task._id
    const taskIssue = await taskIssueService.create(validated)
    const response = await taskIssueService.findOne(taskIssue.data._id);
    let taskIssues = taskIssueDto(response.data);
    response.data = await Promise.all(taskIssues);
    response.message = `Task issue created succesfully`
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findById = async (req,res,next) => {
  try {
    const { issueId } = req.params;
    let response = await taskIssueService.findOne(issueId);
    if(!response.data) {
      throw new Error(`Invalid Issue Id`)
    }
    response.data = await taskIssueDto(response?.data);
    response.message = `Task issue retrieved successfully`;
    createResponse(res, response);
  }
  catch(e) {
    createError(res, e, next);
  }
}

const findByOrderId = async (req,res,next) => {
  try {
    const { orderId } = req.params;
    const tasks = await taskService.findByOrderId(orderId);
    if(!tasks.data) {
      throw new Error(`Invalid Order Id`)
    }
    let taskIds = [];
    tasks.data.map((v,i) => {
      if(v.type == APP_CONSTANT.TASK_TYPES.delivery)
        taskIds.push(v._id);
    })
    const response = await taskIssueService.findByTaskId(taskIds);
    response.data = await taskIssueDto(response?.data);
    response.message = `Task issue retrieved successfully`;
    createResponse(res, response);
  }
  catch(e) {
    createError(res, e, next);
  }
 
}
const TaskIssueController = {
  create,
  findByOrderId,
  findById
};

export default TaskIssueController;

import taskIssueService from "../../services/web/task.issue.service.js";
import taskService from "../../services/web/task.service.js";
import { createError, createResponse, getCurrentDateTime } from "../../utils/helper.js";
import taskIssueDto from "../../dto/task.issue.dto.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import rmsService from "../../services/external/rms.service.js";
import { WALLET_COLLECTION_TYPES } from "../../utils/wallet.collection.type.js";

const findAll = async (req,res,next) => {
  try {
    let response = await taskIssueService.find(req);
    let taskIssues = response.data.map(taskIssueDto);
    response.data = await Promise.all(taskIssues);
    response.message = `Task issue retrieved successfully`;
    createResponse(res, response);
  }
  catch(e) {
    createError(res, e, next);
  }
}

const create = async (req, res, next) => {
  try {
    const validated = req.body;
    validated.task_id = validated.task._id
    const taskIssue = await taskIssueService.create(validated)
    const response = await taskIssueService.findOne(taskIssue.data._id);
    response.data = await taskIssueDto(response.data);
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

const updateIssueStatus = async (req,res,next) => {
  try {
    const { issueId, status } = req.params;
    const body = {
      is_approved: status == "approve" ? true : false,
      updatedBy: req.user.email,
      updatedTime: getCurrentDateTime(),
    };
    let taskIssue = await taskIssueService.updateIssueStatus(issueId,body);
    let response = await taskIssueService.findOne(issueId);
    if(status == "approve") {
      const payload = {
        order_id: response.data.task_id.order_id,
        rider_display_id: response.data.task_id?.rider?.display_id,
        store_id: response.data.task_id?.store_id,
        rider_id: response.data.task_id?.rider?._id.toString(),
        originator: 'rocky backend',
        collection_type: WALLET_COLLECTION_TYPES.cashin,
        amount: response.data.amount,
        rider_wallet_id:0,
        note:'created by rocky backend on approval of issue'
      };
      let walletTransaction = await rmsService.createWalletTransaction(payload);
    }
    response.data = await taskIssueDto(response?.data);
    response.message = `Task issue approved successfully`;
    createResponse(res, response);
  }
  catch(e) {
    createError(res, e, next);
  }
}

const TaskIssueController = {
  create,
  findByOrderId,
  findById,
  findAll,
  updateIssueStatus
};

export default TaskIssueController;

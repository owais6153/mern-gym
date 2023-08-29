import taskIssueModel from "../../database/models/task.issues.model.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import { getPaginationInfo } from "../../utils/pagination.js";

const find = async (req) => {
  let { limit, page } = req.query;
  let populate = [],query = {},resp,totalItems;
  if (req.query.startDate && req.query.endDate) {
    let { startDate, endDate } = req.query;
    query = { ...query, createdAt: { $gte: startDate, $lte: endDate } };
  }
  limit = parseInt(limit) || APP_CONSTANT.DEFAULT_PAGINATION_LIMIT;
  page = parseInt(page) || APP_CONSTANT.DEFAULT_PAGE;
  if (req.query.rider) {
    const { rider } = req.query;
    populate.push({
      path: "task_id",
      populate: {
        path: "rider",
        model: "rider",
        match: { fullName: new RegExp(rider, "i") },
      },
    });
  }else {
    populate.push({
      path: "task_id",
      populate: {
        path: "rider",
      },
    });
  }
  totalItems = await taskIssueModel.find(query).populate(populate).countDocuments();
  resp = await taskIssueModel
    .find(query)
    .populate(populate)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ _id: -1 });
  if (req.query.rider) {
    resp = resp.filter((v, i) => {
      return v.task_id.rider ? v : false;
    });
    let riders = await taskIssueModel.find(query).populate(populate);
    riders = riders.filter((v, i) => {
      return v.task_id.rider ? v : false;
    });
    totalItems = riders.length;
  }
  const pagination = getPaginationInfo(page, limit, totalItems);
  return { data: resp, pagination: pagination };
};

const findOne = async (issueId) => {
  const resp = await taskIssueModel.findById(issueId).populate({path:"task_id", populate: { path: "rider" } });
  return { data: resp };
};

const findByTaskId = async (taskId) => {
  const resp = await taskIssueModel.findOne({task_id: taskId}).populate({path:"task_id", populate: { path: "rider" } });
  return { data: resp };
};

const create = async (data) => {
  const resp = await taskIssueModel.create(data);
  return { data: resp };
};

const findByTaskIds = async (taskIds) => {
  const resp = await taskIssueModel.find( {task_id:  { "$in": taskIds } }).populate({path:"task_id", populate: { path: "rider" } });
  return { data: resp };
};

const updateIssueStatus = async (issueId,data) => {
  const resp = await taskIssueModel.findOneAndUpdate({ _id : issueId }, { ...data });
  return { data: resp };
};

const TaskIssueService = {
  findOne,
  findByTaskId,
  create,
  findByTaskIds,
  find,
  updateIssueStatus
};
export default TaskIssueService;

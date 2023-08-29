import taskIssueModel from "../../database/models/task.issues.model.js";

const findOne = async (issueId) => {
  const resp = await taskIssueModel.findById(issueId).populate("task_id");
  return { data: resp };
};

const findByTaskId = async (taskId) => {
  const resp = await taskIssueModel.findOne({task_id: taskId}).populate("task_id");
  return { data: resp };
};

const create = async (data) => {
  const resp = await taskIssueModel.create(data);
  return { data: resp };
};

const findByTaskIds = async (taskIds) => {
  const resp = await taskIssueModel.find( {task_id:  { "$in": taskIds } }).populate("task_id");
  return { data: resp };
};


const TaskIssueService = {
  findOne,
  findByTaskId,
  create,
  findByTaskIds
};
export default TaskIssueService;

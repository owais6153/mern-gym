import taskAssignmentModel from "../../database/models/task.assignment.model.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/task.assignment.status.slug.js";

const create = async (req) => {
  const payload = {
    rider_id: req.body.riderId,
    task_id: req.body.taskId,
    status: { log: { title: TASK_ASSIGNMENT_STATUS.unassigned.title, slug: TASK_ASSIGNMENT_STATUS.unassigned.slug } },
  };
  const resp = await taskAssignmentModel.create(payload);
  return { data: resp };
};

const createOrUpdate = async (req, status = null) => {
  status = status || TASK_ASSIGNMENT_STATUS.unassigned;
  const reason = req.reason ? req.reason : null;
  let requestStatus = [];
  const record = await findByRiderTaskId(req.riderId, req.taskId);
  if (record.data) {
    requestStatus = record.data.status;
    requestStatus.map(function (value) {
      value.active = false;
    });
  }
  requestStatus.push({ log: { title: status.title, slug: status.slug }, active: true });
  const payload = {
    updateOne: {
      filter: { rider_id: req.riderId, task_id: req.taskId },
      update: { $set: { rider_id: req.riderId, task_id: req.taskId, status: requestStatus, reason: reason } },
      upsert: true,
    },
  };
  const resp = await taskAssignmentModel.bulkWrite([payload]);
  const updatedTask = await findByRiderTaskId(req.riderId, req.taskId);
  return { data: updatedTask.data };
};

const findById = async (req) => {
  const resp = await taskAssignmentModel.findById(req).populate("rider_id").populate({
    path:"task_id",
    populate: {
      path:"status",
      populate : {
        path:"status_logs"
      }
    }
  }).exec();
  return { data: resp };
};

const findByRiderTaskId = async (riderId, taskId) => {
  const response = await taskAssignmentModel.findOne({ rider_id: riderId, task_id: taskId }).populate("rider_id task_id");
  return { data: response };
};

const findRiderAssignmentActiveRequests = async (riderId) => {
  const response = await taskAssignmentModel
    .find({ rider_id: riderId, "status.log.slug": { $ne: TASK_ASSIGNMENT_STATUS.declined.slug } })
    .populate("rider_id task_id");
  return { data: response };
};

const TaskAssignmentService = {
  create,
  findById,
  findByRiderTaskId,
  findRiderAssignmentActiveRequests,
  createOrUpdate,
};
export default TaskAssignmentService;

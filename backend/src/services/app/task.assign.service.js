import taskAssignmentModel from "../../database/models/task.assignment.model.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/task.assignment.status.slug.js";

const create = async (req) => {
  const payload = {
    rider_id : req.body.riderId,
    task_id : req.body.taskId,
    status : { log: { title: TASK_ASSIGNMENT_STATUS.unassigned.title, slug: TASK_ASSIGNMENT_STATUS.unassigned.slug } }
  }
  const resp = await taskAssignmentModel.create(payload);
  return { data: resp};
};

const createOrUpdate = async (req, status = null, overdue_minutes) => {
  status = status || TASK_ASSIGNMENT_STATUS.unassigned
  let requestStatus = [];
  const record = await findByRiderTaskId(req.riderId,req.taskId);
  if(record.data) {
    requestStatus = record.data.status
    requestStatus.map(function(value){
      value.active = false;
    });
  }
  // if (overdue_minutes) {
  //   requestStatus.push({ log: { title: status.title, slug: status.slug }, active: true, overdue_minutes });
  // } else {
  //   requestStatus.push({ log: { title: status.title, slug: status.slug }, active: true, overdue_minutes: 0 });
  // }
  const payload = {
    updateOne: {
      filter : { rider_id: req.riderId, task_id: req.taskId},
      update: { $set: { rider_id: req.riderId, task_id: req.taskId,  status: requestStatus}},
      upsert: true
    }
  }
  const resp = await taskAssignmentModel.bulkWrite([payload]);
  return { data: resp.result.upserted};
};

const findById = async (req) => {
  const resp = await taskAssignmentModel.findById(req).populate("rider_id task_id task_id.zone").exec();
  return { data: resp };
};

const findByRiderTaskId = async (riderId,taskId) => {
  const response = await taskAssignmentModel.findOne({ rider_id : riderId, task_id: taskId }).populate('rider_id task_id');
  return { data: response };
}

const findRiderAssignmentActiveRequests = async (riderId) => {
  const response = await taskAssignmentModel.find({ rider_id : riderId,  "status.log.slug": { "$ne": TASK_ASSIGNMENT_STATUS.declined.slug }}).populate('rider_id task_id');
  return { data: response };
}

const TaskAssignmentService = {
  create,
  findById,
  findByRiderTaskId,
  findRiderAssignmentActiveRequests,
  createOrUpdate
};
export default TaskAssignmentService;

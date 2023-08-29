import taskModel from "../../database/models/task.model.js";

const create = async (req) => {
  const resp = await taskModel.create(req);
  return resp;
};

const findAll = async () => {
  const resp = await taskModel.find({ type: "delivery" }).populate("rider status.status_logs order_details.payment_type");
  return { data: resp };
};

const findByOrderId = async (req) => {
  const resp = await taskModel.find({ order_id: req }).populate("rider status.status_logs order_details.payment_type");
  return { data: resp };
};

const updateTaskStatus = async (req) => {
  const updatedTask = await taskModel.findOneAndUpdate({ _id: req.taskId }, { status: [...req.status] });
  return { data: updatedTask };
};

const findByRiderId = async (riderId) => {
  const response = await taskModel.find({ rider: riderId }).populate("rider status.status_logs order_details.payment_type");
  return { data: response };
};

const assignTaskRider = async (req) => {
  let bulkQueries = [];
  const tasks = req.body.tasks;
  tasks.body.forEach(async (item) => {
    data.filter(function (val) {
      if (val.batchLevel == item.batchLevel) batch = val._id;
    });
    bulkQueries.push({
      updateOne: {
        filter: { _id: mongoose.Types.ObjectId(id) },
        update: { $set: { ...updatedItem } },
        upsert: true,
      },
    });
  });
  const riderId = req.params.riderId;
  const response = await taskModel.find({ rider: riderId }).populate("rider status.status_logs order_details.payment_type").exec();
  return { data: response };
};

const findById = async (req) => {
  const response = await taskModel.findById(req).populate("rider status.status_logs order_details.payment_type");
  return { data: response };
};

const assignRiderToTask = async (req) => {
  const response = await taskModel.findOneAndUpdate({ _id: req.taskId }, { rider: req.riderId, status: req.status });
  return { data: response };
};

const update = async (taskId, data) => {
  const resp = await taskModel.findOneAndUpdate({ _id: taskId }, data);
  return resp;
};

const socketTest = async (type) => {
  const resp = await taskModel.findOne({ status: { $nin: [null] }, type: type }).populate("rider status.status_logs order_details.payment_type");
  return { data: resp };
};

const TaskService = {
  create,
  findAll,
  findByOrderId,
  updateTaskStatus,
  findById,
  findByRiderId,
  assignTaskRider,
  assignRiderToTask,
  update,
  socketTest
};
export default TaskService;

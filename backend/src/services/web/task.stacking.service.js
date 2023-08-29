import taskStackingModel from "../../database/models/task.stacking.model.js";

const create = async (req) => {
  const response = await taskStackingModel.create(req);
  return response;
};

const findById = async (id) => {
  const response = await taskStackingModel.findById(id);
  if (!response) {
    throw new Error("Failed to create stack!");
  }
  return response;
};

const findRiderOngoingStack = async (riderId) => {
  const response = await taskStackingModel.findOne({ riderId, status: "ongoing" }).populate("deliveryTasks.taskId").exec();
  if (!response) {
    throw new Error("No ongoing rider task found!");
  }
  return response;
};

const TaskStackingService = {
  create,
  findById,
  findRiderOngoingStack,
};
export default TaskStackingService;

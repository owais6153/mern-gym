import taskStatusModel from "../../database/models/task.status.model.js";

const findAll = async () => {
  const resp = await taskStatusModel.find();
  return { data: resp };
};

const findBySlug = async (req) => {
  const resp = await taskStatusModel.findOne({ slug: req });
  return { data: resp };
};

const findById = async (req) => {
  const resp = await taskStatusModel.findById(req);
  return { data: resp };
};

const TaskStatusService = {
  findAll,
  findBySlug,
  findById,
};
export default TaskStatusService;

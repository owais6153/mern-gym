import taskStatusModel from "../../database/models/task.status.model.js";

const findAll = async () => {
  const resp = await taskStatusModel.find();
  return { data: resp };
};

const findBySlug = async (req) => {
  const resp = await taskStatusModel.findOne({ slug: req });
  if (!resp) {
    throw new Error("Invalid status slug!");
  }
  return { data: resp };
};

const taskStatusService = {
  findAll,
  findBySlug,
};
export default taskStatusService;

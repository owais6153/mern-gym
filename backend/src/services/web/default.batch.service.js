import DefaultbatchModel from "../../database/models/default.batch.model.js";

const create = async (req) => {
  const defaultBatches = await DefaultbatchModel.insertMany(req);
  return { data: defaultBatches };
};

const findAll = async (req) => {
  const defaultBatches = await DefaultbatchModel.find().populate("batch").exec();
  return { data: defaultBatches };
};

const findManyByBatchIds = async (batchIds) => {
  const defaultBatches = await DefaultbatchModel.find({
    batch: { $in: batchIds },
  }).populate("batch").exec();
  return { data: defaultBatches };
};

const update = async (req) => {
  const updatedDefaultBatches = await DefaultbatchModel.bulkWrite(req);
  return { data: updatedDefaultBatches };
};

const DefaultBatchService = {
  create,
  findAll,
  update,
  findManyByBatchIds
};
export default DefaultBatchService;

import batchModel from "../../database/models/batch.model.js";

const create = async (req) => {
  const batchExist = await batchModel.findOne({ batchLevel: req.body.batchLevel });
  if (batchExist) {
    const error = new Error(`Batch level already exist`);
    error.statusCode = 400;
    throw error;
  }
  const resp = await batchModel.create(req.body);
  return { data: resp };
};

const update = async (req) => {
  const batchExist = await batchModel.findById(req.body.id);
  if (!batchExist) {
    const error = new Error(`Invalid batch ID`);
    error.statusCode = 400;
    throw error;
  }
  const resp = await batchModel.findByIdAndUpdate(req.body.id, { batchLevel: req.body.batchLevel });
  return { data: resp };
};

const findAll = async () => {
  const resp = await batchModel.find();
  return { data: resp };
};

const findByLevel = async (req) => {
  const batch = await batchModel.findOne({ batchLevel: req });
  return { data: batch };
};

const findById = async (batchId) => {
  const batch = await batchModel.findById(batchId);
  if (!batch) {
    const error = new Error(`Batch Not Found!`);
    error.statusCode = 400;
    throw error;
  }
  return { data: batch };
};

const findByIds = async (batchIds) => {
  const batches = await batchModel.find({
    _id: { $in: batchIds },
  });
  return { data: batches };
};

const BatchService = {
  create,
  findAll,
  findByLevel,
  findById,
  update,
  findByIds,
};
export default BatchService;

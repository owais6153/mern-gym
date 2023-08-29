import zoneModel from "../../database/models/zone.model.js";
import mongoose from "mongoose";

const create = async (req) => {
  const resp = await zoneModel.create(req.body);
  return { data: resp };
};

const update = async (req) => {
  const resp = await zoneModel.findByIdAndUpdate(req.body.zoneId, { ...req.body });
  return { data: resp };
};

const findAll = async () => {
  const resp = await zoneModel.find();
  return { data: resp };
};

const findManyByIds = async (zoneIds) => {
  zoneIds.map((v,i)=>{
    zoneIds[i] = mongoose.Types.ObjectId(v)
  })
  const resp = await zoneModel.find({_id: {$in: [...zoneIds]}});
  return { data: resp };
};

const findByName = async (zoneName) => {
  const resp = await zoneModel.findOne({ zoneName });
  return { data: resp };
};

const findById = async (zoneId) => {
  const resp = await zoneModel.findById(zoneId);
  if (!resp) {
    const error = new Error(`Zone doesn't exist`);
    error.statusCode = 400;
    throw error;
  }
  return { data: resp };
};

const ZoneService = {
  create,
  update,
  findAll,
  findById,
  findByName,
  findManyByIds
};
export default ZoneService;

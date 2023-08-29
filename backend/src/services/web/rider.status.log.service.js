import riderStatusLogModel from "../../database/models/rider.status.logs.js";

const create = async (req) => {
  await setRecentStatus(req.rider_id,false);
  const record = riderStatusLogModel.create(req);
  return { data : record };
};

const findByRiderId = async (riderId) => {
  const record = await riderStatusLogModel.find({riderId});
  return { data: record };
};

const setRecentStatus = async (riderId,current) => {
  let payload = [];
  const records = await riderStatusLogModel.find({rider_id: riderId,current:true});
  records.map(function(value) {
    payload.push({
      updateOne: {
        filter: { _id: value._id },
        update: { $set: { current: current } },
        upsert: false,
      },
    })
  });
  const response = await bulkUpdateOrCreate(payload);
  return { data: records };
};

const bulkUpdateOrCreate = async (req) => {
  const records = await riderStatusLogModel.bulkWrite(req);
  return { data: records }
}

const RiderStatusLogService = {
  create,
  findByRiderId
};
export default RiderStatusLogService;

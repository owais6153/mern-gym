import riderModel from "../../database/models/rider.model.js";
import batchModel from "../../database/models/batch.model.js";
import Tookan from "../../dto/tookan.dto.js";
import counterModel from "../../database/models/counter.model.js";
import counterService from "./counter.service.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import RiderDto from "../../dto/rider.dto.js";
import batchService from "./batch.service.js";
import { STATUS_SLUG } from "../../utils/mobile.status.slugs.js";
import RIDER_STATUSES from "../../utils/rider.status.js";
import riderStatusLogService from "./rider.status.log.service.js";
import storeService from "./store.service.js";
import mongoose from "mongoose";
import BatchService from "./batch.service.js";
import { getPaginationInfo } from "../../utils/pagination.js";

const findAll = async (req) => {
  let { limit, page } = req.query;
  limit = parseInt(limit) || APP_CONSTANT.DEFAULT_PAGINATION_LIMIT;
  page = parseInt(page) || APP_CONSTANT.DEFAULT_PAGE;
  let populate = [{ path: "batch" }, { path: "zone" }],
    execQuery = null,
    query = {},
    resp,
    totalItems;
  if (req.query.keyword) {
    const { keyword } = req.query;
    query = { ...query, $text: { $search: keyword } };
  }
  if (req.query.id) {
    const { id } = req.query;
    query = { ...query, display_id: id };
  }
  if (req.query.status) {
    const { status } = req.query;
    query = { ...query, status: status };
  }
  if (req.query.fleet_id) {
    const { fleet_id } = req.query;
    query = { ...query, fleet_id: fleet_id };
  }
  if (req.query.fullName) {
    const { fullName } = req.query;
    query = { ...query, fullName: new RegExp(fullName, "i") };
  }

  if (req.query.phoneNumber) {
    const { phoneNumber } = req.query;
    query = { ...query, phoneNumber: new RegExp(phoneNumber, "i") };
  }
  totalItems = await riderModel.find(query).populate(populate).countDocuments();
  resp = await riderModel
    .find(query)
    .populate(populate)
    .skip((page - 1) * limit)
    .limit(limit);
  const pagination = getPaginationInfo(page, limit, totalItems);
  return { data: resp, pagination: pagination };
};

const findOne = async (riderId) => {
  const resp = await riderModel.findById(riderId).populate("batch zone").exec();
  if (!resp) {
    const error = new Error(`Invalid rider Id`);
    error.statusCode = STATUS_CODE.not_found;
    throw error;
  }
  return { data: resp };
};

const assignBatchToRider = async (req) => {
  const batchExist = await batchModel.findById(req.body.batchId);
  if (!batchExist) {
    const error = new Error(`Invalid batch ID`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  const riderExist = await riderModel.findById(req.body.riderId);
  if (!riderExist) {
    const error = new Error(`Invalid rider ID`);
    error.statusCode = 400;
    throw error;
  }

  const resp = await riderModel.findByIdAndUpdate(req.body.riderId, {
    batch: req.body.batchId,
  });
  return { data: resp };
};

const assignZonesToRider = async (req) => {
  const resp = await riderModel.findByIdAndUpdate(req.body.riderId, {
    zone: [...req.body.zoneIds],
  });
  if (!resp) {
    const error = new Error(`Failed to assign zones to rider!`);
    error.statusCode = STATUS_CODE.internal_server_error;
    throw error;
  }
  return { data: resp };
};

const approveRider = async (req) => {
  const resp = await riderModel.findByIdAndUpdate(req.body.riderId, {
    is_approved: true,
    status: RIDER_STATUSES.ALL_STATUS.available,
  });
  return { data: resp };
};

const blockRider = async (req) => {
  const rider = await riderModel.findById(req.body.riderId);
  if (rider.status === "blocked") {
    const error = new Error(`Rider is already blocked!`);
    error.statusCode = STATUS_CODE.not_acceptable;
    throw error;
  }
  const resp = await riderModel.findByIdAndUpdate(req.body.riderId, {
    status: RIDER_STATUSES.ALL_STATUS.blocked,
  });
  const payload = {
    rider_id: req.body.riderId,
    reason: null,
    message: null,
    start_date: null,
    end_date: null,
    status: RIDER_STATUSES.ALL_STATUS.blocked,
    current: true,
  };
  const record = riderStatusLogService.create(payload);
  return { data: resp };
};

const markRiderOnBreak = async (req) => {
  const resp = await riderModel.findByIdAndUpdate(req.riderId, {
    status: req.type,
  });
  const payload = {
    rider_id: req.riderId,
    reason: req.reason,
    message: req.message || null,
    start_date: req.start_date,
    end_date: req.end_date,
    status: req.type,
    current: true,
  };
  const record = riderStatusLogService.create(payload);
  return { data: resp };
};

const markRiderBackFromBreak = async (req) => {
  const resp = await riderModel.findByIdAndUpdate(req.riderId, {
    status: RIDER_STATUSES.ALL_STATUS.available,
  });
  const payload = {
    rider_id: req.riderId,
    reason: null,
    message: null,
    start_date: null,
    end_date: null,
    status: RIDER_STATUSES.ALL_STATUS.available,
    current: true,
  };
  const record = await riderStatusLogService.create(payload);
  return { data: resp };
};

const importRider = async (req) => {
  let body = req.map(Tookan.formulateTookanData);
  const pendingStatus = RIDER_STATUSES.ALL_STATUS.pending;
  const updateQueries = [];
  body.forEach(async (item) => {
    updateQueries.push({
      updateOne: {
        filter: { phoneNumber: item.phoneNumber },
        update: { $set: { ...item } },
        upsert: true,
        new: true,
      },
    });
  });
  const resp = await riderModel.bulkWrite(updateQueries);
  await bulkUpdateSequence();
  await riderModel.updateMany({ status: null }, { status: pendingStatus });
  return { data: resp.result.upserted };
};

const importFleetRider = async (formulatedResponseData) => {
  let defaultBatch = await BatchService.findByLevel(
    APP_CONSTANT.RIDER_DEFAULT_BATCH_LEVEL
  );
  let body = formulatedResponseData.map(Tookan.formulateTookanFleetData);
  const availableStatus = RIDER_STATUSES.ALL_STATUS.available;
  const updateQueries = [];
  body.forEach(async (item) => {
    updateQueries.push({
      updateOne: {
        filter: { phoneNumber: item.phoneNumber },
        update: { $set: { ...item } },
        upsert: true,
        new: true,
      },
    });
  });
  const resp = await riderModel.bulkWrite(updateQueries);
  await bulkUpdateSequence();
  await bulkUpdateRiderZones();
  await riderModel.updateMany(
    // { t_riderId: {$ne: null} },
    // { zone: null, t_riderId: {$ne: null} },
    { status: "pending", t_riderId: { $ne: null } },
    { status: availableStatus, is_approved: true, batch: defaultBatch.data._id }
  );
  return { data: resp.result.upserted };
};

const findByRiderIds = async (req) => {
  const resp = await riderModel.find({ display_id: { $in: req } });
  return { data: resp };
};

const bulkUpdateBatch = async (req) => {
  const resp = await riderModel.bulkWrite(req);
  return { data: resp.result.ok };
};

const bulkUpdateRiderZones = async () => {
  const updateQueries = [];
  const stores = await storeService.findAll();
  let unAssignedRiders = await riderModel.find({
    zone: null,
    team_id: { $ne: null },
  });
  unAssignedRiders.map((rider, idx) => {
    stores.data.map((store, i) => {
      if (rider.team_id == store.team?.team_id) {
        let zoneIds = [mongoose.Types.ObjectId(store.zone.id)];
        updateQueries.push({
          updateOne: {
            filter: { _id: rider._id },
            update: { $set: { zone: zoneIds } },
            upsert: false,
          },
        });
      }
    });
  });
  // console.log('updateQueries => ', updateQueries.length);
  const resp = await riderModel.bulkWrite(updateQueries);
  return { data: resp.result.upserted };
};

const findByZoneId = async (req) => {
  const resp = await riderModel
    .find({ zone: mongoose.Types.ObjectId(req) })
    .populate("zone");
  return { data: resp };
};

const bulkUpdateSequence = async (req) => {
  const updateQueries = [];
  const riderCounter = await counterModel.findOne({
    identity: "rider-counter",
  });
  let seqCounter = Number(riderCounter.seq);
  let uniAssignedRiders = await riderModel.find({ display_id: null });

  uniAssignedRiders.map((rider, idx) => {
    seqCounter += 1;
    updateQueries.push({
      updateOne: {
        filter: { _id: rider._id },
        update: { $set: { display_id: seqCounter } },
        upsert: false,
      },
    });
  });
  const resp = await riderModel.bulkWrite(updateQueries);
  await counterService.bulkIncrement("rider-counter", seqCounter);
  return { data: resp.result.ok };
};

const findById = async (riderId) => {
  const resp = await riderModel.findById(riderId).populate("zone batch");
  return { data: resp };
};

const create = async (req) => {
  const files = req.files;
  const body = req.body;
  const defaultBatch = await batchService.findByLevel(
    APP_CONSTANT.RIDER_DEFAULT_BATCH_LEVEL
  );
  if (body.profileImage) req.body.profileImage = files.profileImage[0].location;
  body.cnicFront = files.cnicFront[0].location;
  body.cnicBack = files.cnicBack[0].location;
  body.licenseFront = files.licenseFront[0].location;
  body.licenseBack = files.licenseBack[0].location;
  body.bill = files.bill[0].location;
  body.batch = defaultBatch.data._id;
  const pendingStatus = APP_CONSTANT.DEFAULT_RIDER_STATUS;
  const riderCounter = await counterModel.findOne({
    identity: "rider-counter",
  });
  const response = await riderModel.create({
    ...body,
    display_id: Number(riderCounter.seq) + 1,
    status: pendingStatus,
  });
  await counterService.increment("rider-counter");
  const rider = await riderModel
    .findById(response._id)
    .populate("batch zone")
    .exec();
  const riderFormattedData = await RiderDto(rider);

  return {
    data: { ...riderFormattedData, status: STATUS_SLUG.verification_pending },
  };
};

export const riderListByDisplayId = async (req) => {
  const resp = await riderModel.find(
    { display_id: req.body.displayIds },
    "_id display_id fullName"
  );
  return { data: resp };
};

export const update = async (riderId, req) => {
  const files = req.files;
  const body = req.body;
  if (files?.profileImage) {
    body.profileImage = body.profileImage || files.profileImage[0].location;
  }
  if (files?.cnicFront) {
    body.cnicFront = body.cnicFront || files.cnicFront[0].location;
  }
  if (files?.cnicBack) {
    body.cnicBack = body.cnicBack || files.cnicBack[0].location;
  }
  if (files?.licenseFront) {
    body.licenseFront = body.licenseFront || files.licenseFront[0].location;
  }
  if (files?.licenseBack) {
    body.licenseBack = body.licenseBack || files.licenseBack[0].location;
  }
  if (files?.bill) {
    body.bill = body.bill || files.bill[0].location;
  }
  if (body.status == RIDER_STATUSES.ALL_STATUS.approved) {
    body.is_approved = true;
  }
  const resp = await riderModel.findOneAndUpdate({ _id: riderId }, body);
  return { data: resp };
};

const RiderService = {
  findAll,
  findOne,
  approveRider,
  blockRider,
  markRiderOnBreak,
  markRiderBackFromBreak,
  assignBatchToRider,
  assignZonesToRider,
  importRider,
  importFleetRider,
  findByRiderIds,
  bulkUpdateBatch,
  findByZoneId,
  bulkUpdateSequence,
  findById,
  create,
  riderListByDisplayId,
  update,
  bulkUpdateRiderZones,
};
export default RiderService;

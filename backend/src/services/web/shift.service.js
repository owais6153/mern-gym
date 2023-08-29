import shiftModel from "../../database/models/shift.model.js";
import counterModel from "../../database/models/counter.model.js";
import counterService from "./counter.service.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import { validateAvailableSlots, validateIfAShiftExist } from "../../validations/shift.validations.js";
import { generateShiftEndTime, handleBulkCreateShiftHelper, handleCreateShiftHelper, handleUpdateShiftHelper } from "../../helpers/shift.helpers.js";
import { getPaginationInfo } from "../../utils/pagination.js";
import { convertDateTimeToUnix } from "../../utils/helper.js";
import moment from "moment";

const createMany = async (req) => {
  const { payload } = await handleBulkCreateShiftHelper(req);
  const resp = await shiftModel.insertMany(payload);
  await bulkUpdateSequence();
  return { data: resp };
};

const create = async (req) => {
  req.body.createdBy = req?.user?.email;
  const { shiftCounter } = await handleCreateShiftHelper(req);
  const resp = await shiftModel.create({
    ...req.body,
    display_id: Number(shiftCounter.seq) + 1,
    endTime: generateShiftEndTime(req.body.startTime, req.body.shiftDuration),
  });
  await counterService.increment("shift-counter"); //fixed
  return { data: resp };
};

const update = async (req) => {
  const { body } = await handleUpdateShiftHelper(req);
  const resp = await shiftModel.findByIdAndUpdate(req.body.shiftId, {
    ...body,
    endTime: generateShiftEndTime(req.body.startTime, req.body.shiftDuration),
  });
  return { data: resp };
};

const findAll = async (req) => {
  let { limit, page } = req.query;
  let populate = [{ path: "batchList" }],
    execQuery = null,
    query = {},
    resp,
    totalItems;
  if (req.query.id) {
    const { id } = req.query;
    query = { ...query, _id: id };
  }
  if (req.query.status) {
    const { status } = req.query;
    let currentDate = moment();
    switch (status) {
      case "expired":
        query = { ...query, endTime: { $lte: convertDateTimeToUnix(currentDate) } };
        break;
      case "active":
        query = { ...query, isActive: true, endTime: { $gt: convertDateTimeToUnix(currentDate) } };
        break;
      case "inactive":
        query = { ...query, isActive: false };
        break;
      case "started":
        query = { ...query, startTime: { $lte: convertDateTimeToUnix(currentDate) }, endTime: { $gt: convertDateTimeToUnix(currentDate) } };
        break;
      default:
    }
  }
  if (req.query.display_id) {
    const { display_id } = req.query;
    query = { ...query, display_id: display_id };
  }
  if (req.query.startDate && req.query.endDate) {
    let { startDate, endDate } = req.query;
    query = { ...query, startTime: { $gte: convertDateTimeToUnix(startDate), $lte: convertDateTimeToUnix(endDate) }, endTime: { $gte: convertDateTimeToUnix(startDate), $lte: convertDateTimeToUnix(endDate) } };
  }
  limit = parseInt(limit) || APP_CONSTANT.DEFAULT_PAGINATION_LIMIT;
  page = parseInt(page) || APP_CONSTANT.DEFAULT_PAGE;
  if (req.query.zone) {
    const { zone } = req.query;
    populate.push({
      path: "zone",
      match: { zoneName: new RegExp(zone, "i") }
    });
  } else {
    populate.push({ path: "zone" });
    execQuery = (err, shifts) => {
      resp = shifts;
    };
  }
  totalItems = await shiftModel.find(query).populate(populate).countDocuments();
  resp = await shiftModel.find(query).populate(populate).skip((page - 1) * limit).limit(limit);
  if (req.query.zone) {
    resp = resp.filter((v, i) => {
      return v.zone ? v : false;
    });
    let records = await shiftModel.find(query).populate(populate);
    records = records.filter((v, i) => {
      return v.zone ? v : false;
    });
    totalItems = records.length;
  }
  const pagination = getPaginationInfo(page, limit, totalItems);
  return { data: resp, pagination: pagination };
};

const findAllPagination = async (page) => {
  const perPage = 10;
  const totalItems = await shiftModel.find().countDocuments();
  const resp = await shiftModel
    .find()
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ _id: -1 });
  return { data: resp, totalItems };
};

const findOne = async (shiftId) => {
  const resp = await shiftModel.findById(shiftId).populate("batchList zone").exec();
  if (!resp) {
    const error = new Error(`Couldn't find shift details`);
    error.statusCode = STATUS_CODE.not_found;
    throw error;
  }
  return { data: resp };
};

const findAllCurrentAndUpcomingShifts = async (req) => {
  const resp = await shiftModel
    .find({ endTime: { $gt: Date.now() / 1000 } })
    .sort({ _id: -1 })
    .populate("batchList zone")
    .exec();
  return { data: resp };
};

const shiftListByZone = async (req) => {
  const resp = await shiftModel.find({ zone: req.params.zoneId }).populate("batchList zone").exec();
  return { data: resp };
};

const filterByDateRange = async (req) => {
  const resp = await shiftModel
    .find({ startTime: { $gt: req.body.from }, endTime: { $lt: req.body.till } })
    .sort({ _id: -1 })
    .populate("batchList zone")
    .exec();
  return { data: resp };
};

const activateShift = async (shiftId) => {
  await validateIfAShiftExist(shiftId);
  const resp = await shiftModel.findByIdAndUpdate(shiftId, { isActive: true });
  return { data: { shiftId: resp._id } };
};

const deactivateShift = async (shiftId) => {
  await validateIfAShiftExist(shiftId);
  const resp = await shiftModel.findByIdAndUpdate(shiftId, { isActive: false });
  return { data: { shiftId: resp._id } };
};

const updateTotalSlotsFilled = async (req) => {
  const shiftExist = await validateIfAShiftExist(req.body.shiftId);
  validateAvailableSlots(shiftExist);
  const resp = await shiftModel.findByIdAndUpdate(req.body.shiftId, { totalSlotsFilled: req.body.slotsAmount });
  return { data: { shiftId: resp._id } };
};

const bulkUpdateSequence = async (req) => {
  const updateQueries = [];
  const shiftCounter = await counterModel.findOne({ identity: "shift-counter" });
  let seqCounter = Number(shiftCounter.seq);
  let uniAssignedShifts = await shiftModel.find({ display_id: null });

  uniAssignedShifts.map((shift, idx) => {
    seqCounter += 1;
    updateQueries.push({
      updateOne: {
        filter: { _id: shift._id },
        update: { $set: { display_id: seqCounter } },
        upsert: false,
      },
    });
  });
  const resp = await shiftModel.bulkWrite(updateQueries);
  await counterService.bulkIncrement("shift-counter", seqCounter);
  return { data: resp.result.ok };
};

export const shiftListByDisplayId = async (req) => {
  const resp = await shiftModel.find({ display_id: req.body.displayIds }, "_id display_id zone").populate("zone").exec();
  return { data: resp };
};

export const updateTotalSlotsFilledByShiftIds = async (shiftIds) => {
  const resp = await shiftModel.find({ _id: { $in: shiftIds } });
  let bulkUpdateQueries = [];
  resp.map((v, i) => {
    let slotsFilled = 0;
    v.batchList.map((val, index) => {
      slotsFilled += val.slotsFilled;
    });
    bulkUpdateQueries.push({
      updateOne: {
        filter: { _id: v._id },
        update: { $set: { totalSlotsFilled: slotsFilled } },
      },
    });
  });
  const records = await shiftModel.bulkWrite(bulkUpdateQueries);
  return { data: resp };
};

const ShiftService = {
  create,
  update,
  createMany,
  findAll,
  findAllPagination,
  findOne,
  shiftListByZone,
  filterByDateRange,
  updateTotalSlotsFilled,
  activateShift,
  deactivateShift,
  findAllCurrentAndUpcomingShifts,
  shiftListByDisplayId,
  updateTotalSlotsFilledByShiftIds,
};
export default ShiftService;

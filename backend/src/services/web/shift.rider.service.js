import shiftRiderModel from "../../database/models/shift.rider.model.js";
import {
  assignShiftToRiderHelper,
  bulkAssignRidersToShiftsHelper,
  bulkUpdateTotalSlotsFilled,
  generateUpdatedBatchesArray,
} from "../../helpers/shift.helpers.js";
import shiftModel from "../../database/models/shift.model.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import { getPaginationInfo } from "../../utils/pagination.js";

const findShiftRiders = async (req) => {
  const { shiftId } = req.params;
  let { limit, page } = req.query;
  let populate = [{ path: "shiftId" } , { path: "riderId",  }], execQuery = null, query = {}, resp, totalItems;
  limit = parseInt(limit) || APP_CONSTANT.DEFAULT_PAGINATION_LIMIT;
  page = parseInt(page) || APP_CONSTANT.DEFAULT_PAGE;
  if(shiftId) {
    query = { ...query, shiftId: shiftId };
  }
  if (req.query.fleet_id) {
    const { fleet_id } = req.query;
    populate.forEach((v,i) => {
      if(v.path == "riderId") {
        v.match = { fleet_id: fleet_id }
      }
    })
  }

  if (req.query.fullName) {
    const { fullName } = req.query;
    populate.forEach((v,i) => {
      if(v.path == "riderId") {
        v.match = { fullName: new RegExp(fullName, "i") }
      }
    })
  }
  totalItems = await shiftRiderModel.find(query).populate(populate).countDocuments();
  resp = await shiftRiderModel.find(query).populate(populate).skip((page - 1) * limit).limit(limit);
  if (req.query.fleet_id || req.query.fullName ) {
    resp = resp.filter((v, i) => {
      return v.riderId ? v : false;
    });
    let records = await shiftRiderModel.find(query).populate(populate);
    records = records.filter((v, i) => {
      return v.riderId ? v : false;
    });
    totalItems = records.length;
  }
  const pagination = getPaginationInfo(page, limit, totalItems);
  return { data: resp, pagination: pagination };
};

const findRiderShifts = async (riderId) => {
  const resp = await shiftRiderModel
    .find({ riderId })
    .populate({
      path: "shiftId",
      populate: {
        path: "zone",
        model: "zone",
      },
    }).populate("riderId");
  if (!resp) {
    const error = new Error(`Couldn't find rider shifts`);
    error.statusCode = STATUS_CODE.not_found;
    throw error;
  }
  return { data: resp };
};

const bulkAssignRidersToShifts = async (req) => {
  const { riderCountForEachShift, shiftwise_updatedBatchesData } = await bulkAssignRidersToShiftsHelper(req);
  const shiftIds = pluck(req.body, "shiftId");
  const resp = await shiftRiderModel.insertMany(req.body);
  await bulkUpdateTotalSlotsFilled(riderCountForEachShift, shiftwise_updatedBatchesData);
  return { data: resp };
};

const assignShiftToRider = async (req) => {
  const { shiftDetails, riderExist } = await assignShiftToRiderHelper(req);
  const resp = await shiftRiderModel.create(req.body);
  const updatedBatchesData = generateUpdatedBatchesArray(shiftDetails, riderExist.batch);
  await shiftModel.findOneAndUpdate(
    { _id: req.body.shiftId },
    { totalSlotsFilled: Number(shiftDetails.totalSlotsFilled) + 1, batchList: [...updatedBatchesData] },
    { new: true }
  );
  return { data: { _id: resp._id, shiftId: resp.shiftId, riderId: resp.riderId } };
};

const findRiderOngoingShifts = async (riderId) => {
  const currentTimesatmp = Date.now() / 1000;
  let riderShiftList = await shiftRiderModel
    .find({ riderId })
    .sort({ _id: -1 })
    .populate({
      path: "shiftId",
      match: { startTime: { $lte: currentTimesatmp }, endTime: { $gte: currentTimesatmp } },
      populate: {
        path: "zone",
        model: "zone",
      },
    })
    .populate("riderId")
    .exec();
  return { data: riderShiftList };
};

const findByRiderIdShiftId = async (riderId,shiftId) => {
  let record = await shiftRiderModel
    .findOne({ riderId,shiftId })
    .populate({
      path: "shiftId",
      populate: {
        path: "zone",
      },
    })
    .populate("riderId")
    .exec();
  return { data: record };
};

const removeRiderFromShift = async (riderId,shiftId) => {
  let record = await shiftRiderModel.findOneAndUpdate({ riderId,shiftId, isDeleted: false }, { $set: { isDeleted: true } }, { returnNewDocument: true });
  return { data: record };
};

const ShiftRiderService = {
  findRiderShifts,
  findShiftRiders,
  assignShiftToRider,
  bulkAssignRidersToShifts,
  findRiderOngoingShifts,
  findByRiderIdShiftId,
  removeRiderFromShift
};
export default ShiftRiderService;

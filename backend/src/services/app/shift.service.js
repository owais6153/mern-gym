import shiftModel from "../../database/models/shift.model.js";
import shiftRiderModel from "../../database/models/shift.rider.model.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import ShiftDto from "../../dto/shift.dto.js";
import { convertUnixToDayStart, convertUnixToDayEnd } from "../../utils/helper.js";

const findAll = async () => {
  const resp = await shiftModel
    .find({ startTime: { $gt: Date.now() / 1000 } })
    .sort({ _id: -1 })
    .populate("batchList zone")
    .exec();
  return { data: resp };
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
    .find({ startTime: { $gt: Date.now() / 1000 } })
    .sort({ _id: -1 })
    .populate("batchList zone")
    .exec();
  return { data: resp };
};

const findRiderCurrentAndUpcomingShifts = async (riderId, date) => {
  let dayStartTimestamp = convertUnixToDayStart(date);
  let riderShiftList = await shiftRiderModel
    .find({ riderId })
    .sort({ _id: -1 })
    .populate({
      path: "shiftId",
      match: { endTime: { $gte: Date.now() / 1000 } },
      // match: { startTime: { $gte: dayStartTimestamp } },
    })
    .populate('riderId')
    .exec();
  return { data: riderShiftList };
};

const shiftListByZone = async (req) => {
  const dayStartTimestamp = convertUnixToDayStart(req.body.date);
  let resp = [];
  let filter = { zone: { $in: req.body.zoneIds }, startTime: { $gte: Date.now() / 1000 } };
  if (req.body.date || req.body.date.toString().trim() !== "") {
    filter = { ...filter, startTime: { $gt: dayStartTimestamp } };
    const upcomingShiftsFromDayTS = await shiftModel.find(filter).sort({ _id: -1 }).populate("zone").exec();
    upcomingShiftsFromDayTS.map((v, i) => {
      if (v.startTime <= Number(dayStartTimestamp) + 86400) {
        resp.push(ShiftDto(v));
      }
    });
  } else {
    resp = await shiftModel.find(filter).sort({ _id: -1 }).populate("zone").exec();
  }
  return { data: resp };
};

const shiftListByZoneAndDate = async (zoneIds, date) => {
  const dayStartTimestamp = convertUnixToDayStart(date);
  let resp = [];
  let filter = { zone: { $in: zoneIds }, startTime: { $gte: Date.now() / 1000 } };
  if (date || date.toString().trim() !== "") {
    filter = { ...filter, startTime: { $gt: dayStartTimestamp } };
    const upcomingShiftsFromDayTS = await shiftModel.find(filter).sort({ _id: -1 }).populate("zone").exec();
    upcomingShiftsFromDayTS.map((v, i) => {
      if (v.startTime <= Number(dayStartTimestamp) + 86400) {
        resp.push(ShiftDto(v));
      }
    });
  } else {
    resp = await shiftModel.find(filter).sort({ _id: -1 }).populate("zone").exec();
  }
  return { data: resp };
};

// Rider take shift
const assignShiftToRider = async (req) => {
  const result = await shiftRiderModel.create(req.body);
  const resp = await shiftRiderModel.findOne({ shiftId: result.shiftId }).populate("shiftId").exec();
  return { data: resp };
};

const shiftListByRiderId = async (req) => {
  let riderShiftList = await shiftRiderModel
    .find({ riderId: req.params.riderId })
    .sort({ startTime: -1 })
    .populate({
      path: "shiftId",
      populate: {
        path: "zone",
        model: "zone",
      },
    })
    .exec();
  return { data: riderShiftList };
};

const myShifts = async (req) => {
  let riderShiftList = await shiftRiderModel
    .find({ riderId: req.body.riderId })
    .sort({ _id: -1 })
    .populate({
      path: "shiftId",
      populate: {
        path: "zone",
        model: "zone",
      },
    })
    .exec();
  return { data: riderShiftList };
};

const shiftListByZoneDateExcludedRidersFilter = async (rider, date, riderShiftIds) => {
  let resp = [];
  const startDate = convertUnixToDayStart(date || String(date) !== '' ? date : Date.now()/1000 );
  const endDate = convertUnixToDayEnd(date || String(date) !== '' ? date : Date.now()/1000 );
  let zoneIds = rider.zone;
  let filter = { zone: { $in: zoneIds }, _id: { $nin: riderShiftIds }, "batchList.batchId":  rider.batch,  startTime: { $gte: startDate,  $lte: endDate } };
  resp = await shiftModel.find(filter).populate('zone').exec();
  resp = resp.map(ShiftDto)
  return { data: resp };
};

const ShiftService = {
  findAll,
  findOne,
  shiftListByZone,
  shiftListByZoneAndDate,
  findRiderCurrentAndUpcomingShifts,
  shiftListByRiderId,
  assignShiftToRider,
  findAllCurrentAndUpcomingShifts,
  myShifts,
  shiftListByZoneDateExcludedRidersFilter
};
export default ShiftService;

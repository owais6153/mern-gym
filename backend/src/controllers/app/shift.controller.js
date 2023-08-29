import shiftService from "../../services/app/shift.service.js";
import { assignShiftToRiderHelper, generateUpdatedBatchesArray } from "../../helpers/shift.helpers.js";
import { createError, createResponse } from "../../utils/helper.js";
import shiftModel from "../../database/models/shift.model.js";
import riderService from "../../services/web/rider.service.js";
import ShiftDto from "../../dto/shift.dto.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import { validateShiftIsDuplicateInMongo, validateShiftIsOverlapping } from "../../validations/shift.validations.js";
import mongoose from "mongoose";
import ShiftService from "../../services/app/shift.service.js";

const findAll = async (req, res, next) => {
  try {
    let response = await shiftService.findAll();
    response.data = response.data.map(ShiftDto);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findOne = async (req, res, next) => {
  try {
    let response = await shiftService.findOne(req.params.shiftId);
    response.data = ShiftDto(response.data);
    response.message = `Shift has been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const shiftListByZone = async (req, res, next) => {
  try {
    req.body.zoneIds = JSON.parse(req.body.zoneIds);
    const riderExist = await riderService.findOne(req.body.riderId);
    if (!riderExist.data?.batch?._id) {
      const error = new Error(`Rider has currently no batch assigned`);
      error.statusCode = STATUS_CODE.not_found;
      throw error;
    }
    let response = await shiftService.shiftListByZone(req);
    const riderShifts = await shiftService.findRiderCurrentAndUpcomingShifts(req.body.riderId, req.body.date);

    let filteredShifts = [];
    if (response.data.length > 0) {
      response.data.map((v, i) => {
        v.batchList.map((batch) => {
          if (String(riderExist.data.batch._id) === String(batch.batchId) && batch.maxSlots > batch.slotsFilled) {
            filteredShifts.push(v);
          }
        });
      });
    }
    let filteredOverlappingShift = [];
    if (filteredShifts.length > 0 && riderShifts.data.length > 0) {
      filteredShifts.map((v, i) => {
        riderShifts.data.map((val, idx) => {
          if (val && val.shiftId && val.shiftId._id && String(v.id) !== String(val.shiftId._id)) {
            filteredOverlappingShift.push(v);
          }
        });
      });
    }
    response.data = filteredOverlappingShift;
    response.message = `Shifts of zone have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const shiftListByRider = async (req, res, next) => {
  try {
    const currentDate = Math.floor(Date.now() / 1000);
    let currentShifts = [];
    let upcomingShifts = [];
    let response = await shiftService.shiftListByRiderId(req);
    if (response.data.length > 0) {
      response.data.map((v, i) => {
        let zoneData = v.shiftId.zone;
        let shiftData = v.shiftId;
        shiftData.zone = zoneData;
        response.data[i] = response.data[i].shiftId;
      });
    }
    response.data.map((v, i) => {
      if (currentDate > Number(v.startTime) && currentDate < Number(v.endTime)) {
        currentShifts.push(v);
      }
      if (Number(v.endTime) > currentDate + Number(v.shiftDuration) * 3600) {
        upcomingShifts.push(v);
      }
    });
    response.data = { current: currentShifts.map(ShiftDto), upcoming: upcomingShifts.map(ShiftDto) };
    response.message = `Shifts of rider have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const takeAShift = async (req, res, next) => {
  try {
    const { shiftDetails, riderExist } = await assignShiftToRiderHelper(req);
    if (!riderExist.batch?._id) {
      const error = new Error(`Rider has currently no batch assigned`);
      error.statusCode = STATUS_CODE.not_found;
      throw error;
    }

    let response = await shiftService.assignShiftToRider(req);
    response.data = ShiftDto(response.data);
    response.message = `Shift has been assigned successfully`;

    const updatedBatchesData = generateUpdatedBatchesArray(shiftDetails, riderExist.batch);
    await shiftModel.findOneAndUpdate(
      { _id: req.body.shiftId },
      { totalSlotsFilled: Number(shiftDetails.totalSlotsFilled) + 1, batchList: [...updatedBatchesData] },
      { new: true }
    );
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAllCurrentAndUpcomingShifts = async (req, res, next) => {
  try {
    let response = await shiftService.findAllCurrentAndUpcomingShifts(req);
    response.data = response.data.map(ShiftDto);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const myShifts = async (req, res, next) => {
  try {
    let response = await shiftService.myShifts(req);
    if (response.data.length > 0) {
      response.data.map((v, i) => {
        let zoneData = v.shiftId.zone;
        let shiftData = v.shiftId;
        shiftData.zone = zoneData;
        response.data[i] = response.data[i].shiftId;
      });
    }
    const currentDate = Math.floor(Date.now() / 1000);
    const myShiftFrom = req.body.from > currentDate ? req.body.from : currentDate; // Time to start comparing forward in time
    const myShiftTill = req.body.till;
    const historyFrom = req.body.from;
    const historyTill = req.body.till < currentDate ? req.body.till : currentDate; // Time to start comparing backwards in time
    let myShiftList = [];
    let historyShiftList = [];
    response.data &&
      response.data.length > 0 &&
      response.data.map((v, i) => {
        if (req.body.till > currentDate) {
          if (Number(v.startTime) >= myShiftFrom && Number(v.endTime) <= myShiftTill) {
            myShiftList.push(ShiftDto(v));
          }
        }
        if (req.body.from < currentDate) {
          if (Number(v.startTime) >= historyFrom && Number(v.endTime) <= historyTill) {
            historyShiftList.push(ShiftDto(v));
          }
        }
      });
    response.data = { myShifts: myShiftList, history: historyShiftList };
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const ShiftListByRiderZones = async (req, res, next) => {
  try {
    const riderExist = await riderService.findOne(req.body.riderId);
    if (!riderExist.data.zone || riderExist.data.zone.length == 0) {
      const error = new Error(`Currently rider has no zone assigned!`);
      error.statusCode = STATUS_CODE.not_found;
      throw error;
    }
    let riderShiftsResult = await shiftService.findRiderCurrentAndUpcomingShifts(req.body.riderId, req.body.date);
    let riderShifts = [];
    riderShiftsResult.data.map(v => v.shiftId && riderShifts.push(ShiftDto(v)))
    const riderShiftIds = [];
    riderShifts.map((v, i) => riderShiftIds.push(mongoose.Types.ObjectId(v.id)))
    //(1) SHIFTS THAT ARE UNASSIGNED TO RIDER W.R.T RIDER ZONE, DATE 
    let unassignedShifts = await ShiftService.shiftListByZoneDateExcludedRidersFilter(riderExist.data, req.body.date, riderShiftIds);
    unassignedShifts = unassignedShifts.data;
    //(1) END NEW LOGIC

    console.log('riderShifts.data.length: ', riderShifts.length);
    console.log('unassignedShifts.length: ', unassignedShifts.length);

    // //(2) FILTERING RIDER BATCH
    // const batchRelevantShifts = [];
    // unassignedShifts.map((v, i) => {
    //   if(v.id) {
    //     console.log('batch => ', v.id);
    //     v.batchList.map((val, idx) => {
    //       // console.log('String(riderExist.data.batch._id) === String(val.batchId): ', String(riderExist.data.batch._id) === String(val.batchId));
    //       if(String(riderExist.data.batch._id) === String(val.batchId)) {
    //         batchRelevantShifts.push(v)
    //       }
    //     })
    //   }
    // }) 
    //(2) END NEW LOGIC

    //(3) FILTERING OVERLAPPING SHIFTS
    // console.log('batchRelevantShifts.length: ', batchRelevantShifts.length);
    let nonOverlapShifts = [];
    if(riderShifts.length > 0) {
      unassignedShifts.map((v, i) => {
        riderShifts.map((val, idx) => {
          let isOverlapping = validateShiftIsOverlapping(v, val);
          if (!isOverlapping) {
            nonOverlapShifts.push(v)
          }
        });
      });
    } else {
      nonOverlapShifts = [...unassignedShifts]
    }
    //(3) END NEW LOGIC

    console.log('nonOverlapShifts.length: ', nonOverlapShifts.length);
    let response = {}
    response.data = nonOverlapShifts;
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const ShiftController = {
  findAll,
  findOne,
  takeAShift,
  shiftListByZone,
  shiftListByRider,
  findAllCurrentAndUpcomingShifts,
  myShifts,
  // ShiftsForRider,
  ShiftListByRiderZones
};

export default ShiftController;

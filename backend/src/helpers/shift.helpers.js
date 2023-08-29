import mongoose from "mongoose";
import shiftModel from "../database/models/shift.model.js";
import zoneModel from "../database/models/zone.model.js";
import counterModel from "../database/models/counter.model.js";
import { STATUS_CODE } from "../utils/status.code.js";
import BatchListDto from "../dto/shift.batchList.dto.js";
import {
  bulkValidateBatchWiseRidersAssignment,
  bulkValidateIfRiderIsAlreadyAssignedShift,
  bulkValidateIfRidersAreReal,
  bulkValidateIfShiftsAreReal,
  bulkValidateIfShiftTimeOverlapsForAnyRider,
  bulkValidateShiftSlotsCapacityForNewRiders,
  validateRequestHaveUniqueRiderShiftSets,
  bulkValidateDuplicateShifts,
  bulkValidateShiftsAreDuplicateInMongo,
  bulkValidateZoneIds,
  generateAndValidateUniqueBatchIdArrayForBulk,
  validateIfAZoneExist,
  validateShiftIsDuplicateInMongo,
  generateAndValidateUniqueBatchIdArray,
  validateBatchesAreRealAndNotDuplicate,
  bulkValidateZoneNames,
  validateShiftExist,
  validateIfRiderWasAlreadyAssignedThisShift,
  validateBatchWiseRidersAssignment,
  validateIfRiderExist,
  validateRiderShiftsAreNotOverlapping,
  validateAvailableSlots,
} from "../validations/shift.validations.js";

export const handleCreateShiftHelper = async (req) => {
  const uniqueBatchIds = [];
  generateAndValidateUniqueBatchIdArray(uniqueBatchIds, req.body.batchList);
  await validateIfAZoneExist(req.body.zone);
  await validateShiftIsDuplicateInMongo(req.body.startTime, req.body.shiftDuration, req.body.zone);
  await validateBatchesAreRealAndNotDuplicate(uniqueBatchIds);
  const shiftCounter = await counterModel.findOne({ identity: "shift-counter" });
  return { shiftCounter };
};

export const handleUpdateShiftHelper = async (req) => {
  const uniqueBatchIds = [];
  let body = req.body;
  const shiftExist = await validateShiftExist(req.body.shiftId);
  if (Date.now() / 1000 > Number(shiftExist.startTime)) {
    const error = new Error(`Shift is already started you can't update now!`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  if (shiftExist.isActive) {
    const error = new Error(`Please deactivate shift before you edit!`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  if (Number(shiftExist.totalSlotsFilled) > req.body.totalSlots) {
    const error = new Error(`You can't update total slots lesser than slots that are already filled!`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
  body = { ...body, totalSlotsFilled: shiftExist.totalSlotsFilled };
  generateAndValidateUniqueBatchIdArray(uniqueBatchIds, req.body.batchList);

  await validateIfAZoneExist(req.body.zone);
  await validateBatchesAreRealAndNotDuplicate(uniqueBatchIds);
  // const updatedBatchesData = generateShiftBatchDetailsForEditShift(shiftExist, body.batchList);
  // body.batchList = updatedBatchesData.map(BatchListDto);
  // return { updatedBatchesData, body };
  body.batchList = body.batchList.map(BatchListDto);
  return { body };
};

export const generateShiftBatchDetailsForEditShift = (shiftDetails, batchesData) => {
  let updatedBatches = [];
  if (shiftDetails.batchList.length >= batchesData.length) {
    shiftDetails.batchList.map((v, i) => {
      let exist = false;
      batchesData.map((val, idx) => {
        if (String(v.batchId) === String(val.batchId)) {
          updatedBatches.push({ ...shiftDetails.batchList[i], ...batchesData[idx], slotsFilled: shiftDetails.batchList[i].slotsFilled });
          exist = true;
        }
        if (!exist && batchesData.length == idx + 1) {
          updatedBatches.push({ ...batchesData[idx] });
          exist = false;
        }
      });
    });
  }
  if (shiftDetails.batchList.length < batchesData.length) {
    batchesData.map((val, idx) => {
      let exist = false;
      shiftDetails.batchList.map((v, i) => {
        if (String(v.batchId) === String(val.batchId)) {
          updatedBatches.push({ ...shiftDetails.batchList[i], ...batchesData[idx], slotsFilled: shiftDetails.batchList[i].slotsFilled });
          exist = true;
        }
        if (!exist && shiftDetails.batchList.length == i + 1) {
          updatedBatches.push({ ...batchesData[idx] });
          exist = false;
        }
      });
    });
  }
  return updatedBatches;
};

export const handleBulkCreateShiftHelper = async (req) => {
  const zones = await zoneModel.find({}, "_id");
  const uniqueShifts = []; // Complete shift data
  const uniqueBatchIds = [];
  const uniqueBatches = [];
  let payload = req.body;

  req.body.map((v, i) => {
    bulkValidateDuplicateShifts(uniqueShifts, v, i);
    bulkValidateZoneIds(zones, v.zone, i);
    generateAndValidateUniqueBatchIdArrayForBulk(uniqueBatchIds, uniqueBatches, v.batchList);
    payload[i] = { ...payload[i], endTime: generateShiftEndTime(payload[i].startTime, payload[i].shiftDuration) };
  });
  await bulkValidateShiftsAreDuplicateInMongo(uniqueShifts);
  await validateBatchesAreRealAndNotDuplicate(uniqueBatchIds);
  return { payload };
};

export const bulkAssignRidersToShiftsHelper = async (req) => {
  const uniqueRiderShiftIdSets = [];
  const uniqueShiftIds = [];
  const uniqueRiderIds = [];
  const riderCountForEachShift = [];
  validateRequestHaveUniqueRiderShiftSets(req.body, uniqueRiderShiftIdSets);

  req.body.map((v, i) => {
    createRiderCountForEachShiftArray(riderCountForEachShift, v);
    updateUniqueRidersIdArray(uniqueRiderIds, v);
    updateUniqueShiftsIdArray(uniqueShiftIds, v);
  });

  //PARENT: VALIDATING IF RIDER ARE REAL
  const ridersList = await bulkValidateIfRidersAreReal(uniqueRiderIds);
  const shiftRiderSets = await bulkValidateIfRiderIsAlreadyAssignedShift(uniqueShiftIds, uniqueRiderIds);
  //PARENT: IF THE SHIFT START TIME IS OVERLAPPING WITH AN EXISTING SHIFT OF RIDER
  const shifts = await bulkValidateIfShiftsAreReal(uniqueShiftIds);
  await bulkValidateIfShiftTimeOverlapsForAnyRider(shiftRiderSets, shifts);
  bulkValidateShiftSlotsCapacityForNewRiders(shifts, riderCountForEachShift);
  const { batchRidercountSet, shiftwise_updatedBatchesData } = await bulkValidateBatchWiseRidersAssignment(ridersList, shifts);

  return { riderCountForEachShift, shiftwise_updatedBatchesData };
};

export const createRiderCountForEachShiftArray = (riderCountForEachShift, riderShiftSet) => {
  // Creating shift List with respecive rider count from CSV

  if (riderCountForEachShift.length === 0) {
    riderCountForEachShift.push({ shiftId: riderShiftSet.shiftId, riderCount: 1 });
  } else {
    let foundShift = false;
    riderCountForEachShift.map((item, idx) => {
      if (item.shiftId == riderShiftSet.shiftId) {
        foundShift = true;
        riderCountForEachShift[idx].riderCount + 1;
      }
      if (!foundShift && riderCountForEachShift.length == idx + 1) {
        riderCountForEachShift.push({ shiftId: riderShiftSet.shiftId, riderCount: item.riderCount + 1 });
        foundShift = false;
      }
    });
  }
};

export const updateUniqueRidersIdArray = (uniqueRiderIds, riderShiftSet) => {
  // Update Unique riders array

  if (uniqueRiderIds.length === 0) {
    uniqueRiderIds.push(mongoose.Types.ObjectId(riderShiftSet.riderId));
  } else {
    let foundRiderId = false;
    uniqueRiderIds.map((riderId, index) => {
      if (riderId.toString() == riderShiftSet.riderId.toString()) {
        foundRiderId = true;
        return;
      }
      if (uniqueRiderIds.length === index + 1) {
        if (!foundRiderId) {
          uniqueRiderIds.push(mongoose.Types.ObjectId(riderShiftSet.riderId));
        }
        foundRiderId = false;
      }
    });
  }
};

export const updateUniqueShiftsIdArray = (uniqueShiftIds, riderShiftSet) => {
  // Update Unique shifts array

  if (uniqueShiftIds.length === 0) {
    uniqueShiftIds.push(mongoose.Types.ObjectId(riderShiftSet.shiftId));
  } else {
    uniqueShiftIds.map((shiftId, index) => {
      let foundShiftId = false;
      if (shiftId.toString() == riderShiftSet.shiftId.toString()) {
        foundShiftId = true;
      }
      if (uniqueShiftIds.length === index + 1) {
        if (!foundShiftId) {
          uniqueShiftIds.push(mongoose.Types.ObjectId(riderShiftSet.shiftId));
        }
        foundShiftId = false;
      }
    });
  }
};

export const bulkUpdateTotalSlotsFilled = async (riderCountForEachShift, shiftwise_updatedBatchesData) => {
  // THIS FUNCTION VALIDATIONS ARE PRE-CONFIGURED from "bulkAssignRidersToShifts" function call.
  const updateQueries = [];
  shiftwise_updatedBatchesData.map((v) => {
    updateQueries.push({
      updateOne: {
        filter: { _id: mongoose.Types.ObjectId(v._id) },
        update: { $set: { totalSlotsFilled: v.totalSlotsFilled, batchList: [...v.batchList] } },
        upsert: false,
      },
    });
  });
  await shiftModel.bulkWrite(updateQueries);
};

export const generateUpdatedBatchesArray = (shiftDetails, riderBatchId) => {
  let newBatchData = [...shiftDetails.batchList];
  shiftDetails.batchList.map((v, i) => {
    if (String(v.batchId) === String(riderBatchId)) {
      newBatchData.map((val, idx) => {
        if (String(val.batchId) === String(riderBatchId)) {
          newBatchData[idx].slotsFilled = Number(newBatchData[idx].slotsFilled) + 1;
        }
      });
    }
  });
  return newBatchData;
};

export const generateShiftEndTime = (startTime, duration) => {
  return Number(startTime) + Number(duration) * 3600;
};

export const assignShiftToRiderHelper = async (req) => {
  const riderExist = await validateIfRiderExist(req.body.riderId);
  validateRiderIsBlockedOrUnapproved(riderExist);
  await validateIfRiderWasAlreadyAssignedThisShift(req.body.shiftId, req.body.riderId);
  const shiftDetails = await validateRiderShiftsAreNotOverlapping(req.body.shiftId, req.body.riderId);
  validateAvailableSlots(shiftDetails);
  await validateBatchWiseRidersAssignment(shiftDetails, riderExist);
  return { shiftDetails, riderExist };
};

export const validateRiderIsBlockedOrUnapproved = (riderExist) => {
  // if (!riderExist.is_approved) {
  //   const error = new Error(`Rider is not approved!`);
  //   error.statusCode = STATUS_CODE.conflict;
  //   throw error;
  // }
  if (riderExist.status === "blocked" || riderExist.status === "break-temporary") {
    const error = new Error(`Rider is currently blocked!`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
  if (riderExist.status === "pending") {
    const error = new Error(`Rider is currently pending!`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
};

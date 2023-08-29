import zoneModel from "../database/models/zone.model.js";
import shiftModel from "../database/models/shift.model.js";
import riderModel from "../database/models/rider.model.js";
import shiftRiderModel from "../database/models/shift.rider.model.js";
import batchModel from "../database/models/batch.model.js";
import { STATUS_CODE } from "../utils/status.code.js";
import { generateUpdatedBatchesArray } from "../helpers/shift.helpers.js";

export const validateIfAZoneExist = async (zoneId) => {
  const zoneExist = await zoneModel.findById(zoneId);
  if (!zoneExist) {
    const error = new Error(`Invalid zone Id`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return zoneExist;
};

export const validateShiftExist = async (shiftId) => {
  const response = await shiftModel.findById(shiftId);
  if (!response) {
    const error = new Error(`Invalid shift Id`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return response;
};

export const validateIfAShiftExist = async (shiftId) => {
  const shiftExist = await shiftModel.findById(shiftId);
  if (!shiftExist) {
    const error = new Error(`Invalid shift Id`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return shiftExist;
};

export const validateIfRiderExist = async (riderId) => {
  // IF RIDER IS NOT REAL
  const riderExist = await riderModel.findById(riderId).populate("batch").exec();
  if (!riderExist) {
    const error = new Error(`Invalid rider ID`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return riderExist;
};

export const validateAvailableSlots = (shiftExist) => {
  const availableSlots = Number(shiftExist.totalSlots) - Number(shiftExist.totalSlotsFilled);
  // if (Number(req.body.slotsAmount) > availableSlots) {
  if (availableSlots < 1) {
    const error = new Error(`All slots of this shift are filled!`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
};

export const validateIfRiderWasAlreadyAssignedThisShift = async (shiftId, riderId) => {
  // IF THIS RIDER WAS ALREADY ASSIGNED THIS SHIFT
  const alreadyAssigned = await shiftRiderModel.findOne({ shiftId, riderId });
  if (alreadyAssigned) {
    const error = new Error(`Shift is already assigned to this rider`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
};

export const validateRiderShiftsAreNotOverlapping = async (shiftId, riderId) => {
  // IF THE SHIFT START TIME IS OVERLAPPING WITH AN EXISTING SHIFT OF RIDER
  let shiftIsOverlapping = false;
  const shiftDetails = await shiftModel.findById(shiftId);
  if (!shiftDetails) {
    const error = new Error(`No data found with current shift ID`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  const newShiftStartTime = Number(shiftDetails.startTime);
  const riderAllAssignedShifts = await shiftRiderModel.find({ riderId }).populate("shiftId").exec();
  riderAllAssignedShifts.map((val) => {
    // CHECKING => If end-time of rider's other shifts is not overlapping newShift start-time.
    // if (newShiftStartTime < Number(val.shiftId?.startTime) + Number(val.shiftId?.shiftDuration) * 3600) {
    //   shiftIsOverlapping = true;
    // }
    validateShiftIsOverlapping(newShiftStartTime, val?.shiftId);
  });
  if (shiftIsOverlapping) {
    // const error = new Error(`Shift is already assigned to this rider`);
    const error = new Error(`Shift time is overlapping an existing shift`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
  return shiftDetails;
};

export const validateRequestHaveUniqueRiderShiftSets = (data, uniqueRiderShiftIdSets) => {
  // VALIDATE IF REQUEST DATA HAS UNIQUE {RiderId, ShiftId} OBJECTS.
  data.map((v, i) => {
    if (uniqueRiderShiftIdSets.length === 0) {
      uniqueRiderShiftIdSets.push(v);
      return;
    } else {
      uniqueRiderShiftIdSets.map((val, idx) => {
        if (uniqueRiderShiftIdSets.length > 0 && v.riderId == val.riderId && v.shiftId == val.shiftId) {
          const error = new Error(`Duplicate shiftID & riderID set in request at index ${i + 1}`);
          error.statusCode = STATUS_CODE.conflict;
          throw error;
        } else {
          if (uniqueRiderShiftIdSets.length == idx + 1) {
            uniqueRiderShiftIdSets.push({ riderId: v.riderId, shiftId: v.shiftId });
          }
        }
      });
    }
  });
};

export const validateBatchWiseRidersAssignment = async (shiftDetails, riderDetail) => {
  const totalShiftRiders = await shiftRiderModel.find({ shiftId: shiftDetails._id }).populate("riderId").exec();
  const batchRiders = [];
  let currentShiftBatchDetail = {};
  // let totalSumOfSlotsInBatchDetails = 0;
  let riderBatchExistInShift = false;

  shiftDetails.batchList.map((batch, idx) => {
    if (String(batch.batchId) == String(riderDetail.batch._id)) {
      currentShiftBatchDetail = batch;
      riderBatchExistInShift = true;
    }
    if (batch.slotsFilled >= batch.maxSlots) {
      const error = new Error(`Slots of this batch are already filled up!`);
      error.statusCode = STATUS_CODE.not_acceptable;
      throw error;
    }
    if (shiftDetails.batchList.length == idx + 1) {
      if (!riderBatchExistInShift) {
        const error = new Error(`Riders batch does not belong to batches of this shift`);
        error.statusCode = STATUS_CODE.not_acceptable;
        throw error;
      }
      riderBatchExistInShift = false;
    }
  });

  totalShiftRiders.map((rider, i) => {
    if (riderDetail.batch == rider.batch) {
      batchRiders.push(rider);
    }
  });

  if (batchRiders.length >= Number(currentShiftBatchDetail.maxSlots)) {
    const error = new Error(`Riders batch wise limit has reached, cannot assign more riders of this batch`);
    error.statusCode = STATUS_CODE.not_acceptable;
    throw error;
  }
  return { totalShiftRiders, currentShiftBatchDetail };
};

// ********************** BULK VALIDATIONS *****************************

export const bulkValidateBatchWiseRidersAssignment = async (ridersList, shifts) => {
  let BatchRidercountSet = [];
  // let shiftwise_updatedBatchesData = [];
  let all_batches = await batchModel.find();
  all_batches.map((v, i) => {
    BatchRidercountSet.push({ batch: v._id, slotsFilled: 0 });
  });

  ridersList.map((rider, i) => {
    BatchRidercountSet.map((val, idx) => {
      if (rider.batch) {
        if (String(rider.batch) === String(val.batch)) {
          BatchRidercountSet[idx].slotsFilled += 1;
        }
      } else {
        throw new Error(`Rider ${"with id:" + rider?.display_id} Batch is invalid for this shift`);
      }
    });
  });
  BatchRidercountSet = BatchRidercountSet.filter((v) => {
    if (v.slotsFilled > 0) {
      return v;
    }
  });
  let totalSumOfSlotsFilledInBatches = 0; // Previous batchSLotsFilled summed with new batchSLots that will be assigned
  let batchFound = false;
  shifts.map((v, i) => {
    v.batchList.map((val, idx) => {
      // totalSumOfSlotsInBatchDetails += val.maxSlots;

      BatchRidercountSet.map((value, index) => {
        if (String(val.batchId) == String(value.batch)) {
          batchFound = true;
          if (Number(value.slotsFilled) >= Number(val.maxSlots) - Number(val.slotsFilled)) {
            const error = new Error(
              `In shift: ${v._id} the rider slots for batch: ${val.batchId} has only available slots ${Number(val.maxSlots) - Number(val.slotsFilled)}`
            );
            error.statusCode = STATUS_CODE.not_acceptable;
            throw error;
          }
          val.slotsFilled += Number(value.slotsFilled);
          totalSumOfSlotsFilledInBatches += Number(val.slotsFilled);
        }
      });
    });
    v.totalSlotsFilled = totalSumOfSlotsFilledInBatches;
  });
  if (!batchFound) {
    throw new Error(`Rider's batch not found against the shift`);
  }

  // Generate an array of updated batchList with updatedBatchesData(slots) - shifts wise
  // shifts.map((v, i) => {
  //   v.batchList.map((val, idx) => {
  //     ridersList.map((rider) => {
  //       if (String(rider.batch) === String(val.batchId)) {
  //         if (i == 0) {
  //           const updatedBatchesData = generateUpdatedBatchesArray(v, rider.batch);
  //           shiftwise_updatedBatchesData.push({ shiftId: v._id, riderCount: 1, batchList: [...updatedBatchesData] });
  //         } else {
  //           let foundShift = false;
  //           shiftwise_updatedBatchesData.map((v, i) => {
  //             if (String(v.shiftId) === String(v._id)) {
  //               foundShift = true;
  //               const updatedBatchesData = generateUpdatedBatchesArray(v, rider.batch);
  //               shiftwise_updatedBatchesData[i].riderCount += 1;
  //               shiftwise_updatedBatchesData[i].batchList = [...updatedBatchesData];
  //             }
  //             if (shiftwise_updatedBatchesData.length == i + 0 && !foundShift) {
  //               const updatedBatchesData = generateUpdatedBatchesArray(v, rider.batch);
  //               shiftwise_updatedBatchesData.push({ shiftId: v._id, riderCount: 1, batchList: [...updatedBatchesData] });
  //               foundShift = false;
  //             }
  //           });
  //         }
  //       }
  //     });
  //   });
  // });
  return { BatchRidercountSet, shiftwise_updatedBatchesData: shifts };
};

export const bulkValidateDuplicateShifts = (uniqueShifts, shift, shiftIdx) => {
  //VALIDATING DUPLICATE SHIFTS IN REQUEST
  if (uniqueShifts.length === 0) {
    uniqueShifts.push(shift);
  } else {
    uniqueShifts.map((val, idx) => {
      if (uniqueShifts.length > 0 && shift.zone == val.zone && shift.startTime == val.startTime && shift.shiftDuration == val.shiftDuration) {
        const error = new Error(`Duplicate request shift found at index ${shiftIdx + 1}`);
        error.statusCode = STATUS_CODE.conflict;
        throw error;
      } else {
        if (uniqueShifts.length == idx + 1) {
          // uniqueShifts.push({ riderId: shift.riderId, shiftId: shift.shiftId });
          uniqueShifts.push(shift);
        }
      }
    });
  }
};

export const bulkValidateZoneIds = (zones, zoneId, zoneIdx) => {
  // VALIDATING IF ZONE IDS ARE VALID
  let found = false;
  zones.map((val, idx) => {
    if (val._id.toString() === zoneId.toString()) {
      found = true;
    }
    if (val.length === idx + 1) {
      if (!found) {
        const error = new Error(`Invalid zone ID at item ${zoneIdx + 1}`);
        error.statusCode = STATUS_CODE.bad_request;
        throw error;
      }
      found = false;
    }
  });
};
export const bulkValidateZoneNames = (zones, zoneName, zoneIdx) => {
  // VALIDATING IF ZONE IDS ARE VALID
  let found = false;
  zones.map((val, idx) => {
    if (val.zoneName === zoneName) {
      found = true;
    }
    if (val.length === idx + 1) {
      if (!found) {
        const error = new Error(`Invalid zone ID at item ${zoneIdx + 1}`);
        error.statusCode = STATUS_CODE.bad_request;
        throw error;
      }
      found = false;
    }
  });
};

export const generateAndValidateUniqueBatchIdArray = (uniqueBatchIds, batchList) => {
  batchList.map((defaultBatch, idx) => {
    if (idx == 0 && uniqueBatchIds.length === 0) {
      uniqueBatchIds.push(String(defaultBatch.batchId));
    } else {
      uniqueBatchIds.map((v, i) => {
        if (String(v) == String(defaultBatch.batchId)) {
          const error = new Error(`Batch ID is duplicate in batchList at index: ${idx + 1}`);
          error.statusCode = STATUS_CODE.not_acceptable;
          throw error;
        }
        if (i + 1 == batchList.length) {
          uniqueBatchIds.push(String(defaultBatch.batchId));
        }
      });
    }
  });
};

// export const generateUpdatedBatchListForUpdate = (uniqueBatchIds, batchList) => {};

export const generateAndValidateUniqueBatchIdArrayForBulk = (uniqueBatchIds, uniqueBatches, shiftBatchList) => {
  const currBatchList = shiftBatchList;
  let currUniqueBatchIds = [];
  let currUniqueBatches = [];

  currBatchList.map((v, i) => {
    if (i == 0 && uniqueBatchIds.length == 0 && uniqueBatches.length == 0) {
      currUniqueBatchIds.push(v.batchId);
      currUniqueBatches.push(v);
    } else {
      currUniqueBatchIds.map((batchId, idx) => {
        if (batchId == v.batchId) {
          const error = new Error(`Batch ID is duplicate in ${idx + 1} number of shift from list`);
          error.statusCode = STATUS_CODE.not_acceptable;
          throw error;
        }
        if (currUniqueBatchIds.length == idx + 1) {
          currUniqueBatchIds.push(v.batchId);
          currUniqueBatches.push(v);
        }
      });
    }
    if (currBatchList.length == i + 1) {
      uniqueBatchIds.push(...currUniqueBatchIds);
      uniqueBatches.push(...currUniqueBatches);
    }
  });
};

export const validateBatchesAreRealAndNotDuplicate = async (uniqueBatchIds) => {
  if (uniqueBatchIds.length > 6) {
    const error = new Error(`There are maximum 6 batches with unique batch ids`);
    error.statusCode = STATUS_CODE.not_acceptable;
    throw error;
  }

  const batchesRetrieved = await batchModel.find({ $in: uniqueBatchIds });
  if (!batchesRetrieved || batchesRetrieved.length == 0 || batchesRetrieved.length < uniqueBatchIds.length) {
    const error = new Error(`Some batch/batches IDs are invalid`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
};

export const validateShiftIsDuplicateInMongo = async (startTime, shiftDuration, zoneId) => {
  // VALIDATE IF A SHIFT ALREADY EXIST IN MONGODB
  const shiftIsDuplicate = await shiftModel.findOne({ startTime, shiftDuration, zone: zoneId }).populate("zone").exec();
  if (shiftIsDuplicate) {
    const error = new Error(`Shift already exist in list!`);
    // const error = new Error(
    //   `Shift with zone: ${zoneId} & startTime: ${String(new Date(startTime * 1000)).slice(0, 21)} & shiftDuration: ${shiftDuration} already exist in records`
    // );
    error.statusCode = STATUS_CODE.not_acceptable;
    throw error;
  }
  return shiftIsDuplicate;
};

export const bulkValidateShiftsAreDuplicateInMongo = async (uniqueShifts) => {
  // VALIDATE IF SHIFTS ALREADY EXIST IN MONGODB
  const zoneIds = [];
  const startTimes = [];
  const shiftDurations = [];
  uniqueShifts.map((v, i) => {
    zoneIds.push(v.zone);
    startTimes.push(v.startTime);
    shiftDurations.push(v.shiftDuration);
  });
  const ShiftsWithExistingZones = await shiftModel.find({ zone: { $in: zoneIds } });
  const ShiftsWithExistingStartTimes = await shiftModel
    .find({ startTime: { $in: startTimes } })
    .populate("zone")
    .exec();
  const ShiftsWithExistingDurations = await shiftModel.find({ shiftDuration: { $in: shiftDurations } });

  const alreadyExistingShifts = [];
  ShiftsWithExistingStartTimes.map((v, i) => {
    let zone_exist = false;
    let duration_exist = false;
    ShiftsWithExistingDurations.map((existingDurationShift) => {
      if (existingDurationShift.shiftDuration == v.shiftDuration) {
        duration_exist = true;
      }
    });
    ShiftsWithExistingZones.map((existingZoneShift) => {
      if (String(existingZoneShift.zone) == String(v.zone)) {
        zone_exist = true;
      }
    });
    if (i + 1 == ShiftsWithExistingStartTimes.length && zone_exist && duration_exist) {
      alreadyExistingShifts.push(v);
      zone_exist = false;
      duration_exist = false;
    } else {
      zone_exist = false;
      duration_exist = false;
    }
  });

  if (alreadyExistingShifts && alreadyExistingShifts.length > 0) {
    const error = new Error(`Shift already exist in list!`);
    // const error = new Error(
    //   `Shift with zone: ${alreadyExistingShifts[0].zone} & startTime: ${String(new Date(alreadyExistingShifts[0].startTime * 1000)).slice(
    //     0,
    //     21
    //   )} & shiftDuration: ${alreadyExistingShifts[0].shiftDuration} already exist in records!`
    // );
    error.statusCode = STATUS_CODE.not_acceptable;
    throw error;
  }
};

export const bulkValidateIfRidersAreReal = async (uniqueRiderIds) => {
  //CHILD: FINDING RIDER LIST(BY ARRAY) HAVING RIDER IDS THROUGH MONGO QUERY
  const riders = await riderModel.find({ _id: { $in: uniqueRiderIds } });
  if (!riders || riders.length < uniqueRiderIds.length) {
    const error = new Error(`Couldn't find all riders due to invalid rider ID`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return riders;
};

export const bulkValidateIfRiderIsAlreadyAssignedShift = async (uniqueShiftIds, uniqueRiderIds) => {
  // VALIDATE IF RIDERS IS ALREADY ASSIGNED A SAME SHIFT
  const shiftRiderSets = await shiftRiderModel.find({ shiftId: uniqueShiftIds, riderId: uniqueRiderIds }).exec();
  if (shiftRiderSets && shiftRiderSets.length > 0) {
    const error = new Error(`Shift with ID ${shiftRiderSets[0].shiftId} was already assigned to rider ${shiftRiderSets[0].riderId}`);
    error.statusCode = STATUS_CODE.conflict;
    throw error;
  }
  return shiftRiderSets;
};

export const bulkValidateIfShiftsAreReal = async (uniqueShiftIds) => {
  // IF SHIFTS ARE VALID AND REAL
  const shifts = await shiftModel.find({ _id: { $in: uniqueShiftIds } });
  if (!shifts || shifts.length < uniqueShiftIds.length) {
    const error = new Error(`Couldn't find all shifts due to invalid shift ID`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  return shifts;
};

export const bulkValidateIfShiftTimeOverlapsForAnyRider = async (shiftRiderSets, shifts) => {
  //CHILD: BULK VALIDATE IF RIDER SHIFT SET HAVE SHIFT TIME OVERLAPPING ANY RIDER'S ALREADY ASSIGNED SHIFT
  shiftRiderSets.map((v, i) => {
    shifts.map(async (val, idx) => {
      if (v.shiftId == val._id) {
        const riderAssignedShiftsThatOverlap = await shiftRiderModel
          .find({ riderId: v.riderId })
          .populate({
            path: "shift",
            match: { startTime: { $lte: Number(val.startTime) + Number(val.shiftDuration) * 3600 } },
          })
          .exec();
        if (riderAssignedShiftsThatOverlap.length > 0) {
          const error = new Error(
            `Rider with ID ${riderAssignedShiftsThatOverlap[0].riderId} is overlapping shift with ID ${riderAssignedShiftsThatOverlap[0].shiftId}`
          );
          error.statusCode = STATUS_CODE.conflict;
          throw error;
        }
      }
    });
  });
};

export const bulkValidateShiftSlotsCapacityForNewRiders = async (shifts, riderCountForEachShift) => {
  // Validate totalSlotsFilled have capacity to assign number of new riders

  shifts.map((shift, shiftIdx) => {
    riderCountForEachShift.map((v, i) => {
      if (shift._id == v.shiftId) {
        if (v.riderCount > Number(shift.totalSlots) - Number(shift.totalSlotsFilled)) {
          const error = new Error(
            `Shift with ID ${v.shiftId} have ${Number(shift.totalSlots) - Number(shift.totalSlotsFilled)} available slots while you have requested to assign ${
              v.riderCount
            } number of riders`
          );
          error.statusCode = STATUS_CODE.not_acceptable;
          throw error;
        }
      }
    });
  });
};

export const validateShiftIsOverlapping = (shiftToValidate, shiftToValidateFrom) => {
  if (
    (shiftToValidate.startTime >= shiftToValidateFrom.startTime && shiftToValidate.endTime <= shiftToValidateFrom.endTime) ||
    (shiftToValidate.startTime <= shiftToValidateFrom.startTime && shiftToValidate.endTime >= shiftToValidateFrom.endTime)
  ) {
    return true;
  } else {
    return false;
  }
};

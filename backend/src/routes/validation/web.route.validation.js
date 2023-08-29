import { body, param, validationResult, check } from "express-validator";
import { createError, pluck, convertUnixToDateTime, validURL } from "../../utils/helper.js";
import batchService from "../../services/web/batch.service.js";
import riderService from "../../services/web/rider.service.js";
import zoneService from "../../services/web/zone.service.js";
import storeService from "../../services/web/store.service.js";
import taskService from "../../services/web/task.service.js";
import riderShiftService from "../../services/web/shift.rider.service.js";
import taskAssignmentService from "../../services/web/task.assign.service.js";
import K2commerceService from "../../services/external/k2commerce.service.js";
import taskStatusService from "../../services/web/task.status.service.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/rider.assignment.status.slug.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import { STATUS_CODE } from "../../utils/status.code.js";
import RIDER_STATUSES from "../../utils/rider.status.js";
import {
  validateCnicAlreadyRegistered,
  validateNumberAlreadyRegistered,
  validateEmailAlreadyRegistered,
  validateEmailAlreadyRegisteredExceptId,
  validateNumberAlreadyRegisteredExceptId,
  validateCnicAlreadyRegisteredExceptId,
} from "../../validations/auth.validations.js";
import moment from "moment";
import mongoose from "mongoose";
import ShiftService from "../../services/web/shift.service.js";
import TaskIssueService from "../../services/web/task.issue.service.js";
import ShiftRiderService from "../../services/web/shift.rider.service.js";
import DefaultBatchService from "../../services/web/default.batch.service.js";

const validationErrorCreation = (res, errors, next) => {
  try {
    errors.statusCode = 400;
    errors.message = "Validation Error";
    let errorMessages = [];
    errors.errors.map(function (error) {
      let { param, msg } = error;
      errorMessages = { ...errorMessages, [param]: msg };
    });
    errors.data = errorMessages;
  } catch (e) {
    errors = e;
  } finally {
    return createError(res, errors, next);
  }
};

export const register_admin_validation = [
  body("fullName").trim().not().isEmpty().withMessage("Invalid full name"),
  body("email").isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
  body("password").trim().isLength({ min: 6 }).withMessage("Password is too short"),
  (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const payout_create_validation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").trim().not().isEmpty().withMessage("Invalid password format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const create_batch_validation = [
  body("batchLevel")
    .trim()
    .isNumeric()
    .custom(async (value, { req }) => {
      if (Number(value) > 6 || Number(value) < 1) {
        throw new Error(`Batch level is invalid`);
      }
      let batchExist = await batchService.findByLevel(value);
      if (batchExist.data) {
        throw new Error(`Batch level already exists`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_batch_validation = [
  body("batchLevel")
    .trim()
    .isNumeric()
    .custom(async (value, { req }) => {
      if (Number(value) > 6 || Number(value) < 1) {
        throw new Error(`Batch level is invalid`);
      }
      let batches = await batchService.findAll();
      batches.data.forEach(function (batch, key) {
        if (batch.id !== req.body.id && batch.batchLevel == req.body.batchLevel) {
          throw new Error(`All Batch levels must be unique!`);
        }
      });
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];
export const create_default_batch_validation = [
  body("*.batch").trim().isMongoId().withMessage("Invalid batch ID"),
  body("*.slotsPercentage")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 100) {
        throw new Error(`Percentage can't be grater than 100`);
      }
      if (Number(value) < 1) {
        throw new Error(`Percentage can't be lesser than 1`);
      }
      return true;
    }),
  body(".").custom(async (value, { req }) => {
    let uniqueBatchIds = [];
    req.body.map((v, i) => {
      if (i == 0) {
        uniqueBatchIds.push(mongoose.Types.ObjectId(v.batch));
      } else {
        uniqueBatchIds.map((existingId, idx) => {
          let found = false;
          // console.log('String(existingId) == String(v.batch): ', String(existingId) == String(v.batch));
          if(String(existingId) == String(v.batch)){
            found = true
          }
          if (String(existingId) == String(v.batch)) {
            throw new Error(`Batch Id must be unique!`);
          } 
          if(uniqueBatchIds.length == idx + 1 && !found){
            uniqueBatchIds.push(mongoose.Types.ObjectId(v.batch));
          }
        });
      }
    });
    const batchesDetails = await batchService.findByIds(uniqueBatchIds);
    // console.log('batchDetails =>> ', uniqueBatchIds);
    if (batchesDetails.data.length < uniqueBatchIds.length){
      throw new Error('Invalid batch ids are provided!')
    }
    const alreadyExistDefaults = await DefaultBatchService.findManyByBatchIds(uniqueBatchIds)
    if (alreadyExistDefaults.data.length > 0) {
      throw new Error('Default configuration of batches already exist!')
    }
    return true;
  }),
  body("*.startDisplayHours").trim().isNumeric(),
  body("*.endDisplayHours").trim().isNumeric(),
  body("endDisplayHours").custom(async (value, { req }) => {
    req.body.map(function (val, key) {
      if (val.startDisplayHours <= val.endDisplayHours) {
        throw new Error(`Display Hours must be greater than End Display Hours!`);
      }
      if (val.startDisplayHours == 0) {
        throw new Error(`Display Hour must be greater than zero!`);
      }
      if (val.endDisplayHours == 0) {
        throw new Error(`End Display Hour must be greater than zero!`);
      }
      return true;
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    errors.errors.map((v, i) => {
      if (v.param == null || v.param == "") {
        v.param = "batch";
      }
    });
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_default_batch_validation = [
  body("*.batch").trim().isMongoId().withMessage("Invalid batch ID"),
  body("*.slotsPercentage")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 100) {
        throw new Error(`Percentage can't be grater than 100`);
      }
      if (Number(value) < 1) {
        throw new Error(`Percentage can't be lesser than 1`);
      }
      return true;
    }),
  body(".").custom(async (value, { req }) => {
    let uniqueBatchIds = [];
    req.body.map((v, i) => {
      if (i == 0) {
        uniqueBatchIds.push(mongoose.Types.ObjectId(v.batch));
      } else {
        uniqueBatchIds.map((existingId, idx) => {
          let found = false;
          if(String(existingId) == String(v.batch)){
            found = true
          }
          if (String(existingId) == String(v.batch)) {
            throw new Error(`Batch Id must be unique!`);
          } 
          if(uniqueBatchIds.length == idx + 1 && !found){
            uniqueBatchIds.push(mongoose.Types.ObjectId(v.batch));
          }
        });
      }
    });
    const batchesDetails = await batchService.findByIds(uniqueBatchIds);
    if (batchesDetails.data.length < uniqueBatchIds.length) {
      throw new Error('Invalid batch ids are provided!')
    }
    return true;
  }),
  body("*.startDisplayHours").trim().isNumeric(),
  body("*.endDisplayHours").trim().isNumeric(),
  body("endDisplayHours").custom(async (value, { req }) => {
    req.body.map(function (val, key) {
      if (val.startDisplayHours <= val.endDisplayHours) {
        throw new Error(`Display Hours must be greater than End Display Hours!`);
      }
      if (val.startDisplayHours == 0) {
        throw new Error(`Display Hour must be greater than zero!`);
      }
      if (val.endDisplayHours == 0) {
        throw new Error(`End Display Hour must be greater than zero!`);
      }
      return true;
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    errors.errors.map((v, i) => {
      if (v.param == null || v.param == "") {
        v.param = "batch";
      }
    });
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_batch_validation = [
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  body("batchId").trim().isMongoId().withMessage(`Invalid Batch ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_zone_validation = [
  body("riderId")
    .trim()
    .isMongoId()
    .withMessage(`Invalid Rider ID provided!`)
    .custom(async (riderId) => {
      await riderService.findOne(riderId);
      return true;
    }),
  body("zoneIds.*")
    .trim()
    .not()
    .isEmpty()
    .custom((zoneId) => {
      return true;
    }),
  body("zoneIds")
    .isArray({ min: 1 })
    .withMessage("Provide atleast one zone id")
    .custom(async (zoneIds) => {
      const zones = await zoneService.findAll();
      const uniqueZoneList = [];
      let zoneIsValid = false;
      zoneIds.map((zoneId, i) => {
        zones.data.map((zone, idx) => {
          if (String(zone._id) === String(zoneId)) {
            zoneIsValid = true;
          }
          if (zones.data.length == idx + 1 && !zoneIsValid) {
            zoneIsValid = false;
            throw new Error(`Invalid zone id provided!`);
          }
        });
      });
      zoneIds.map((v, i) => {
        if (i == 0) {
          uniqueZoneList.push(v.toString());
        } else {
          uniqueZoneList.map((val, idx) => {
            if (v === val) {
              throw new Error(`Duplicate zone id provided!`);
            }
          });
        }
      });
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const rider_detail_validation = [
  param("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const approve_rider_validation = [
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const block_rider_validation = [
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const mark_rider_on_break_validation = [
  body("riderId")
    .trim()
    .isMongoId()
    .withMessage(`Invalid Rider ID`)
    .custom(async (value) => {
      const rider = await riderService.findById(value);
      if (rider.data) {
        if (rider.data.status === RIDER_STATUSES.ALL_STATUS.blocked) {
          throw new Error(`This rider is blocked already!`);
        }
        if (rider.data.status == RIDER_STATUSES.ALL_STATUS.break || rider.data.status == RIDER_STATUSES.ALL_STATUS.break_temporary) {
          throw new Error(`Rider is already on break!`);
        }
      } else {
        throw new Error(`Rider Not Found!`);
      }
      return true;
    }),
  body("type")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`please select break type`)
    .custom((value) => {
      if (!Object.values(RIDER_STATUSES.ALL_STATUS).includes(value)) {
        throw new Error(`Invalid break type`);
      }
      return true;
    }),
  body("reason").trim().not().isEmpty().withMessage(`please select reason`),
  body("start_date")
    .not()
    .isEmpty()
    .isISO8601()
    .toDate()
    .withMessage(`start date field is required & must be in right format`)
    .custom((value, { req }) => {
      let timeZone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timeZone);
      let endDate = moment(req.body.end_date).utcOffset(timeZone);
      let startDate = moment(value).utcOffset(timeZone);
      if (currentDate.isAfter(startDate) || endDate.isSameOrBefore(startDate)) {
        throw new Error("Start datetime must be greater than current date time and less than End date time");
      }
      return true;
    }),
  body("end_date")
    .not()
    .isEmpty()
    .isISO8601()
    .toDate()
    .withMessage(`end date field is required & must be in right format`)
    .custom((value, { req }) => {
      let timeZone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timeZone);
      let startDate = moment(req.body.start_date).utcOffset(timeZone);
      let endDate = moment(value).utcOffset(timeZone);
      if (currentDate.isAfter(endDate) || endDate.isSameOrBefore(startDate)) {
        throw new Error("End datetime must be greater than current date time and Start date time");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const mark_rider_back_from_break_validation = [
  body("riderId")
    .trim()
    .isMongoId()
    .withMessage(`Invalid Rider ID`)
    .custom(async (value) => {
      const rider = await riderService.findById(value);
      if (rider.data) {
        if (rider.data.status == RIDER_STATUSES.blocked) {
          throw new Error(`This rider is blocked already!`);
        }
        if (!Object.values(RIDER_STATUSES.RIDER_BREAK_STATUS).includes(rider.data.status)) {
          throw new Error(`Rider is not on break!`);
        }
      } else {
        throw new Error(`Rider Not Found!`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const create_store_validation = [
  body("zoneId").trim().isMongoId().withMessage("Invalid zone ID"),
  body("storeId")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`Invalid store ID`)
    .custom(async (value, { req }) => {
      await zoneService.findById(req.body.zoneId);
      let response = await storeService.findOne(req.body.storeId);
      if(response.data) {
        throw new Error('Store already exist!')
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_store_validation = [
  body("zoneId").trim().isMongoId().withMessage("Invalid zone ID"),
  body("storeId")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`Invalid store ID`)
    .custom(async (value, { req }) => {
      await zoneService.findById(req.body.zoneId);
      await storeService.findByStoreId(req.body.storeId);
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const findOne_store_validation = [
  param("storeId").trim().not().isEmpty().withMessage(`Invalid store ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_shift_to_rider_validation = [
  body("shiftId")
    .isMongoId()
    .withMessage(`Invalid Shift ID`)
    .custom(async (value, { req }) => {
      const { riderId } = req.body;
      const shift = await ShiftService.findOne(value);
      const shiftStartTime = convertUnixToDateTime(shift.data.startTime).toISOString();
      const shiftEndtime = convertUnixToDateTime(shift.data.endTime).toISOString();
      const riderShift = await riderShiftService.findByRiderIdShiftId(riderId,value)
      if(riderShift.data) {
        throw new Error('Shift is already assigned to this rider');
      }
      const riderShifts = await riderShiftService.findRiderShifts(riderId);
      if (riderShifts.data.length > 0) {
        riderShifts.data.map((v, i) => {
          let currentStartTime = convertUnixToDateTime(v.shiftId.startTime).toISOString();
          let currentEndTime = convertUnixToDateTime(v.shiftId.endTime).toISOString();
          if (
            (currentStartTime >= shiftStartTime && currentStartTime <= shiftEndtime) ||
            (currentEndTime >= shiftStartTime && currentEndTime <= shiftEndtime)
          ) {
            throw new Error(`Shift you're trying to assign is overlapping with rider's existing shift timings!`);
          }
        });
      }

      return true;
    }),
  body("riderId").isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_shift_to_rider_bulk_validation = [
  // body("*").isArray(),
  body("*.shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  body("*.riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const find_shift_riders_validation = [
  param("shiftId").trim().isMongoId().withMessage(`Invalid shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const find_rider_shifts_validation = [
  param("riderId").trim().isMongoId().withMessage(`Invalid rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const find_my_shifts_validation = [
  body("riderId").trim().isMongoId().withMessage(`Invalid rider ID`),
  body("from")
    .isNumeric()
    .withMessage(`Invalid from time`)
    .custom((value) => {
      if (value < 1) {
        throw new Error(`From value is too small`);
      }
      return true;
    }),
  body("till")
    .isNumeric()
    .withMessage(`Invalid till time`)
    .custom((value, { req }) => {
      if (value < 1) {
        throw new Error(`From till is too small`);
      }
      if (req.body.from > value) {
        throw new Error(`Value of TILL must be greater than FROM`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_list_by_zone_validation = [
  param("zoneId").trim().isMongoId().withMessage(`Invalid zone ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_list_pagination_validation = [
  param("page")
    .trim()
    .isNumeric()
    .withMessage(`Invalid page number`)
    .custom((value) => {
      if (value < 1) {
        throw new Error(`Minimum page number is 1`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_list_by_display_ids = [
  body("displayIds.*")
    .isNumeric()
    .withMessage(`Invalid display id`)
    .custom((value) => {
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const mark_shift_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_detail_validation = [
  param("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_slots_filled_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const activate_shift_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];
export const deactivate_shift_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const create_shift_validation = [
  body("zone").trim().isMongoId().withMessage(`Invalid Zone ID`),
  body("startTime")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) < Date.now() / 1000) {
        throw new Error(`Start time must be in future`);
      }
      return true;
    }),
  body("shiftDuration").trim().isNumeric().withMessage(`Shift duration should be in hours`),
  body("totalSlots")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) < 1) {
        throw new Error(`Slots number must be greater than 0`);
      }
      // let totalSumOfSlotsInBatchDetails = 0;
      // req.body.batchList.map((batch) => {
      //   totalSumOfSlotsInBatchDetails += batch.slots;
      // });
      // if (Number(value) != totalSumOfSlotsInBatchDetails) {
      //   throw new Error(`Sum of all slots in each batch detail of shift exceeds total-Shift-slots`);
      // }
      return true;
    }),
  body("batchList")
    .isArray({ min: 1, max: 6 })
    .withMessage("Provide atleast one batch in batchList of array")
    .custom((value, { req }) => {
      value.map((v, i) => {
        if (Number(v.startDisplayHours) < Number(v.endDisplayHours)) {
          throw new Error(`Display hours must be greater than end display hours`);
        }
      });
      if (Number(value) < 1) {
        throw new Error(`Batch slots must be greater than zero`);
      }
      return true;
    }),
  body("batchList.*.batchId").trim().isMongoId().withMessage("Invalid batchId"),
  body("batchList.*.maxSlots")
    .not()
    .isEmpty()
    .withMessage("Please provide valid slots")
    .custom((value, { req }) => {
      if (Number(value) < 1) {
        throw new Error(`Batch slots must be greater than zero`);
      }
      if (Number(value) > Number(req.body.totalSlots)) {
        const error = new Error(`Shift has batch maxSlots defined more than total slots!`);
        error.statusCode = STATUS_CODE.not_acceptable;
        throw error;
      }
      return true;
    }),
  body("batchList.*.startDisplayHours")
    .not()
    .isEmpty()
    .withMessage("Please provide valid startDisplayHours")
    .custom((value, { req }) => {
      if (Number(value) <= 0) {
        throw new Error(`StartDisplayHours must be greater than zero`);
      }
      return true;
    }),
  body("batchList.*.endDisplayHours").not().isEmpty().withMessage("Please provide valid endDisplayHours"),
  body("batchList")
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      value.map((v, i) => {
        if (v.startDisplayHours == v.endDisplayHours) {
          throw new Error(`StartDisplayHours must not be equal to endDisplayHours`);
        }
      });
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const edit_shift_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Zone ID`),
  body("zone").trim().isMongoId().withMessage(`Invalid Zone ID`),
  body("startTime")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) < Date.now() / 1000) {
        throw new Error(`Start time must be in future`);
      }
      return true;
    }),
  body("shiftDuration").trim().isNumeric().withMessage(`Shift duration should be in hours`),
  body("totalSlots")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) < 1) {
        throw new Error(`Slots number must be greater than 0`);
      }
      // let totalSumOfSlotsInBatchDetails = 0;
      // req.body.batchList.map((batch) => {
      //   totalSumOfSlotsInBatchDetails += batch.slots;
      // });
      // if (Number(value) != totalSumOfSlotsInBatchDetails) {
      //   throw new Error(`Sum of all slots in each batch must be equal to total-Shift-slots`);
      // }
      return true;
    }),
  body("batchList")
    .isArray({ min: 1, max: 6 })
    .withMessage("Provide atleast one batch in batchList of array")
    .custom((value, { req }) => {
      value.map((v, i) => {
        if (Number(v.startDisplayHours) < Number(v.endDisplayHours)) {
          throw new Error(`Display hours must be greater than end display hours`);
        }
      });
      if (Number(value) < 1) {
        throw new Error(`Batch slots must be greater than zero`);
      }
      if (Number(value) > Number(req.body.totalSlots)) {
        const error = new Error(`Shift has batch maxSlots defined more than total slots!`);
        error.statusCode = STATUS_CODE.not_acceptable;
        throw error;
      }
      return true;
    }),
  body("batchList.*.batchId").trim().isMongoId().withMessage("Invalid batchId"),
  body("batchList.*.maxSlots").not().isEmpty().withMessage("Please provide valid slots"),
  body("batchList.*.startDisplayHours").not().isEmpty().withMessage("Please provide valid startDisplayHours"),
  body("batchList.*.endDisplayHours").not().isEmpty().withMessage("Please provide valid endDisplayHours"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const create_bulk_shift_validation = [
  body("*.zone").trim().isMongoId().withMessage("Invalid zone id!"),
  body("*.startTime")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) < Date.now() / 1000) {
        throw new Error(`Start time must be in future`);
      }
      return true;
    }),
  body("*.shiftDuration").trim().isNumeric().withMessage(`Shift duration should be in hours`),
  body("*.totalSlots")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) <= 0) {
        throw new Error(`Total slots number must be greater than 0`);
      }
      return true;
    }),
  body("*.batchList")
    .isArray({ min: 1, max: 6 })
    .withMessage("Provide atleast one batch in batchList of array")
    .custom((batchList, { req }) => {
      let shiftIndex = 0;
      req.body.map((shift, idx) => {
        if (shift.batchList[0] == batchList[0]) {
          shiftIndex = idx;
        }
        shift.batchList.map((val, idx) => {
          if (Number(val.maxSlots) > Number(shift.totalSlots)) {
            const error = new Error(`Shift has batch maxSlots defined more than total slots!`);
            error.statusCode = STATUS_CODE.not_acceptable;
            throw error;
          }
        });
      });
      // let totalSumOfSlotsInBatchDetails = 0;
      // batchList.map((batch) => {
      //   totalSumOfSlotsInBatchDetails += batch.slots;
      // });
      // if (Number(req.body[shiftIndex].totalSlots) < totalSumOfSlotsInBatchDetails) {
      //   throw new Error(`Sum of all slots in each batch detail of shift exceeds total-Shift-slots`);
      // }
      return true;
    }),
  body("*.*.batchList.*.batchId").trim().isMongoId().withMessage("Invalid batch ID"),
  body("*.batchList.*.maxSlots").not().isEmpty().withMessage("Please provide valid slots"),
  body("*.batchList.*.startDisplayHours").not().isEmpty().withMessage("Please provide valid startDisplayHours"),
  body("*.batchList.*.endDisplayHours").not().isEmpty().withMessage("Please provide valid endDisplayHours"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const task_create_validation = [
  body("order_id").trim().isMongoId().withMessage(`Invalid Order ID`),
  body("store_id").trim().isMongoId().withMessage(`Invalid Team ID`),
  body("auto_assignment")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid auto_assignment ID`);
      }
      return true;
    }),
  body("job_description"),
  body("job_pickup_phone").trim().isNumeric().withMessage(`Invalid job_pickup_phone number`),
  body("job_pickup_name").trim().not().isEmpty().withMessage(`Order ID shouldn't be empty`),
  body("order_id").trim().not().isEmpty().withMessage(`job_pickup_name shouldn't be empty`),
  body("job_pickup_email"),
  body("job_pickup_address").trim().not().isEmpty().withMessage(`job_pickup_address shouldn't be empty`),
  body("job_pickup_latitude").trim().isNumeric().withMessage(`job_pickup_latitude is invalid`),
  body("job_pickup_longitude").trim().isNumeric().withMessage(`job_pickup_longitude is invalid`),
  body("job_pickup_datetime").trim().not().isEmpty().withMessage(`job_pickup_datetime shouldn't be empty`),
  body("job_pickup_email"),
  body("customer_phone").trim().not().isEmpty().withMessage(`customer_phone shouldn't be empty`),
  body("customer_username").trim().not().isEmpty().withMessage(`customer_username shouldn't be empty`),
  body("customer_address").trim().not().isEmpty().withMessage(`customer_address shouldn't be empty`),
  body("latitude").trim().not().isEmpty().withMessage(`latitude shouldn't be empty`),
  body("longitude").trim().not().isEmpty().withMessage(`longitude shouldn't be empty`),
  body("job_delivery_datetime").trim().not().isEmpty().withMessage(`job_delivery_datetime shouldn't be empty`),
  body("has_pickup")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid has_pickup ID`);
      }
      return true;
    }),
  body("has_delivery")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid has_delivery`);
      }
      return true;
    }),
  body("meta_data").isArray().withMessage(`meta_data is invalid`),
  body("pickup_custom_field_template").trim().not().isEmpty().withMessage(`pickup_custom_field_template shouldn't be empty`),
  body("pickup_meta_data").isArray().withMessage(`pickup_meta_data shouldn't be empty`),
  body("fleet_id"),
  body("p_ref_images").isArray(),
  body("ref_images").isArray(),
  body("notify").trim().isNumeric().withMessage(`timezone shouldn't be empty`),
  body("tags"),
  body("geofence").trim().isNumeric().withMessage(`geofence shouldn't be empty`),
  body("ride_type")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid ride_type`);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const filter_by_date_range = [
  body("from")
    .trim()
    .isNumeric()
    .custom(async (value, { req }) => {
      if (value < 1) {
        throw new Error(`Invalid FROM value`);
      }
      return true;
    }),
  body("till")
    .trim()
    .isNumeric()
    .custom(async (value, { req }) => {
      if (value < 1) {
        throw new Error(`Invalid TILL value`);
      }
      if (Number(req.body.from) > value) {
        throw new Error(`Filter from value must be greater than filter till value`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const pay_out_create_validation = [
  body("store_id")
    .trim()
    .isNumeric()
    .custom(async (value, { req }) => {
      let stores = await K2commerceService.fetchStores();
    }),
  body("data.*.perOrder").isFloat({ min: 1 }).withMessage(`Per Order amount must be greater than 0`),
  body("data.*.perKilometre").isFloat({ min: 1 }).withMessage(`Per Kilometre amount must be greater than 0`),
  body("data.*.perHour").isFloat({ min: 1 }).withMessage(`Guarantee per Hour amount must be greater than 0`),
  body("data.*.batch.*").custom((value, { req }) => {
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_batch_import_validation = [
  body("*.riderId").trim().not().isEmpty().withMessage(`Invalid rider display ID`),
  body("riderId").custom(async (value, { req }) => {
    const riderIds = req.body.map((item) => item.riderId);
    const batchLevel = req.body.map((item) => item.batchLevel);
    batchLevel.filter((item) => {
      if (item > 6 || item < 1) {
        throw new Error(`Batch Level should not be greater than six and less than 1`);
      }
    });
    if (new Set(riderIds).size !== riderIds.length) {
      throw new Error(`Duplicate Rider ids found!`);
    } else {
      const riders = await riderService.findByRiderIds(riderIds);
      if (riders.data.length != riderIds.length) {
        throw new Error(`Invalid rider ids found!`);
      }
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const zone_riders_validation = [
  param("zoneId")
    .trim()
    .not()
    .isEmpty()
    .isMongoId()
    .withMessage(`Invalid Zone ID`)
    .custom(async (zoneId) => {
      let zone = await zoneService.findById(zoneId);
      if (!zone.data) {
        throw Error("Invalid zone ID");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const assign_task_rider_validation = [
  body("riderId")
    .isMongoId()
    .trim()
    .not()
    .isEmpty()
    .withMessage(`riderId field required`)
    .custom(async (riderId) => {
      let rider = await riderService.findById(riderId);
      if (!rider.data) {
        throw Error("Invalid rider id");
      } 
      else {
        if (rider.data.status !== RIDER_STATUSES.ALL_STATUS.available ) {
          throw Error(`Rider is on ${rider.data.status}`);
        }
        let riderShifts = await riderShiftService.findRiderOngoingShifts(riderId);
        if(riderShifts.data.length > 0) {
          riderShifts.data.map((v,i) => {
            if(v.shiftId) {
              const endTime = convertUnixToDateTime(v.shiftId.endTime);
              const currentDateTime = moment();
              const timeLeft = endTime.diff(currentDateTime);
              if (timeLeft <= APP_CONSTANT.SHIFT_END_TIME_VALIDATION) {
                throw Error(`Rider doesn't have valid shift`);
              }
            }
          });
        }
        else {
          throw Error(`Rider doesn't have valid shift`);
        }
      }
      return true;
    }),
  body("taskId")
    .trim()
    .isMongoId()
    .not()
    .isEmpty()
    .withMessage(`taskId field required`)
    .custom(async (taskId, { req }) => {
      let task = await taskService.findById(taskId);
      let riderId = req.body.riderId;
      if (!task.data) {
        throw Error("Invalid Task id");
      } else {
        let record = await taskAssignmentService.findByRiderTaskId(riderId, taskId);
        if (record && record.data) {
          record.data.status.filter(function (status) {
            if (status.log.slug !== TASK_ASSIGNMENT_STATUS.declined.slug || status.log.slug !== TASK_ASSIGNMENT_STATUS.removed.slug) {
              throw Error("Request already exist!");
            }
          });
        }
        let riderTasks = await taskAssignmentService.findRiderAssignmentActiveRequests(riderId);
        if (riderTasks.data.length >= APP_CONSTANT.RIDER_TASK_LIMIT) {
          throw Error("Rider already has enough tasks to deliver!");
        }
        // THIS VALIDATION WILL BE ENABLED WHEN MULTIPLE ZONE ASSIGNMENT TO RIDER IS FUNCTIONAL
        // VALIDATES IF RIDER ASSIGNED ZONE IS SAME AS ORDER'S ZONE
      
        // const riderZones = record.data.rider_id?.zone;
        // if (!riderZones || riderZones.length < 1) {
        //   throw Error("Rider has currently no zone assigned!");
        // } else {
        //   let storeDetail = await storeService.findByStoreId(record.data.task_id.store_id);
        //   riderZones.map((zoneId, i) => {
        //     let zoneDoesMatch = false;
        //     if (String(zoneId) === String(storeDetail.zoneId)) {
        //       zoneDoesMatch = true;
        //     }
        //     if (riderZones.length == i + 1 && !zoneDoesMatch) {
        //       throw Error("Rider zone doesn't belong to this order!");
        //     }
        //   });
        // }
      }
      return true;
    }),
  body("reason").trim().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const force_assign_task_rider_validation = [
  body("riderId")
    .isMongoId()
    .trim()
    .not()
    .isEmpty()
    .withMessage(`riderId field required`)
    .custom(async (riderId) => {
      let rider = await riderService.findById(riderId);
      if (!rider.data) {
        throw Error("Invalid rider id");
      } else {
        if (rider.data.status !== RIDER_STATUSES.ALL_STATUS.available) {
          throw Error(`Rider is ${rider.data.status}`);
        }
        let riderShifts = await riderShiftService.findRiderShifts(riderId);
        const shifts = pluck(riderShifts.data, "shiftId");
        shifts.map(function (shift) {
          if (shift) {
            const startTime = convertUnixToDateTime(shift.startTime);
            const endTime = convertUnixToDateTime(shift.endTime);
            const currentDateTime = moment();
            if (currentDateTime >= startTime && currentDateTime < endTime && shift.isActive == 1) {
              const timeLeft = endTime.diff(currentDateTime);
              if (timeLeft <= APP_CONSTANT.SHIFT_END_TIME_VALIDATION) {
                throw Error(`Rider does'nt have valid shift`);
              }
            } else {
              throw Error(`Rider does'nt have valid shift`);
            }
            return true;
          } else {
            throw Error(`Rider does'nt have valid shift`);
          }
        });
      }
      return true;
    }),
  body("taskId")
    .trim()
    .isMongoId()
    .not()
    .isEmpty()
    .withMessage(`taskId field required`)
    .custom(async (taskId, { req }) => {
      let task = await taskService.findById(taskId);
      let riderId = req.body.riderId;
      if (!task.data) {
        throw Error("Invalid Task id");
      } else {
        if (task.data.rider && task.data.rider.id == riderId) {
          throw Error("Task is already assigned to this rider!");
        }
        let riderTasks = await taskAssignmentService.findRiderAssignmentActiveRequests(riderId);
        if (riderTasks.data.length >= APP_CONSTANT.RIDER_TASK_LIMIT) {
          throw Error("Rider already has enough tasks to deliver!");
        }
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const mark_task_status_validation = [
  body("status")
    .isMongoId()
    .trim()
    .not()
    .isEmpty()
    .withMessage(`status field required`)
    .custom(async (status, {req}) => {
      let resp = await taskStatusService.findById(status);
      if (!resp.data) {
        throw Error("Invalid status id");
      }
      else {
        req.body.taskStatus = resp.data;
      }
      return true;
    }),
  body("taskId")
    .trim()
    .isMongoId()
    .not()
    .isEmpty()
    .withMessage(`taskId field required`)
    .custom(async (taskId, { req }) => {
      let task = await taskService.findById(taskId);
      let statusId = req.body.status;
      if (!task.data) {
        throw Error("Invalid Task id");
      } else {
        const taskStatus = await taskStatusService.findById(statusId);
        task.data.status.map((v, i) => {
          if (v.status_logs) {
            let currentStatus = v.status_logs._id.toString();
            statusId = statusId.toString();
            if (currentStatus === statusId) {
              throw new Error(`Task is already ${taskStatus.data.title}`);
            }
          }
        });
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const rider_create_validation = [
  body("fullName").trim().not().isEmpty(),
  check("profileImage").custom((val, { req }) => {
    if (!req.files.profileImage) {
      throw new Error(`profile-image field is required`);
    }
    return true;
  }),
  check("cnicFront").custom((val, { req }) => {
    if (!req.files.cnicFront) {
      throw new Error(`cnic-front field is required`);
    }
    return true;
  }),
  check("cnicBack").custom((val, { req }) => {
    if (!req.files.cnicBack) {
      throw new Error(`cnic-Back field is required`);
    }
    return true;
  }),
  check("licenseFront").custom((val, { req }) => {
    if (!req.files.licenseFront) {
      throw new Error(`license-front field is required`);
    }
    return true;
  }),
  check("licenseBack").custom((val, { req }) => {
    if (!req.files.licenseBack) {
      throw new Error(`license-back field is required`);
    }
    return true;
  }),
  check("bill").custom((val, { req }) => {
    if (!req.files.bill) {
      throw new Error(`bill field is required`);
    }
    return true;
  }),
  body("phoneNumber")
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage("Correct phone format is (+923...)")
    .custom(async (val, { req }) => {
      await validateNumberAlreadyRegistered(val);
      return true;
    }),
  body("cnic")
    .trim()
    .isNumeric()
    .isLength({ min: 13, max: 13 })
    .withMessage("Cnic number should be of 13 numeric characters")
    .custom(async (val, { req }) => {
      await validateCnicAlreadyRegistered(val);
      return true;
    }),
  body("vehicle").trim().not().isEmpty().withMessage("Please select a vehicle"),
  body("city").trim().not().isEmpty().withMessage("Please select a city"),
  body("email")
    .isEmail()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email field is required")
    .custom(async (value) => {
      await validateEmailAlreadyRegistered(value);
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const create_zone_validation = [
  body("zoneName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Invalid zone name")
    .custom(async (value) => {
      let response = await zoneService.findByName(value);
      if (response.data) {
        throw new Error(`Zone with current name already exist`);
      }
      return true;
    }),
  body("startPoint").isObject().withMessage("Invalid zone start point!"),
  body("startPoint.latitude").trim().not().isEmpty().withMessage("Invalid starting point latitide!"),
  body("startPoint.longitude").trim().not().isEmpty().withMessage("Invalid starting point longitude!"),
  body("batchList.*.batchId").isMongoId().withMessage("Invalid batchId"),
  body("polygons.*.latitude").not().isEmpty().withMessage("Invalid polygon latitude!"),
  body("polygons.*.longitude").not().isEmpty().withMessage("Invalid polygon longitude!"),
  body("polygons")
    .isArray()
    .withMessage("Invalid polygons!")
    .custom((value, { req }) => {
      const uniquePolygons = [];
      [...value].map((coordinate, idx) => {
        if (idx == 0) {
          uniquePolygons.push(coordinate);
        } else {
          if (idx > 0) {
            uniquePolygons.map((existingCoordinate, i) => {
              if (existingCoordinate.latitude === coordinate.latitude && existingCoordinate.longitude === coordinate.longitude) {
                throw new Error(`Duplicate coordinates of polygon are not allowed! ${i}`);
              }
            });
          }
        }
      });
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_zone_validation = [
  body("zoneId")
    .trim()
    .isMongoId()
    .withMessage("Invalid zone ID")
    .custom(async (value, { req }) => {
      await zoneService.findById(value);
      return true;
    }),
  body("zoneName").trim().not().isEmpty().withMessage("Invalid zone name"),
  body("startPoint").isObject().withMessage("Invalid zone start point!"),
  body("startPoint.latitude").trim().not().isEmpty().withMessage("Invalid starting point latitide!"),
  body("startPoint.longitude").trim().not().isEmpty().withMessage("Invalid starting point longitude!"),
  body("polygons.*.latitude").trim().not().isEmpty().withMessage("Invalid polygon latitude!"),
  body("polygons.*.longitude").trim().not().isEmpty().withMessage("Invalid polygon longitude!"),
  body("polygons")
    .isArray()
    .withMessage("Invalid polygons!")
    .custom((value, { req }) => {
      const uniquePolygons = [];
      [...value].map((coordinate, idx) => {
        if (idx == 0) {
          uniquePolygons.push(coordinate);
        } else {
          if (idx > 0) {
            uniquePolygons.map((existingCoordinate) => {
              if (existingCoordinate.latitude === coordinate.latitude && existingCoordinate.longitude === coordinate.longitude) {
                throw new Error(`Duplicate coordinates of polygon are not allowed!`);
              }
            });
          }
        }
      });
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const findOne_zone_validation = [
  param("zoneId")
    .exists()
    .trim()
    .isMongoId()
    .withMessage(`Invalid Zone ID`)
    .custom(async (zoneId) => {
      let zone = await zoneService.findById(zoneId);
      if (!zone.data) {
        throw Error("Invalid zone ID");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const task_update_validation = [
  param("taskId")
    .exists()
    .isMongoId()
    .withMessage(`Invalid Task ID`)
    .custom(async (value) => {
      const task = await taskService.findById(value);
      if (task.data.length < 1) {
        throw new Error(`Task not found!`);
      }
      return true;
    }),
  body("pickup.phone").trim().isNumeric().withMessage(`pickup phone field is required`),
  body("pickup.address").trim().not().isEmpty().withMessage(`pickup address field is required`),
  body("pickup.latitude").trim().not().isEmpty().withMessage(`pickup latitude field is required`),
  body("pickup.longitude").trim().not().isEmpty().withMessage(`pickup longitude field is required`),
  body("pickup.datetime")
    .trim()
    .not()
    .isEmpty()
    .isISO8601()
    .toDate()
    .withMessage(`pickup datetime field is required & must be in right format`)
    .custom(async (value, { req }) => {
      let timezone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timezone);
      let deliveryDateTime = moment(req.body.delivery.datetime).utcOffset(timezone);
      let pickupDateTime = moment(value).utcOffset(timezone);
      if (currentDate.isSameOrAfter(pickupDateTime) || pickupDateTime.isSameOrAfter(deliveryDateTime)) {
        throw "Pickup datetime must be greater than current datetime and less than delivery date time";
      }
      return true;
    }),
  body("delivery.phone").trim().isNumeric().withMessage(`delivery phone field is required`),
  body("delivery.email"),
  body("delivery.username").trim(),
  body("delivery.address").trim().not().isEmpty().withMessage(`delivery address field is required`),
  body("delivery.latitude").trim().not().isEmpty().withMessage(`delivery latitude field is required`),
  body("delivery.longitude").trim().not().isEmpty().withMessage(`delivery longitude field is required`),
  body("delivery.datetime")
    .trim()
    .not()
    .isEmpty()
    .isISO8601()
    .toDate()
    .withMessage(`delivery datetime field is required & must be in right format`)
    .custom(async (value, { req }) => {
      let timezone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timezone);
      let pickupDateTime = moment(req.body.pickup.datetime).utcOffset(timezone);
      let deliveryDateTime = moment(value).utcOffset(timezone);
      if (currentDate.isSameOrAfter(deliveryDateTime) || deliveryDateTime.isSameOrBefore(pickupDateTime)) {
        throw "Delivery datetime must be greater than current date time and pickup date time";
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const wallet_stacking_validation = [
  body().custom(async (values) => {
    let batches = values.map((data) => data.batch);
    let records = await batchService.findByIds(batches);
    if (records.data.length !== batches.length) {
      throw new Error(`Invalid batch ids found!`);
    }
    if (new Set(batches).size !== batches.length) {
      throw new Error(`Duplicate batch ids found!`);
    }
  }),
  body("*.batch")
    .exists()
    .trim()
    .isMongoId()
    .withMessage(`Invalid batch id`)
    .custom(async (value) => {
      const batch = await batchService.findById(value);
      if (!batch.data) {
        throw new Error("Invalid Batch Id");
      }
    }),
  body("*.cash_limit").notEmpty().isInt({ min: 1 }),
  body("*.order_value_limit").notEmpty().isInt({ min: 1 }),
  body("*.stacking_limit").notEmpty().isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    errors.errors.map((v, i) => {
      if (v.param == null || v.param == "") {
        v.param = "batch";
      }
    });
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_rider_validation = [
  param("riderId")
    .exists()
    .isMongoId()
    .withMessage(`Invalid Rider ID`)
    .custom(async (value, {req}) => {
      let next_of_kin = { name: "", relation: "", number: "", cnic: "" };
      let payment = { jazz_cash: "", easy_paisa: "", hbl: "", bank_account: "", atm_status: "" };
      let equipment = {
        handoverdate: "",
        delivery_bag: "",
        t_shirt_count: "",
        rain_coats: "",
        rain_jackets: "",
        caps: "",
        shirt_status: "",
        winter_jackets: "",
        hand_over_date: "",
        returning_date: "",
      };
      let newObject = { next_of_kin, payment, equipment };
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      Object.keys(req.body).map((v, i) => {
        if (!v.split(".")[1]) {
          newObject = { ...newObject, [`${v}`]: values[i] };
        } else {
          newObject[`${v.split(".")[0]}`][`${v.split(".")[1]}`] = values[i];
        }
      });
      req.body = newObject;
      const rider = await riderService.findById(value);
      if (!rider.data) {
        throw new Error(`Rider not found!`);
      }
      return true;
    }),
  body("fullName").trim().not().isEmpty(),
  body("dob")
    .trim()
    .not()
    .isEmpty()
    .toDate()
    .withMessage(`date of birth field is required & must be in right format`)
    .custom(async (value) => {
      let timezone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timezone);
      let dob = moment(value).utcOffset(timezone);
      let years = currentDate.diff(dob, "year");
      if (currentDate.isSameOrBefore(dob) && years < 18) {
        throw "date of birth must be greater than current date time and rider's age must be greater than 18";
      }
      return true;
    }),
  body("email")
    .isEmail()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email field is required")
    .custom(async (value, { req }) => {
      let riderId = mongoose.Types.ObjectId(req.params.riderId);
      await validateEmailAlreadyRegisteredExceptId(riderId, value);
      return true;
    }),
  body("phoneNumber")
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage("Correct phone format is (+923...)")
    .custom(async (val, { req }) => {
      let riderId = mongoose.Types.ObjectId(req.params.riderId);
      await validateNumberAlreadyRegisteredExceptId(riderId, val);
      return true;
    }),
  body("cnic")
    .trim()
    .isNumeric()
    .isLength({ min: 13, max: 13 })
    .withMessage("Cnic number should be of 13 numeric characters")
    .custom(async (val, { req }) => {
      let riderId = mongoose.Types.ObjectId(req.params.riderId);
      await validateCnicAlreadyRegisteredExceptId(riderId, val);
      return true;
    }),
  body("cnic_issue_date")
    .trim()
    .not()
    .isEmpty()
    .isISO8601()
    .toDate()
    .withMessage(`CNIC issue date field is required & must be in right format`)
    .custom(async (value, { req }) => {
      let timezone = APP_CONSTANT.DEFAULT_TIME_ZONE;
      let currentDate = moment().utcOffset(timezone);
      let issueDate = moment(value).utcOffset(timezone);
      if (currentDate.isBefore(issueDate)) {
        throw "CNIC issue date must not be greater than current date time";
      }
      return true;
    }),
  body("marital_status").trim().not().isEmpty().withMessage("Marital Status field is required"),
  body("next_of_kin.name").trim().not().isEmpty().withMessage("Next of kin name field is required"),
  body("next_of_kin.relation").trim().not().isEmpty().withMessage("Next of kin relation field is required"),
  body("next_of_kin.number")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 13, max: 13 })
    .withMessage("Next of kin number field is required and should be of 13 numeric characters"),
  body("next_of_kin.cnic")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 13, max: 13 })
    .withMessage("Next of kin cnic field is required and should be of 13 numeric characters"),
  body("payment").custom((val, { req }) => {
    let valCount = 0;
    if (!val) {
      throw new Error(`please add atleast one payment method`);
    }
    Object.values(val).filter((v, i) => {
      if (v == null || v == "") {
        valCount++;
      }
    });
    if (valCount > 3) {
      throw new Error(`please add atleast one payment method`);
    }
    return true;
  }),
  body("equipment.hand_over_date")
    .trim()
    .isISO8601()
    .toDate()
    .optional({ nullable: true, checkFalsy: true })
    .withMessage("Hand over date field is required & should be in valid date format"),
  body("equipment.returning_date").trim().isISO8601().toDate().optional({ nullable: true, checkFalsy: true }),
  body("equipment.delivery_bag").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment delivery bag field is required"),
  body("equipment.t_shirt_count").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment t-shirt count field is required"),
  body("equipment.rain_coats").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment rain coats field is required"),
  body("equipment.rain_jackets").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment rain jackets field is required"),
  body("equipment.caps").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment caps field is required"),
  body("equipment.shirt_status").trim().not().isEmpty().withMessage("Equipment shirt status field is required"),
  body("equipment.winter_jackets").trim().not().isEmpty().isNumeric().isLength({ min: 0 }).withMessage("Equipment winter jackets field is required"),
  check("profileImage").if(body('profileImage').exists()).custom((val, { req }) => {
    if (!req.files.profileImage) {
      throw new Error(`profile-image field is required`);
    }
    return true;
  }),
  check("cnicFront").if(body('cnicFront').exists()).custom((val, { req }) => {
    if (!req.files.cnicFront) {
      throw new Error(`Cnic Front field is required`);
    }
    return true;
  }),
  check("cnicBack").if(body('cnicBack').exists()).custom((val, { req }) => {
    if (!req.files.cnicBack) {
      throw new Error(`Cnic Back field is required`);
    }
    return true;
  }),
  check("licenseFront").if(body('licenseFront').exists()).custom((val, { req }) => {
    if (!req.files.licenseFront) {
      throw new Error(`License Front field is required`);
    }
    return true;
  }),
  check("licenseBack").if(body('licenseBack').exists()).custom((val, { req }) => {
    if (!req.files.licenseBack) {
      throw new Error(`License Back field is required`);
    }
    return true;
  }),
  check("bill").if(body('bill').exists()).custom((val, { req }) => {
    if (!req.files.bill) {
      throw new Error(`bill field is required`);
    }
    return true;
  }),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("status field is required")
    .custom((value) => {
      if (!Object.values(RIDER_STATUSES.ALL_STATUS).includes(value)) {
        throw new Error(`invalid status`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const task_issue_create_validation = [
  body("orderId")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`Order id field is required`)
    .custom(async (value, { req }) => {
      const task = await taskService.findByOrderId(value);
      if (!task.data || task.data.length < 1) {
        throw new Error(`Invalid Order id`);
      } 
      
      else {
        task.data.map((v, i) => {
          if (v.type == APP_CONSTANT.TASK_TYPES.delivery) {
            req.body.task = v;
          }
        });
      }
      if(!req.body.task.rider ) {
        throw new Error(`Unable to create issue task is not assigned to any rider`);
      }
      return true;
    }),
  body("reason").trim().not().isEmpty().withMessage(`reason field is required`),
  body("type").trim().not().isEmpty().withMessage(`type field is required`),
  body("amount")
    .not()
    .isEmpty()
    .isNumeric({ min: 0 })
    .withMessage(`amount field is required`)
    .custom(async (value, { req }) => {
      if (value <= 0) {
        throw new Error(`Amount must be greater than zero`);
      }
      if (req.body.task && value > req.body.task.order_details.total_amount) {
        throw new Error(`Amount must not be greater than order total amount`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const task_issue_approval_validation = [
  param("issueId").exists().isMongoId().withMessage(`Invalid Issue ID`).custom(async (value) => {
    const taskIssue = await TaskIssueService.findOne(value);
    if (!taskIssue.data) {
      throw new Error(`Task issue not found!`);
    } else {
      if(taskIssue.data.is_approved == true) {
        throw new Error(`Issue is already approved`)
      }
      if(taskIssue.data.updatedBy && taskIssue.data.updatedTime && taskIssue.data.is_approved == false) {
        throw new Error(`Issue is rejected by ${taskIssue.data.updatedBy}`)
      }
    }
    return true;
  }),
  param("status").trim().not().isEmpty().withMessage(`status is required`).custom((value) => {
    const issueStatus = ['approve', 'reject'];
    if(!issueStatus.includes(value)) {
      throw new Error(`invalid issue status`);
    } 
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const remove_rider_validation = [
  param('taskId').exists().isMongoId().withMessage(`Invalid Task ID`) .custom(async (value, {req}) => {
    const task = await taskService.findById(value);
    if (!task.data) {
      throw new Error(`Task not found!`);
    } else {
      if(!task.data.rider) {
        throw new Error(`Task is not assigned to any rider`)
      }
    }
    req.body.task = task.data;
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
]

export const remove_rider_from_shift_validation = [
  body("shiftId")
    .isMongoId()
    .withMessage(`Invalid Shift ID`)
    .custom(async (value, { req }) => {
      const { riderId } = req.body;
      const riderShift = await riderShiftService.findByRiderIdShiftId(riderId,value)
      if(!riderShift.data) {
        throw new Error('Shift is not assigned to this rider');
      }
      return true;
    }),
  body("riderId").isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

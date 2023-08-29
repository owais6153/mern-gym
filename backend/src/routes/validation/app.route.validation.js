import { body, check, validationResult, param } from "express-validator";
import PaymentMethodService from "../../services/app/payment.method.service.js";
import TaskService from "../../services/app/task.service.js";
import K2commerceService from "../../services/external/k2commerce.service.js";
import taskAssignmentService from "../../services/app/task.assign.service.js";
import taskStatusService from "../../services/app/task.status.service.js";
import { TASK_ASSIGNMENT_STATUS } from "../../utils/rider.assignment.status.slug.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import { createError } from "../../utils/helper.js";
import moment from "moment";
import AuthService from "../../services/app/auth.service.js";
import RiderService from "../../services/web/rider.service.js";

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

export const register_validation = [
  body("fullName").trim().not().isEmpty().withMessage("Invalid full name"),
  check("profileImage").custom((val, { req }) => {
    if (!req.files.profileImage) {
      throw new Error(`profile-image must be provided`);
    }
    return true;
  }),
  check("cnicFront").custom((val, { req }) => {
    if (!req.files.cnicFront) {
      throw new Error(`cnic-front must be provided`);
    }
    return true;
  }),
  check("cnicBack").custom((val, { req }) => {
    if (!req.files.cnicBack) {
      throw new Error(`cnic-Back must be provided`);
    }
    return true;
  }),
  check("licenseFront").custom((val, { req }) => {
    if (!req.files.licenseFront) {
      throw new Error(`license-front must be provided`);
    }
    return true;
  }),
  check("licenseBack").custom((val, { req }) => {
    if (!req.files.licenseBack) {
      throw new Error(`license-back must be provided`);
    }
    return true;
  }),
  check("bill").custom((val, { req }) => {
    if (!req.files.bill) {
      throw new Error(`bill must be provided`);
    }
    return true;
  }),
  body("phoneNumber").trim().isLength({ min: 13, max: 13 }).withMessage("Correct phone format is (+923...)"),
  // body("email").isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
  body("cnic").trim().isNumeric().isLength({ min: 13, max: 13 }).withMessage("Cnic number should be of 13 numeric characters")
  .custom((cnic) => {
    if (isNaN(cnic)) {
      throw new Error(`Invalid cnic number!`);
    }
    return true;
  }),
  body("vehicle").trim().not().isEmpty().withMessage("Please select a vehicle"),
  body("city").trim().not().isEmpty().withMessage("Please select a city"),
  body("deviceType").trim().not().isEmpty().withMessage("Please provide device type"),
  body("deviceType").custom((value, { req }) => {
    if (value !== "android") {
      throw new Error(`Only android device type is allowed currently`);
    }
    return true;
  }),
  body("deviceId").trim().not().isEmpty().withMessage("Please provide device ID"),
  (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const register_phone_validation = [
  body("phoneNumber")
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage("Correct phone format is (+923...)")
    .custom((phoneNumber) => {
      function containsOnlyNumbers(str) {
        return /^\d+$/.test(str);
      }
      if (phoneNumber.slice(0, 1) !== "+") {
        throw new Error(`Correct phone format is (+923...)`);
      }
      if (containsOnlyNumbers(phoneNumber.slice(1, 13)) === false) {
        throw new Error(`Phone number should be numeric`);
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

export const send_sms_validation = [
  body("recipientNumber").trim().isLength({ min: 13 }).withMessage("Please enter phone in format +923..."),
  body("message").trim().isLength({ min: 5 }).withMessage("message should be of atleast 5 characters"),
  body("smsType")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (value != 0 || value != 1) {
        throw new Error(`Sms type can be "0" or "1" only`);
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

export const send_otp_validation = [
  body("recipent").trim().isLength({ min: 13, max: 13 }).withMessage("Correct phone format is (+923...)"),
  body("service")
    .trim()
    .custom((value, { req }) => {
      if (value == "eocean") {
        throw new Error(`Currently eocean is not available, this is a temporary msg during development`);
      }
      if (value !== "eocean" && value !== "twilio") {
        throw new Error(`Only available services are eocean & twilio`);
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

export const verify_otp_validation = [
  body("otpCode").trim().not().isEmpty().withMessage("Invalid empty otp code"),
  body("otpCode").isString().isLength({ min: 4, max: 4 }).withMessage("Otp length must be 6 characters"),
  body("phoneNumber").trim().isLength({ min: 13, max: 13 }).withMessage("Correct phone format is (+923...)"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const task_create_validation = [
  body("order_id")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`order Id field is required`)
    .custom(async (value, { req }) => {
      const task = await TaskService.findByOrderId(value);
      if (task.data.length > 0) {
        throw new Error(`Order already exist!`);
      }
      return true;
    }),
  body("store_id")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`store id field is required`)
    .custom(async (value, { req }) => {
      let stores = await K2commerceService.fetchStores();
      if (!stores) {
        throw new Error(`Couldn't fetch stores from redis`);
      }
      let store = stores.find((store) => store.id == value);
      if (!store) {
        throw new Error(`Invalid store id`);
      }
      return true;
    }),
  body("auto_assignment")
    .trim()
    .isNumeric()
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid auto_assignment ID`);
      }
      return true;
    }),
  body("description").trim(),
  body("timezone").trim().not().isEmpty().isNumeric().withMessage(`timezone field is required`),
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
      let timezone = req.body.timezone;
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
      let timezone = req.body.timezone;
      let currentDate = moment().utcOffset(timezone);
      let pickupDateTime = moment(req.body.pickup.datetime).utcOffset(timezone);
      let deliveryDateTime = moment(value).utcOffset(timezone);
      if (currentDate.isSameOrAfter(deliveryDateTime) || deliveryDateTime.isSameOrBefore(pickupDateTime)) {
        throw "Delivery datetime must be greater than current date time and pickup date time";
      }
      return true;
    }),
  body("has_pickup")
    .trim()
    .isNumeric({ min: 0, max: 1 })
    .custom((value, { req }) => {
      if (req.body.has_delivery == 0 && req.body.has_pickup == 0) {
        throw new Error(`The order must be pickup or delivery or both`);
      }
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid has_pickup ID`);
      }
      return true;
    }),
  body("has_delivery")
    .trim()
    .isNumeric({ min: 0, max: 1 })
    .custom((value, { req }) => {
      if (Number(value) > 1 || Number(value) < 0) {
        throw new Error(`Invalid has_delivery`);
      }
      return true;
    }),
  body("order_details.order_items").isArray(),
  body("order_details.order_items.*.name").trim().not().isEmpty().withMessage(`product name  field is required`),
  body("order_details.order_items.*.quantity").isNumeric({ min: 1 }).not().isEmpty().withMessage(`product quantity field is required`),
  body("order_details.order_items.*.image").trim().not().isEmpty().withMessage(`product image field is required`),
  body("order_details.order_items.*.price").isNumeric({ min: 0 }).not().isEmpty().withMessage(`product price field is required`),
  body("order_details.delivery_charges").isNumeric({ min: 0 }).not().isEmpty().withMessage(`delivery charges field is required`),
  body("order_details.discount").isNumeric({ min: 0 }).not().isEmpty().withMessage(`discount field is required`),
  body("order_details.sub_total").isNumeric({ min: 0 }).not().isEmpty().withMessage(`sub total field is required`),
  body("order_details.total_amount").isNumeric({ min: 0 }).not().isEmpty().withMessage(`total amount field is required`),
  body("order_details.special_instructions"),
  body("order_details.payment_type")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`Payment Type field is required`)
    .custom(async (value, { req }) => {
      const paymentMethod = await PaymentMethodService.findBySlug(value);
      if (!paymentMethod.data) {
        throw new Error(`Invalid payment type`);
      }
      return true;
    }),
  body("order_details.tip").trim().isNumeric().not().isEmpty().withMessage(`tip field is required`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const update_task_status_validation = [
  body("taskId")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`order Id field is required`)
    .custom(async (v, { req }) => {
      const task = await TaskService.findById(value);
      if (!task.data) {
        throw new Error(`Invalid task id`);
      }
      return true;
    }),
  body("status")
    .trim()
    .not()
    .isEmpty()
    .custom(async (v) => {
      const status = await taskStatusService.findBySlug(status);
      if (!status.data) {
        throw new Error(`Invalid status`);
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

export const assign_shift_to_rider_validation = [
  body("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];
export const check_assign_request = [
  body('lat').isNumeric().withMessage('Invalid latitude!'),
  body('lon').isNumeric().withMessage('Invalid longitude!'),
  body("taskId")
    .trim()
    .isMongoId()
    .withMessage(`Invalid Task ID`)
    .custom(async (value, { req }) => {
      const riderId = req.body.riderId;
      const taskRequest = await taskAssignmentService.findByRiderTaskId(riderId, value);
      console.log('taskRequest => ', taskRequest);
      if (!taskRequest.data) {
        throw new Error(`No assignment request exists!`);
      } else {
        taskRequest.data.status.map(function (val) {
          if (val.active == true && val.log.slug !== TASK_ASSIGNMENT_STATUS.unassigned.slug) {
            throw new Error(`Task is already ${val.log.title}`);
          }
        });
      }
      return true;
    }),
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const check_reject_request = [
  body("taskId")
    .trim()
    .isMongoId()
    .withMessage(`Invalid Task ID`)
    .custom(async (value, { req }) => {
      const riderId = req.body.riderId;
      const taskRequest = await taskAssignmentService.findByRiderTaskId(riderId, value);
      if (!taskRequest.data) {
        throw new Error(`No assignment request exists!`);
      } else {
        taskRequest.data.status.map(function (val) {
          if (val.active == true && val.log.slug !== TASK_ASSIGNMENT_STATUS.unassigned.slug) {
            throw new Error(`Task is already ${val.log.title}`);
          }
        });
      }
      return true;
    }),
  body("riderId").trim().isMongoId().withMessage(`Invalid Rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const check_arrived_request = [
  body('lat').isNumeric().withMessage('Invalid latitude!'),
  body('lon').isNumeric().withMessage('Invalid longitude!'),
  body("riderId").isMongoId().withMessage(`Invalid Rider ID`),
  body("taskId").isMongoId()
  .withMessage(`Invalid Task ID`)
  .custom(async (value, { req }) => {
    const riderId = req.body.riderId;
    const taskRequest = await taskAssignmentService.findByRiderTaskId(riderId, value);
      if (!taskRequest.data) {
        throw new Error(`Assigned task does not exists!`);
      } else {
        taskRequest.data.status.map(function (val) {
          if (val.active == true && val.log.slug == TASK_ASSIGNMENT_STATUS.arrived.slug) {
            throw new Error(`Task was already marked arrived!`);
          }
          if (val.active == true && val.log.slug !== TASK_ASSIGNMENT_STATUS.accepted.slug) {
            throw new Error(`This task wasn't accepted by rider!`);
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

export const check_pickup_request = [
  body("zoneIds")
    .custom((value, { req }) => {
      if (value.length < 1) {
        throw new Error(`There should be atleast one zoneId in request`);
      }
      return true;
    }),
  body("date").exists().withMessage(`date key not found in request`),
  body("zoneIds.*").trim().isMongoId().withMessage("Invalid zone ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_list_by_zone_ids_validation = [
  body("zoneIds")
    .custom((value, { req }) => {
      if (value.length < 1) {
        throw new Error(`There should be atleast one zoneId in request`);
      }
      return true;
    }),
  body("date").exists().withMessage(`date key not found in request`),
  body("zoneIds.*").trim().isMongoId().withMessage("Invalid zone ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

export const shift_list_by_rider_zone_ids_validation = [
  body("date").exists().withMessage(`date key not found in request`),
  body("riderId").trim().isMongoId().withMessage("Invalid rider ID").custom(async(riderId) => {
    const riderExist = await RiderService.findById(riderId)
    if (!riderExist.data) {
      throw new Error(`Invalid rider id`);
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

export const rider_id_param_validation = [
  // export const shift_list_by_rider_id_validation = [
  param("riderId").trim().isMongoId().withMessage(`Invalid rider ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];
export const tasks_by_order_id_validation = [
  param("orderId").trim().not().isEmpty().withMessage(`Invalid order ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];
export const shift_id_param_validation = [
  // export const shift_detail_validation = [
  param("shiftId").trim().isMongoId().withMessage(`Invalid Shift ID`),
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
      const task = await TaskService.findByOrderId(value);
      if (!task.data) {
        throw new Error(`Invalid Order id`);
      } else {
        task.data.map((v, i) => {
          if (v.type == APP_CONSTANT.TASK_TYPES.delivery) {
            req.body.task = v;
          }
        });
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
      if (value > req.body.task.order_details.total_amount) {
        throw new Error(`Amount must not be greater than order total amount`);
      }
      return true;
    }),
];

export const task_id_param_validation = [
  param("taskId").trim().isMongoId().withMessage(`Invalid Task ID`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationErrorCreation(res, errors, next);
    }
    next();
  },
];

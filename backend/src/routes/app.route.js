import express from "express";
import appAuthController from "../controllers/app/auth.controller.js";
import smsController from "../controllers/web/sms.controller.js";
import otpController from "../controllers/app/otp.controller.js";
import shiftRiderController from "../controllers/web/shift.rider.controller.js";
import taskController from "../controllers/app/task.controller.js";
import shiftController from "../controllers/app/shift.controller.js";
import zoneController from "../controllers/web/zone.controller.js";
import {
  register_validation,
  register_phone_validation,
  send_sms_validation,
  verify_otp_validation,
  assign_shift_to_rider_validation,
  task_create_validation,
  send_otp_validation,
  update_task_status_validation,
  check_assign_request,
  shift_list_by_zone_ids_validation,
  task_issue_create_validation,
  shift_id_param_validation,
  rider_id_param_validation,
  task_id_param_validation,
  shift_list_by_rider_zone_ids_validation,
  check_arrived_request,
  check_reject_request,
  check_pickup_request,
  tasks_by_order_id_validation,
} from "./validation/app.route.validation.js";
import { find_my_shifts_validation, find_rider_shifts_validation, find_shift_riders_validation } from "./validation/web.route.validation.js";
import TaskIssueController from "../controllers/app/task.issue.controller.js";
import configController from "../controllers/app/config.controller.js";

const AppRouter = express.Router();

// CONFIG-VARIABLES
AppRouter.get("/config/variables", configController.findAll);

// SMS-OTP
AppRouter.post("/send-sms", send_sms_validation, smsController.sendSms);
AppRouter.post("/send-otp", send_otp_validation, otpController.generateOtp);

// SHIFT-RIDER
AppRouter.get("/zone/list", zoneController.findAll);
AppRouter.get("/rider/shifts/:riderId", find_rider_shifts_validation, shiftRiderController.findRiderShifts);
AppRouter.post("/rider/shifts/my-shifts", find_my_shifts_validation, shiftController.myShifts);

AppRouter.post("/shift/take-shift", assign_shift_to_rider_validation, shiftController.takeAShift);
AppRouter.post("/shift/list/zones", shift_list_by_zone_ids_validation, shiftController.shiftListByZone);
AppRouter.post("/shift/list/rider-zones", shift_list_by_rider_zone_ids_validation, shiftController.ShiftListByRiderZones)
AppRouter.get("/shift/rider/:riderId", rider_id_param_validation, shiftController.shiftListByRider);
AppRouter.get("/shift/list", shiftController.findAll);
AppRouter.get("/shift/find-upcoming", shiftController.findAllCurrentAndUpcomingShifts);
AppRouter.get("/shift/detail/:shiftId", shift_id_param_validation, shiftController.findOne);

// TASK
AppRouter.post("/task/create", task_create_validation, taskController.create);
// AppRouter.patch("/task/update", update_task_status_validation, taskController.updateTaskStatus);
AppRouter.get("/task/:taskId", task_id_param_validation, taskController.findOne);
AppRouter.get("/tasks/:riderId", rider_id_param_validation, taskController.riderTasks);
AppRouter.get("/task/order/:orderId", tasks_by_order_id_validation, taskController.findTasksByOrderId);
AppRouter.post("/task/accept", check_assign_request, taskController.acceptTask);
AppRouter.post("/task/reject", check_reject_request, taskController.rejectTask);
AppRouter.post("/task/arrived", check_arrived_request, taskController.arrivedTask);
AppRouter.post("/task/pickup", check_pickup_request, taskController.orderPickupTask);


// TASK ISSUES
AppRouter.post("/task/issue/create", task_issue_create_validation, TaskIssueController.create);
AppRouter.get("/task/issue/order/:orderId", TaskIssueController.findByOrderId);
AppRouter.get("/task/issue/:issueId", TaskIssueController.findById);

export default AppRouter;

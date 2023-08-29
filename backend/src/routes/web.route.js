import express from "express";
import zoneController from "../controllers/web/zone.controller.js";
import riderController from "../controllers/web/rider.controller.js";
import batchController from "../controllers/web/batch.controller.js";
import defaultBatchController from "../controllers/web/default.batch.controller.js";
import taskController from "../controllers/web/task.controller.js";
import storeController from "../controllers/web/store.controller.js";
import shiftRiderController from "../controllers/web/shift.rider.controller.js";
import shiftController from "../controllers/web/shift.controller.js";
import PayoutController from "../controllers/web/payout.controller.js";
import TaskStatusController from "../controllers/web/task.status.controller.js";
import WalletStackingController from "../controllers/web/wallet.stacking.controller.js";
import {
  pay_out_create_validation,
  create_batch_validation,
  assign_batch_validation,
  approve_rider_validation,
  block_rider_validation,
  create_store_validation,
  update_store_validation,
  create_default_batch_validation,
  update_batch_validation,
  assign_shift_to_rider_validation,
  create_shift_validation,
  shift_list_by_zone_validation,
  mark_shift_validation,
  update_slots_filled_validation,
  create_bulk_shift_validation,
  assign_shift_to_rider_bulk_validation,
  assign_batch_import_validation,
  zone_riders_validation,
  assign_zone_validation,
  mark_rider_on_break_validation,
  mark_rider_back_from_break_validation,
  rider_detail_validation,
  activate_shift_validation,
  deactivate_shift_validation,
  assign_task_rider_validation,
  find_rider_shifts_validation,
  find_shift_riders_validation,
  edit_shift_validation,
  shift_detail_validation,
  shift_list_pagination_validation,
  rider_create_validation,
  findOne_store_validation,
  create_zone_validation,
  findOne_zone_validation,
  update_zone_validation,
  force_assign_task_rider_validation,
  mark_task_status_validation,
  task_update_validation,
  filter_by_date_range,
  wallet_stacking_validation,
  shift_list_by_display_ids,
  update_rider_validation,
  task_issue_create_validation,
  task_issue_approval_validation,
  remove_rider_validation,
  remove_rider_from_shift_validation,
  update_default_batch_validation
} from "./validation/web.route.validation.js";
import TaskIssueController from "../controllers/web/task.issue.controller.js";

const WebRouter = express.Router();

// SHIFT
WebRouter.post("/shift/create", create_shift_validation, shiftController.create);
WebRouter.patch("/shift/update", edit_shift_validation, shiftController.update);
WebRouter.post("/shift/createMany", create_bulk_shift_validation, shiftController.createMany);
WebRouter.get("/shift/list-by-zone/:zoneId", shift_list_by_zone_validation, shiftController.shiftListByZone);
WebRouter.post("/shift/date-filter", filter_by_date_range, shiftController.filterByDateRange);
WebRouter.get("/shift/list", shiftController.findAll);
WebRouter.get("/shift/list/:page", shift_list_pagination_validation, shiftController.findAllPagination);
WebRouter.post("/shifts/display-ids", shift_list_by_display_ids, shiftController.shiftListByDisplayId);
WebRouter.get("/shift/find-upcoming", shiftController.findAllCurrentAndUpcomingShifts);
WebRouter.get("/shift/detail/:shiftId", shift_detail_validation, shiftController.findOne);
WebRouter.patch("/shift/slots-filled", update_slots_filled_validation, shiftController.updateTotalSlotsFilled);
WebRouter.patch("/shift/activate", activate_shift_validation, shiftController.activateShift);
WebRouter.patch("/shift/deactivate", deactivate_shift_validation, shiftController.deactivateShift);

// SHIFT-RIDER
WebRouter.post("/shift/assign-rider", assign_shift_to_rider_validation, shiftRiderController.assignShiftToRider);
WebRouter.post("/shift/assign-rider/bulk", assign_shift_to_rider_bulk_validation, shiftRiderController.bulkAssignRidersToShifts);
WebRouter.get("/shift/riders/:shiftId", find_shift_riders_validation, shiftRiderController.findShiftRiders);
WebRouter.get("/rider/shifts/:riderId", find_rider_shifts_validation, shiftRiderController.findRiderShifts);
WebRouter.get("/rider/:riderId/shift/ongoing", shiftRiderController.findRiderOngoingShift);
WebRouter.patch("/shift/remove-rider", remove_rider_from_shift_validation, shiftRiderController.removeRiderShift);

// STORE
WebRouter.post("/store/create", create_store_validation, storeController.create);
WebRouter.patch("/store/update-zone", update_store_validation, storeController.updateStoreAssignedZone);
WebRouter.get("/store/list", storeController.findAllStores);
WebRouter.get("/store/:storeId", findOne_store_validation, storeController.findByStoreId);

// RIDERS
WebRouter.get("/rider/list", riderController.findAll);
WebRouter.get("/rider/detail/:riderId", rider_detail_validation, riderController.findOne);
WebRouter.post("/rider/display-ids", shift_list_by_display_ids, riderController.riderListByDisplayId);
WebRouter.patch("/rider/approve", approve_rider_validation, riderController.approveRider);
WebRouter.patch("/rider/block", block_rider_validation, riderController.blockRider);
WebRouter.patch("/rider/approve", approve_rider_validation, riderController.approveRider);
WebRouter.patch("/rider/break", mark_rider_on_break_validation, riderController.markRiderOnBreak);
WebRouter.patch("/rider/available", mark_rider_back_from_break_validation, riderController.markRiderBackFromBreak);
WebRouter.patch("/rider/assign-batch", assign_batch_validation, riderController.assignBatch);
WebRouter.patch("/rider/assign-zone", assign_zone_validation, riderController.assignZones);
WebRouter.post("/rider/batch-assign/csv", assign_batch_import_validation, riderController.assignBatchCsv);
WebRouter.get("/rider/import", riderController.riderImport);
WebRouter.get("/rider/fleet-import", riderController.riderImportFleet);
WebRouter.get("/rider-list/:zoneId", zone_riders_validation, riderController.findByZones);
WebRouter.post("/rider", rider_create_validation, riderController.createRider);
WebRouter.patch("/rider/update/:riderId", update_rider_validation, riderController.update);
WebRouter.patch("/rider/zones/update", riderController.updateRiderZones);


// ZONES
WebRouter.post("/zone/create", create_zone_validation, zoneController.create);
WebRouter.get("/zone/list", zoneController.findAll);
WebRouter.get("/zone/:zoneId", findOne_zone_validation, zoneController.findOne);
WebRouter.patch("/zone/update", update_zone_validation, zoneController.update);

// BATCHES
WebRouter.post("/batch/create", create_batch_validation, batchController.create);
WebRouter.get("/batch", batchController.findAll);
WebRouter.patch("/batch/update", update_batch_validation, batchController.update);

// BATCH DEFAULTS
WebRouter.post("/batch/create-default-setting", create_default_batch_validation, defaultBatchController.createDefault);
WebRouter.get("/batch/default-setting", defaultBatchController.getDefaultBatchSettings);
WebRouter.patch("/batch/bulk-update-default-setting", update_default_batch_validation, defaultBatchController.updateDefaultBatchSettings);

// PAYOUTS
WebRouter.post("/payout/create", pay_out_create_validation, PayoutController.create);

// TASKS
WebRouter.get("/task/:taskId", taskController.find);
WebRouter.get("/tasks/:orderId", taskController.findByOrderId);
WebRouter.get("/tasks", taskController.findAll);
WebRouter.get("/tasks/rider/:riderId", taskController.riderTasks);
WebRouter.put("/task/:taskId", task_update_validation, taskController.update);
WebRouter.post("/task/assign-rider/request", assign_task_rider_validation, taskController.assignTaskRiderRequest);
WebRouter.patch("/task/assign-rider", force_assign_task_rider_validation, taskController.assignTaskToRider);
WebRouter.patch("/task/mark-status", mark_task_status_validation, taskController.updateTaskStatus);
WebRouter.get("/task/socket/test/:riderId/:type", taskController.socketTest);
WebRouter.patch("/task/:taskId/remove/rider", remove_rider_validation ,taskController.removeRider);


//Task Status
WebRouter.get("/task-statuses", TaskStatusController.get);

// WALLET & STACKING
WebRouter.put("/wallet-stacking", wallet_stacking_validation, WalletStackingController.createOrUpdate);
WebRouter.get("/wallet-stacking", WalletStackingController.findAll);

// TASK ISSUES
WebRouter.post("/task/issue/create", task_issue_create_validation, TaskIssueController.create);
WebRouter.get("/task/issue/order/:orderId", TaskIssueController.findByOrderId);
WebRouter.get("/task/issue/:issueId", TaskIssueController.findById);
WebRouter.get("/tasks/issues/list", TaskIssueController.findAll);
WebRouter.patch("/task/issue/:issueId/:status", task_issue_approval_validation, TaskIssueController.updateIssueStatus);

export default WebRouter;

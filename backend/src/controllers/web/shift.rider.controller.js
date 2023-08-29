import ShiftDto from "../../dto/shift.dto.js";
import shiftRiderService from "../../services/web/shift.rider.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const assignShiftToRider = async (req, res, next) => {
  try {
    let response = await shiftRiderService.assignShiftToRider(req);
    response.message = `Shift has been assigned successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const bulkAssignRidersToShifts = async (req, res, next) => {
  try {
    let response = await shiftRiderService.bulkAssignRidersToShifts(req);
    response.message = `Shifts have been assigned successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findShiftRiders = async (req, res, next) => {
  try {
    let response = await shiftRiderService.findShiftRiders(req);
    response.message = `Shift riders have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findRiderShifts = async (req, res, next) => {
  try {
    let response = await shiftRiderService.findRiderShifts(req.params.riderId);
    if (response.data.length > 0) {
      response.data.map((v, i) => {
        let zoneData = v.shiftId.zone;
        let shiftData = v.shiftId;
        shiftData.zone = zoneData;
        response.data[i] = response.data[i].shiftId;
      });
    }
    response.data = response.data.map(ShiftDto)
    response.message = `Rider shifts have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findRiderOngoingShift = async (req, res, next) => {
  try {
    const { riderId } = req.params;
    let response = await shiftRiderService.findRiderOngoingShifts(riderId);
    response.data = response.data.filter((v) => {
      return v.shiftId;
    });
    response.message = `Rider shifts have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const removeRiderShift = async (req, res, next) => {
  try {
    const { riderId, shiftId } = req.body;
    let response = await shiftRiderService.removeRiderFromShift(riderId,shiftId);
    response.data = [];
    response.message = `Rider removed from shift successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const ShiftRiderController = {
  assignShiftToRider,
  findShiftRiders,
  findRiderShifts,
  bulkAssignRidersToShifts,
  findRiderOngoingShift,
  removeRiderShift
};

export default ShiftRiderController;

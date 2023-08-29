import ShiftDto from "../../dto/shift.dto.js";
import shiftService from "../../services/web/shift.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const createMany = async (req, res, next) => {
  try {
    let { user } = req;
    req.body = req.body.map(v => ({...v, createdBy: user.email }))
    let response = await shiftService.createMany(req);
    response.data = response.data.map(ShiftDto);
    response.message = `Shifts have been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const create = async (req, res, next) => {
  try {
    let response = await shiftService.create(req);
    response.data = ShiftDto(response.data);
    response.message = `Shift has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const update = async (req, res, next) => {
  try {
    let response = await shiftService.update(req);
    response.data = ShiftDto(response.data);
    response.message = `Shift has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    let response = await shiftService.findAll(req);
    response.data = response.data.map(ShiftDto);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAllPagination = async (req, res, next) => {
  try {
    let response = await shiftService.findAllPagination(req.params.page);
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
    let response = await shiftService.shiftListByZone(req);
    response.message = `Shifts of zone have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const filterByDateRange = async (req, res, next) => {
  try {
    let response = await shiftService.filterByDateRange(req);
    response.message = `Shiftshave been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const activateShift = async (req, res, next) => {
  try {
    let response = await shiftService.activateShift(req.body.shiftId);
    response.message = `Shift has been marked active!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const deactivateShift = async (req, res, next) => {
  try {
    let response = await shiftService.deactivateShift(req.body.shiftId);
    response.message = `Shift has been deactivated!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateTotalSlotsFilled = async (req, res, next) => {
  try {
    let response = await shiftService.updateTotalSlotsFilled(req);
    response.message = `Slots filled have been updated!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAllCurrentAndUpcomingShifts = async (req, res, next) => {
  try {
    let response = await shiftService.findAllCurrentAndUpcomingShifts(req);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const shiftListByDisplayId = async (req, res, next) => {
  try {
    let response = await shiftService.shiftListByDisplayId(req);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const ShiftController = {
  create,
  update,
  findAll,
  findAllPagination,
  findOne,
  shiftListByZone,
  filterByDateRange,
  findAllCurrentAndUpcomingShifts,
  updateTotalSlotsFilled,
  createMany,
  activateShift,
  deactivateShift,
  shiftListByDisplayId,
};

export default ShiftController;

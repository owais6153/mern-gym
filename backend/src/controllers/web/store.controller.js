import storeService from "../../services/web/store.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const create = async (req, res, next) => {
  try {
    let response = await storeService.create(req);
    response.message = `Store has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateStoreAssignedZone = async (req, res, next) => {
  try {
    let response = await storeService.updateStoreAssignedZone(req);
    response.message = `Store's zone has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAllStores = async (req, res, next) => {
  try {
    let response = await storeService.findAll();
    response.message = `Stores retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findByStoreId = async (req, res, next) => {
  try {
    let response = await storeService.findByStoreId(req.params.storeId);
    response.message = `Store retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const StoreController = {
  create,
  updateStoreAssignedZone,
  findAllStores,
  findByStoreId,
};

export default StoreController;

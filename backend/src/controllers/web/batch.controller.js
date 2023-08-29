import BatchDto from "../../dto/batch.dto.js";
import batchService from "../../services/web/batch.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const create = async (req, res, next) => {
  try {
    let response = await batchService.create(req);
    response.data = BatchDto(response.data);
    response.message = `Batch has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    let response = await batchService.findAll();
    response.data = response.data.map(BatchDto);
    response.message = `All Batches have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const update = async (req, res, next) => {
  try {
    let response = await batchService.update(req);
    response.data = BatchDto(response.data);
    response.message = `Batch has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const BatchController = {
  create,
  findAll,
  update,
};

export default BatchController;

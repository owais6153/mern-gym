import DefaultBatchDto from "../../dto/defaultBatch.dto.js";
import DefaultBatchService from "../../services/web/default.batch.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import mongoose from "mongoose";
import { STATUS_CODE } from "../../utils/status.code.js";
import defaultBatchModel from "../../database/models/default.batch.model.js";

const createDefault = async (req, res, next) => {
  try {
    const batchIds = [];
    const allBatchDefaults = await defaultBatchModel.find().populate("batch").exec();
    req.body.map((v, i) => {
      batchIds.push(v.batchId);
      allBatchDefaults.map((defaults, idx) => {
        if (String(defaults.batch) == String(v.batchId)) {
          const error = new Error(`Default configuration with batch ID: ${v.batchId} already exist`);
          error.statusCode = STATUS_CODE.conflict;
          throw error;
        }
      });
    });
    const foundBatches = await defaultBatchModel.find({ batch: { $in: batchIds } });
    if (foundBatches.length > 0) {
      const error = new Error(`Defaults of batch with id: ${foundBatches[0]._id} already exist, can't create defaults of this batch`);
      error.statusCode = STATUS_CODE.conflict;
      throw error;
    }
    await DefaultBatchService.create(req.body);
    let response = await DefaultBatchService.findAll();
    response.data = response.data.map(DefaultBatchDto);
    response.message = `Batch has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const getDefaultBatchSettings = async (req, res, next) => {
  try {
    let response = await DefaultBatchService.findAll();
    response.data = response.data.map(DefaultBatchDto);
    response.message = `Batch Settings have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateDefaultBatchSettings = async (req, res, next) => {
  try {
    const updateQueries = [];
    req.body.map((item) => {
      updateQueries.push({
        updateOne: {
          filter: { batch: mongoose.Types.ObjectId(item.batch) },
          update: { $set: { ...item } },
          upsert: false,
        },
      });
    });
    await DefaultBatchService.update(updateQueries);
    let response = await DefaultBatchService.findAll();
    response.data = response.data.map(DefaultBatchDto);
    response.message = `Batch Settings has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const DefaultBatchController = {
  createDefault,
  getDefaultBatchSettings,
  updateDefaultBatchSettings,
};

export default DefaultBatchController;

import riderService from "../../services/web/rider.service.js";
import tookanService from "../../services/external/tookan.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import RiderDto from "../../dto/rider.dto.js";
import BatchService from "../../services/web/batch.service.js";
import ZoneService from "../../services/web/zone.service.js";
import redisConfig from "../../utils/redis.js";
import { config } from "dotenv";
config();

const findAll = async (req, res, next) => {
  try {
    let response = await riderService.findAll(req);
    response.data = await Promise.all(response.data.map(RiderDto));
    response.message = `All Riders have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findOne = async (req, res, next) => {
  try {
    const riderId = req.params.riderId;
    let response = await riderService.findOne(riderId);
    response.data = await RiderDto(response.data);
    response.message = `Rider has been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const assignBatch = async (req, res, next) => {
  try {
    let response = await riderService.assignBatchToRider(req);
    response.data = await RiderDto(response.data);
    response.message = `Batch has been assigned successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const assignZones = async (req, res, next) => {
  try {
    const zones = await ZoneService.findManyByIds(req.body.zoneIds);
    if (zones.data.length < req.body.zoneIds.length) {
      throw new Error("Invalid zone ids provided!");
    }
    let response = await riderService.assignZonesToRider(req);
    response.message = `Zones have been assigned successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const approveRider = async (req, res, next) => {
  try {
    let record = await riderService.approveRider(req);
    let response = await riderService.findOne(req.body.riderId);
    response.data = await RiderDto(response.data);
    response.message = `Rider has been approved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const blockRider = async (req, res, next) => {
  try {
    let record = await riderService.blockRider(req);
    let response = await riderService.findOne(req.body.riderId);
    response.data = await RiderDto(response.data);
    response.message = `Rider has been blocked!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const markRiderOnBreak = async (req, res, next) => {
  try {
    const validated = req.body;
    let response = await riderService.markRiderOnBreak(validated);
    let rider = await riderService.findById(validated.riderId);
    response.data = await RiderDto(rider.data);
    response.message = `Rider has been marked on break!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const markRiderBackFromBreak = async (req, res, next) => {
  try {
    const validated = req.body;
    let response = await riderService.markRiderBackFromBreak(validated);
    let rider = await riderService.findById(validated.riderId);
    response.data = await RiderDto(rider.data);
    response.message = `Rider has been marked available!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const riderImport = async (req, res, next) => {
  try {
    let tookanResponse = await tookanService.importRidersTookanApi(req);
    if (tookanResponse.data.data.length > 0) {
      let response = await riderService.importRider(tookanResponse.data.data);
      response.data = await Promise.all(response.data.map(RiderDto));
      response.message = `Riders Imported Successfully!`;
      createResponse(res, response);
    } else {
      const error = new Error("No record Found!");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    createError(res, e, next);
  }
};

const riderImportFleet = async (req, res, next) => {
  try {
    let tookanResponse = await tookanService.importFleetRidersTookanApi(req);
    if (tookanResponse.data.data.length > 0) {
      let formulatedResponseData = [];
      tookanResponse.data.data.map((v, i) => {
        v.fleets.map((val, idx) => {
          tookanResponse.data.data[i].fleets[idx] = {
            ...v.fleets[idx],
            team_id: v.team_id,
          };
        });
        formulatedResponseData = [...formulatedResponseData, ...v.fleets];
      });
      let response = await riderService.importFleetRider(
        formulatedResponseData
      );
      response.data = await Promise.all(response.data.map(RiderDto));
      response.message = `Riders Imported Successfully!`;
      createResponse(res, response);
    } else {
      const error = new Error("No record Found!");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    createError(res, e, next);
  }
};

const assignBatchCsv = async (req, res, next) => {
  try {
    const updateQueries = [];
    let batch;
    let { data } = await BatchService.findAll();
    req.body.forEach(async (item) => {
      data.filter(function (val) {
        if (val.batchLevel == item.batchLevel) batch = val._id;
      });
      updateQueries.push({
        updateOne: {
          filter: { display_id: item.riderId },
          update: { $set: { batch: batch } },
          upsert: false,
        },
      });
    });
    let response = await riderService.bulkUpdateBatch(updateQueries);
    response.data = response.data == 1 ? [] : null;
    response.message = `Batch has been assigned to Riders successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findByZones = async (req, res, next) => {
  try {
    const zoneId = req.params.zoneId;
    let response = await riderService.findByZoneId(zoneId);
    response.data = await Promise.all(response.data.map(RiderDto));
    response.message = `Riders have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const bulkAssignSequence = async (req, res, next) => {
  try {
    let response = await riderService.bulkUpdateSequence(req);
    response.message = `Sequence has been assigned to Riders successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const createRider = async (req, res, next) => {
  try {
    let response = await riderService.create(req);
    response.message = `Rider created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const riderListByDisplayId = async (req, res, next) => {
  try {
    let response = await riderService.riderListByDisplayId(req);
    response.message = `Shifts retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const update = async (req, res, next) => {
  try {
    const { riderId } = req.params;
    let record = await riderService.update(riderId, req);
    let response = await riderService.findById(riderId);
    response.data = await RiderDto(response.data);
    response.message = `Rider updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const redisSync = async (req, res, next) => {
  try {
    let response = await riderService.findAll();
    response.data = await Promise.all(response.data.map(RiderDto));
    response.data.forEach(async (v, i) => {
      await redisConfig.setByKey(
        process.env.ROCKY_PREFIX + "RIDER_" + v.display_id,
        JSON.stringify(v)
      );
    });
    response.message = `Rider updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const updateRiderZones = async (req, res, next) => {
  try {
    let response = await riderService.bulkUpdateRiderZones();
    response.message = `Rider updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const RiderController = {
  findAll,
  findOne,
  assignBatch,
  assignZones,
  approveRider,
  blockRider,
  riderImport,
  riderImportFleet,
  markRiderOnBreak,
  markRiderBackFromBreak,
  assignBatchCsv,
  findByZones,
  bulkAssignSequence,
  createRider,
  riderListByDisplayId,
  update,
  redisSync,
  updateRiderZones,
};
export default RiderController;

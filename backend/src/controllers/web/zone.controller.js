import zoneService from "../../services/web/zone.service.js";
import { createError, createResponse } from "../../utils/helper.js";
import zoneDto from "../../dto/zone.dto.js";

const create = async (req, res, next) => {
  try {
    let response = await zoneService.create(req);
    response.data = zoneDto(response.data);
    response.message = `Zone has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const update = async (req, res, next) => {
  try {
    let response = await zoneService.update(req);
    response.data = zoneDto(response.data);
    response.message = `Zone has been updated successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    let response = await zoneService.findAll();
    response.data = response.data.map(zoneDto);
    response.message = `Zones have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findOne = async (req, res, next) => {
  try {
    let response = await zoneService.findById(req.params.zoneId);
    response.data = zoneDto(response.data);
    response.message = `Zone have been retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

//

const ZoneController = {
  create,
  update,
  findAll,
  findOne,
  // testRoute,
};

export default ZoneController;

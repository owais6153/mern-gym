import ConfigVariableDto from "../../dto/config.variable.dto.js";
import configServices from "../../services/app/config.service.js";
import { createError, createResponse } from "../../utils/helper.js";


const findAll = async (req, res, next) => {
  try {
    let response = await configServices.findAll();
    response.data = response.data.map(ConfigVariableDto)
    let formattedEAV = {}
    response.data.map((v, i) => {
      formattedEAV = {...formattedEAV, [`${v.identity}`]: {id: v.id, value: v.value}}
    })
    response.data = formattedEAV;
    response.message = `Config variables retrieved successfully!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const ConfigController = {
  findAll
};

export default ConfigController;

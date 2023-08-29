import taskStatusDto from "../../dto/task.status.dto.js";
import taskStatusService from "../../services/web/task.status.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const get = async (req, res, next) => {
  try {
    const response = await taskStatusService.findAll();
    response.data = response.data.map(taskStatusDto);
    response.message = `Status retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const TaskStatusController = {
  get
};

export default TaskStatusController;

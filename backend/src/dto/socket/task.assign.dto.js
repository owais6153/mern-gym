import statusDto from "../status.dto.js";

const TaskAssignSocketDto = (data) => ({
  id: data && data.task_id ? data.task_id._id : null,
  rider_id: data && data.rider_id ? data.rider_id._id : null,
  status: data && data.task_id.status ? data.task_id.status.map(statusDto)  : null,
});
//.find to get single object from array
export default TaskAssignSocketDto;

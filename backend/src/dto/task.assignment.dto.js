import RiderDto from "../dto/rider.dto.js";
import TaskDto from "../dto/task.dto.js";

const TaskAssignmentDto = (data) => ({
  id: data ? data._id : null,
  rider: data ? RiderDto(data.rider_id) : null,
  task: data ? TaskDto(data.task_id) : null,
  status: data && data.status ? [...data?.status] : [],
});

export default TaskAssignmentDto;

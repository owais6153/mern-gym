import zoneDto from "./zone.dto.js";

const TaskStoreDto = (data) => {
  return {
    storeId: data ? data.id : null,
    zone: data && data.zoneId ? zoneDto(data.zoneId) : null,
    name: data ? data.name : null,
  };
};
export default TaskStoreDto;

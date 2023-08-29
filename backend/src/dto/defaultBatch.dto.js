import BatchDto from "./batch.dto.js";

const DefaultBatchDto = (data) => {
  return {
    id: data._id || null,
    slotsPercentage: data.slotsPercentage || null,
    startDisplayHours: data.startDisplayHours || null,
    endDisplayHours: data.endDisplayHours || null,
    created_at: data.createdAt || null,
    batch: data ? BatchDto(data.batch) : null
  };
};
export default DefaultBatchDto;

import zoneDto from "./zone.dto.js";
import BatchListDto from "./shift.batchList.dto.js";

const ShiftDto = (data) => {
  return {
    id: data ? (data.shiftId ? data.shiftId._id : data._id ? data._id : data.id) : null,
    display_id: data ? (data.shiftId ? data.shiftId.display_id : data.display_id) : null,
    zone: data ? (data.shiftId ? zoneDto({ _id: data.shiftId.zone }) : zoneDto(data.zone)) : null,
    startTime: data ? (data.shiftId ? data.shiftId.startTime : data.startTime) : null,
    endTime: data ? (data.shiftId ? data.shiftId.endTime : data.endTime) : null,
    shiftDuration: data ? (data.shiftId ? data.shiftId.shiftDuration : data.shiftDuration) : null,
    totalSlots: data ? (data.shiftId ? data.shiftId.totalSlots : data.totalSlots) : null,
    totalSlotsFilled: data ? (data.shiftId ? data.shiftId.totalSlotsFilled : data.totalSlotsFilled) : null,
    batchList: data ? (data.shiftId ? data.shiftId.batchList.map(BatchListDto) : data.batchList.map(BatchListDto)) : null,
    isActive: data ? (data.shiftId ? data.shiftId.isActive : data.isActive) : null,
    created_at: data ? (data.shiftId ? data.shiftId.created_at : data.created_at) : null,
    updated_at: data ? (data.shiftId ? data.shiftId.updated_at : data.updated_at) : null,
  };
};
export default ShiftDto;

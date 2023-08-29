const BatchListDto = (data) => {
  return {
    batchId: data ? data.batchId : null,
    slots: data && data.slots ? data.slots : null,
    maxSlots: data && data.maxSlots ? data.maxSlots : null,
    slotsFilled: data ? data.slotsFilled : null,
    startDisplayHours: data ? data.startDisplayHours : null,
    endDisplayHours: data ? data.endDisplayHours : null,
  };
};
export default BatchListDto;

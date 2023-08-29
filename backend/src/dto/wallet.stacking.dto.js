import BatchDto from "./batch.dto.js";

const WalletStackingDto = (data) => {
  return {
    id: data ? data._id : null,
    cashLimit: data ? data.cashLimit : null,
    orderValueLimit: data ? data.orderValueLimit : null,
    stackingLimit: data ? data.stackingLimit : null,
    batch: (data && data.batch) ? BatchDto(data.batch) : null,
    created_at: data ? data.createdAt : null,
  };
};
export default WalletStackingDto;

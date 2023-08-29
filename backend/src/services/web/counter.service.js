import counterModel from "../../database/models/counter.model.js";
import { STATUS_CODE } from "../../utils/status.code.js";

const increment = async (identity) => {
  const identityExist = await counterModel.findOne({ identity });
  if (!identityExist) {
    const error = new Error(`Invalid identity`);
    error.statusCode = STATUS_CODE.internal_server_error;
    throw error;
  }
  await counterModel.findOneAndUpdate({ identity }, { seq: Number(identityExist.seq) + 1 });
};

const bulkIncrement = async (identity, newCounts) => {
  await counterModel.findOneAndUpdate({ identity }, { seq: Number(newCounts) });
};

const CounterService = { increment, bulkIncrement };
export default CounterService;

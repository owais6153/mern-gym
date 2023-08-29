import payoutModel from "../../database/models/payout.model.js";

const create = async (req) => {
  // miliseconds into seconds (Date.now() / 1000)
  if (req.body.startTime < Date.now() / 1000) {
    const error = new Error(`Start time must be in future`);
    error.statusCode = 400;
    throw error;
  }
  const shiftIsDuplicate = await shiftModel.findOne({ startTime: req.body.startTime, shiftDuration: req.body.shiftDuration });
  if (shiftIsDuplicate) {
    const error = new Error(`This is a duplicate shift w.r.t start and end time`);
    error.statusCode = 400;
    throw error;
  }
  const resp = await shiftModel.create(req.body);
  return { data: resp };
};


const PayoutService = {
  create
};
export default PayoutService;

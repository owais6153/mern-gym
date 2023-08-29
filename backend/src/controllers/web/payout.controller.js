import payoutService from "../../services/web/payout.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const create = async (req, res, next) => {
  try {
    let response = await payoutService.create(req);
    response.message = `Payout has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const PayoutController = {
  create,
};

export default PayoutController;

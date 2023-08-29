import smsServices from "../../services/web/sms.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const sendSms = async (req, res, next) => {
  try {
    let result;
    if (Number(req.body.smsType) === 0) {
      result = await smsServices.sendEoceanSms(req.body.message, req.body.recipientNumber);
      result.message = `Sms has been send with e-ocean`;
    } else if (Number(req.body.smsType) === 1) {
      result = await smsServices.sendTwilioSms(req.body.message, req.body.recipientNumber);
      result.message = `Sms has been send with twilio`;
    } else {
      const error = new Error(`Invalid sms type provided`);
      error.statusCode = 400;
      throw error;
    }
    createResponse(res, result);
  } catch (e) {
    createError(res, e, next);
  }
};

const SmsController = {
  sendSms,
  //   findAllInvoice,
  //   findOneInvoice,
  //   findPendingInvoices,
};

export default SmsController;

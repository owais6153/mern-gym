import otpServices from "../../services/app/otp.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const generateOtp = async (req, res, next) => {
  try {
    const response = await otpServices.generateOtp(req.body.service, req.body.recipent);
    response.message = `Otp has been sent successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const generateTestOtp = async (req, res, next) => {
  try {
    const response = await otpServices.generateTestOtp(req.body.service, req.body.recipent);
    response.message = `Otp has been sent successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    let response = await otpServices.verifyOtp(req.body.otpCode, req.body.phoneNumber);
    // response.message = `Otp has been verified!`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const OtpController = {
  generateOtp,
  verifyOtp,
  generateTestOtp,
};

export default OtpController;

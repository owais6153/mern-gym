import authService from "../../services/app/auth.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const loginRegisterPhoneNumber = async (req, res, next) => {
  try {
    const response = await authService.loginRegisterPhoneNumber(req);
    response.message = `Otp has been sent to your phone number`;
    createResponse(res, response);
  } catch (e) {
    e.statusCode = e.statusCode ? e.statusCode : 422;
    createError(res, e, next);
  }
};

const registerRider = async (req, res, next) => {
  try {
    const response = await authService.registerRider(req);
    response.message = `You are registered for rider platform, you will be notified soon after verification`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const deletePhoneNumber = async (req, res, next) => {
  try {
    const response = await authService.deletePhoneNumber(req);
    response.message = `Phone number has been deleted successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const deleteRider = async (req, res, next) => {
  try {
    const response = await authService.deleteRider(req);
    response.message = `Rider account has been deleted successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const AuthController = {
  registerRider,
  loginRegisterPhoneNumber,
  deletePhoneNumber,
  deleteRider,
};

export default AuthController;

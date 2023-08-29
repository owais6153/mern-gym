import authService from "../../services/app/auth/auth.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const registerAdmin = async (req, res, next) => {
  try {
    const response = await authService.registerAdminUser(req);
    response.message = `Admin has been registered`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const signinAdmin = async (req, res, next) => {
  try {
    const response = await authService.signinAdminUser(req);
    response.message = `Logged in successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const AuthController = {
  registerAdmin,
  signinAdmin,
};

export default AuthController;

import express from "express";
import { verify_otp_validation, register_validation, register_phone_validation, send_otp_validation,task_create_validation } from "./validation/app.route.validation.js";
import otpController from "../controllers/app/otp.controller.js";
import appAuthController from "../controllers/app/auth.controller.js";
import RiderController from "../controllers/web/rider.controller.js";

const AppAuthlessRouter = express.Router();

AppAuthlessRouter.post("/send-test-otp", send_otp_validation, otpController.generateTestOtp); // DEV only
AppAuthlessRouter.post("/verify/otp", verify_otp_validation, otpController.verifyOtp);
AppAuthlessRouter.post("/register", register_validation, appAuthController.registerRider);
AppAuthlessRouter.post("/register-phone", register_phone_validation, appAuthController.loginRegisterPhoneNumber);
AppAuthlessRouter.post("/delete-phone", appAuthController.deletePhoneNumber); // DEV only
AppAuthlessRouter.post("/delete-rider", appAuthController.deleteRider); // DEV only
AppAuthlessRouter.post("/rider/redis", RiderController.redisSync); // DEV only

export default AppAuthlessRouter;

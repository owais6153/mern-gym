import riderModel from "../../database/models/rider.model.js";
import phoneModel from "../../database/models/phone.model.js";
import otpServices from "./otp.service.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import batchModel from "../../database/models/batch.model.js";
import counterService from "../web/counter.service.js";
import counterModel from "../../database/models/counter.model.js";
import {
  validateCnicAlreadyRegistered,
  validateNumberAlreadyRegistered,
  validatePhoneNumberPhoneModel,
  validatePhoneNumberRiderModel,
} from "../../validations/auth.validations.js";
import { STATUS_SLUG } from "../../utils/mobile.status.slugs.js";
import RiderDto from "../../dto/rider.dto.js";
import { APP_CONSTANT } from "../../utils/constants/app.js";
import batchService from "../web/batch.service.js";
config();

const generateToken = async (rider) => {
  if (!rider._id && !rider.phoneNumber) {
    const error = new Error(`Couldn't generate token. Rider ID or phone number not found`);
    error.statusCode = 400;
    throw error;
  }
  const token = jwt.sign(
    {
      email: rider.phoneNumber,
      riderId: rider._id,
    },
    process.env.JWT_SECRET, // this for our secuerity mechanism it's a private key for signing in
    { expiresIn: "100d" }
  );
  return token;
};

const loginRegisterPhoneNumber = async (req) => {
  // IF RIDER PHONE_NUMBER EXIST THEN SEND OTP AND MAKE LOGIN, ELSE REGISTER PHONE_NUMBER AND SEND OTP FOR VERIFICATION
  let response = { data: {} };
  const phoneNumberExist = await phoneModel.findOne({ phoneNumber: req.body.phoneNumber });
  if (!phoneNumberExist) {
    await phoneModel.create({ phoneNumber: req.body.phoneNumber });
    response.data.profileStatus = "otp_sent";
  } else {
    response.data.profileStatus = "otp_sent";
  }
  // // Send otp with e-ocean
  // await otpServices.generateOtp("eocean");

  // Send otp with twilio
  await otpServices.generateOtp("twilio", req.body.phoneNumber);
  return { ...response };
};

const deletePhoneNumber = async (req) => {
  await validatePhoneNumberPhoneModel(req.body.phoneNumber);
  const resp = await phoneModel.findOneAndDelete({ phoneNumber: req.body.phoneNumber });
  return { data: resp };
};

const markPhoneNumberVerified = async (req) => {
  const phoneNumberExist = await validatePhoneNumberPhoneModel(req.body.phoneNumber);
  const verifiedOtp = await otpServices.verifyOtp(req.body.otpCode);
  if (verifiedOtp) {
    const verifiedPhoneNum = await phoneModel.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { isVerified: true });
    if (!verifiedPhoneNum) {
      const error = new Error(`Could not mark Phone number as verified`);
      error.statusCode = 400;
      throw error;
    }
  }
  return { message: `Phone number has been marked as verified` };
};

const deleteRider = async (req) => {
  const phoneNumb = await validatePhoneNumberRiderModel(req.body.phoneNumber);
  const resp = await riderModel.findOneAndDelete({ phoneNumber: req.body.phoneNumber });
  return { data: resp };
};

const registerRider = async (req) => {
  const files = req.files;
  const body = req.body;

  const registeredPhoneNumber = await validatePhoneNumberPhoneModel(req.body.phoneNumber);
  if (Boolean(registeredPhoneNumber.isVerified) === false) {
    const error = new Error(`Your phone number is not verified`);
    error.statusCode = 400;
    throw error;
  }
  await validateNumberAlreadyRegistered(req.body.phoneNumber);
  await validateCnicAlreadyRegistered(req.body.cnic);

  //CONFIGURING RIDER INITIAL BATCH
  let defaultBatch = await batchService.findByLevel(APP_CONSTANT.RIDER_DEFAULT_BATCH_LEVEL);

  if (body.profileImage) req.body.profileImage = files.profileImage[0].location;
  body.cnicFront = files.cnicFront[0].location;
  body.cnicBack = files.cnicBack[0].location;
  body.licenseFront = files.licenseFront[0].location;
  body.licenseBack = files.licenseBack[0].location;
  body.bill = files.bill[0].location;
  body.batch = defaultBatch.data._id;

  const pendingStatus = APP_CONSTANT.DEFAULT_RIDER_STATUS;
  const riderCounter = await counterModel.findOne({ identity: "rider-counter" });
  const response = await riderModel.create({ ...body, display_id: Number(riderCounter.seq) + 1, profileStatus: pendingStatus });
  await counterService.increment("rider-counter");
  const rider = await riderModel.findById(response._id).populate("batch zone").exec();
  const riderFormattedData = await RiderDto(rider, true);

  return { data: { ...riderFormattedData, profileStatus: STATUS_SLUG.verification_pending } };
};

const AuthService = {
  registerRider,
  loginRegisterPhoneNumber,
  markPhoneNumberVerified,
  deletePhoneNumber,
  deleteRider,
  generateToken,
};
export default AuthService;

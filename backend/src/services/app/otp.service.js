import otpModel from "../../database/models/otp.model.js";
import smsServices from "../web/sms.service.js";
import phoneModel from "../../database/models/phone.model.js";
import mongoose from "mongoose";
import riderModel from "../../database/models/rider.model.js";
import authService from "./auth.service.js";
import RiderDto from "../../dto/rider.dto.js";
import RIDER_STATUSES from "../../utils/rider.status.js";
import { STATUS_CODE } from "../../utils/status.code.js";
// For deleting otp we will create a cron which will run at night and will clear all expired otps

const generateOtp = async (smsService, recipentNumber) => {
  const randomOtp = Math.floor(1000 + Math.random() * 9000); // 6 decimal
  let riderWithPhoneNumberExist = {};
  let phoneNumberExist = await phoneModel.findOne({
    phoneNumber: recipentNumber,
  });
  if (!phoneNumberExist) {
    riderWithPhoneNumberExist = await riderModel.findOne({
      phoneNumber: recipentNumber,
    });
    if (!riderWithPhoneNumberExist) {
      const error = new Error(`Rider with this phone number doesn't exist`);
      error.statusCode = STATUS_CODE.conflict;
      throw error;
    }
  }
  const response = await otpModel.create({
    otpCode: randomOtp,
    phoneId: mongoose.Types.ObjectId(phoneNumberExist?._id),
    riderId: mongoose.Types.ObjectId(riderWithPhoneNumberExist?._id),
    creationTime: Date.now(),
  });
  if (!response) {
    const error = new Error(`Failed to generate otp`);
    error.statusCode = 422;
    throw error;
  }
  if (smsService === "eocean") {
    const result = await smsServices.sendEoceanSms(
      `Your otp code is ${randomOtp}`,
      recipentNumber
    );
    if (!result) {
      await otpModel.findByIdAndDelete(response._id);
      const error = new Error(`Failed to send msg from eocean`);
      error.statusCode = STATUS_CODE.conflict;
      throw error;
    }
  }
  if (smsService === "twilio") {
    const result = await smsServices.sendTwilioSms(
      `Your otp code is ${randomOtp}`,
      recipentNumber
    );
    if (!result) {
      await otpModel.findByIdAndDelete(response._id);
      const error = new Error(`Failed to send msg from twilio`);
      error.statusCode = STATUS_CODE.conflict;
      throw error;
    }
  }
  return { data: { code: randomOtp } };
};

const generateTestOtp = async (smsService, recipentNumber) => {
  const randomOtp = "0000";
  let riderWithPhoneNumberExist = {};
  let phoneNumberExist = await phoneModel.findOne({
    phoneNumber: recipentNumber,
  });
  if (!phoneNumberExist) {
    riderWithPhoneNumberExist = await riderModel.findOne({
      phoneNumber: recipentNumber,
    });
    if (!riderWithPhoneNumberExist) {
      const error = new Error(`Rider with this phone number doesn't exist`);
      error.statusCode = 500;
      throw error;
    }
  }

  const response = await otpModel.create({
    otpCode: randomOtp,
    phoneId: mongoose.Types.ObjectId(phoneNumberExist?._id),
    riderId: mongoose.Types.ObjectId(riderWithPhoneNumberExist?._id),
    creationTime: Date.now(),
  });
  if (!response) {
    const error = new Error(`Failed to generate otp`);
    error.statusCode = 500;
    throw error;
  }
  return { data: { otp: response.otpCode } };
};

const verifyOtp = async (otpCode, phoneNum) => {
  console.log(otpCode);
  let otpExist = {};
  otpExist = await otpModel
    .findOne(
      { otpCode, phoneNumber: phoneNum },
      {},
      { sort: { createdAt: -1 } }
    )
    .populate("phoneId")
    .exec();
  if (!otpExist?.phoneId || !otpExist.phoneId?.phoneNumber) {
    otpExist = await otpModel
      .findOne(
        { otpCode, phoneNumber: phoneNum },
        {},
        { sort: { createdAt: -1 } }
      )
      .populate("riderId")
      .exec();
  }
  if (!otpExist) {
    const error = new Error(`otp does not exist`);
    error.statusCode = 400;
    throw error;
  }
  if (otpExist.isUsed) {
    const error = new Error(`otp is used already.`);
    error.statusCode = 400;
    throw error;
  }
  if (
    otpExist?.riderId?.phoneNumber == phoneNum &&
    otpExist?.phoneId?.phoneNumber == phoneNum
  ) {
    const error = new Error(`This otp code doesn't belong to ${phoneNum}`);
    error.statusCode = 400;
    throw error;
  }
  // 60,000 miliseconds = 60secs, hence otp expires after 2hrs
  if (
    otpExist.isExpired &&
    Date.now() > Number(otpExist.creationTime) + 60000 * 120
  ) {
    await otpModel.findOneAndUpdate({ otpCode }, { isExpired: true });
    const error = new Error(`otp is expired already.`);
    error.statusCode = 400;
    throw error;
  }
  // AFTER OTP VALIDATIONS, VERIFY_RIDER_PHONE OR LOGIN_RIDER OR ASK_TO_REGISTER_WITH_COMPLETE_DETAILS
  const phoneExist = await phoneModel.findOne({ phoneNumber: phoneNum });
  const rider = await riderModel.findOne({ phoneNumber: phoneNum });
  if (!phoneExist.isVerified && !rider.t_riderId) {
    const resp = await phoneModel.findOneAndUpdate(
      { phoneNumber: phoneNum },
      { isVerified: true }
    );
    await otpModel.updateOne(
      { otpCode, phoneNumber: phoneNum },
      { isUsed: true, isExpired: true },
      { sort: { createdAt: -1 }, new: true }
    );
    return {
      data: {
        profileStatus: RIDER_STATUSES.ALL_STATUS.phone_is_verified,
        phoneNumber: resp.phoneNumber,
      },
      message:
        "Your phone is verified now, please register your account details",
    };
  } else {
    await otpModel.findOneAndUpdate(
      { otpCode, phoneNumber: phoneNum },
      { isUsed: true, isExpired: true },
      { sort: { createdAt: -1 }, new: true }
    );
    // const riderExist = await riderModel.findOne({ phoneNumber: phoneNum }, {}, { sort: { createdAt: -1 } }).populate("status");
    const riderExist = await riderModel.findOne(
      { phoneNumber: phoneNum },
      {},
      { sort: { createdAt: -1 } }
    );
    if (!riderExist) {
      return {
        data: { profileStatus: RIDER_STATUSES.ALL_STATUS.phone_is_verified },
        message: "Please register your account details",
      };
    } else if (riderExist.status === "pending" || riderExist.status === "0") {
      return {
        data: { profileStatus: RIDER_STATUSES.ALL_STATUS.verification_pending },
        message:
          "Your account verification is pending, please contact our support for details",
      };
    } else if (riderExist.status === "blocked") {
      return {
        data: { profileStatus: RIDER_STATUSES.ALL_STATUS.blocked },
        message:
          "Your account has been blocked, please contact our support for details",
      };
    } else if (
      RIDER_STATUSES.ALL_STATUS.approved === "approved" ||
      RIDER_STATUSES.ALL_STATUS.available === "available" ||
      riderExist.status === "1"
    ) {
      const token = await authService.generateToken(riderExist);
      const riderData = await RiderDto(riderExist);
      return {
        data: {
          token,
          ...riderData,
          profileStatus: RIDER_STATUSES.ALL_STATUS.signed_in,
        },
        message: "Successfully logged in",
      };
    } else {
      return {
        data: { profileStatus: "Error" },
        message: "Invalid rider current status",
      };
    }
  }
};

const OtpServices = {
  generateOtp,
  verifyOtp,
  generateTestOtp,
};
export default OtpServices;

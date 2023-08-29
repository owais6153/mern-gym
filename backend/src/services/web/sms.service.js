// Download the helper library from https://www.twilio.com/docs/node/install

import twilio from "twilio";
import axios from "axios";
import { config } from "dotenv";
import { STATUS_CODE } from "../../utils/status.code.js";
config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
// OR
// const client = require("twilio")(accountSid, authToken);

const sendTwilioSms = async (message, recipientNumber) => {
  try {
    const response = await client.messages.create({
      body: `kravemart: ${message}`,
      from: process.env.TWILIO_NUMBER,
      to: recipientNumber,
    });
    return { statusCode: 200 };
  } catch (e) {
    e.message = "Failed to send msg with twilio";
    e.statusCode = STATUS_CODE.bad_request;
    throw new Error(e);
  }
  // if (!response) {
  //   const error = new Error(`Failed to send msg with twilio`);
  //   error.statusCode = STATUS_CODE.bad_request;
  //   throw error;
  // }
  // return { statusCode: 200 }; //"success";
};

const sendEoceanSms = async (message, recipientNumber) => {
  const response = await axios.get(
    `http://smsctp1.eocean.us:24555/api?action=sendmessage&username=${process.env.USERNAME_EOCEAN}&password=${process.env.SMS_PASSWORD_EOCEAN}&recipient=${recipientNumber}&originator=${process.env.TWILIO_NUMBER}&messagedata=${message}`
  );
  if (!response) {
    const error = new Error(`Failed to send msg with e-ocean`);
    error.statusCode = 500;
    throw error;
  }
  return { statusCode: 200 };
};

// const startEoceanCall = async (message, recipientNumber) => {
//   try {
//     //http://smsctp1.eocean.us:24555/api?action=sendmessage&username=Kravemart&password=Mj87cdxaD&recipient=033312345678&originator=8886&messagedata=1234
//     const response = await axios.get(
//       `http://smsctp1.eocean.us:24555/api?action=sendmessage&username=${process.env.USERNAME_EOCEAN}&password=${process.env.SMS_PASSWORD_EOCEAN}&recipient=${recipientNumber}&originator=${process.env.TWILIO_NUMBER}&messagedata=${message}`
//     );
//     return { message: "Sms has been send with e-ocean" };
//   } catch (e) {
//     throw e;
//   }
// };

const SmsServices = {
  sendTwilioSms,
  sendEoceanSms,
  // verifyOtp,
  //   markOtpAsUsed,
  //   markOtpAsExpired,
};
export default SmsServices;

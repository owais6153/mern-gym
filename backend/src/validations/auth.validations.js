import phoneModel from "../database/models/phone.model.js";
import riderModel from "../database/models/rider.model.js";

export const validatePhoneNumberPhoneModel = async (phoneNumber) => {
  const phoneNumb = await phoneModel.findOne({ phoneNumber });
  if (!phoneNumb) {
    const error = new Error(`Phone number is not registered`);
    error.statusCode = 400;
    throw error;
  }
  return phoneNumb;
};

export const validateNumberAlreadyRegistered = async (phoneNumber) => {
  const numberAlreadyExist = await riderModel.findOne({ phoneNumber });
  if (numberAlreadyExist) {
    const error = new Error(`Your phone number is already registered with a rider`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateCnicAlreadyRegistered = async (cnic) => {
  const record = await riderModel.findOne({ cnic });
  if (record) {
    const error = new Error(`Your cnic is already registered with a rider`);
    error.statusCode = 400;
    throw error;
  }
};

export const validatePhoneNumberRiderModel = async (phoneNumber) => {
  const phoneNumb = await riderModel.findOne({ phoneNumber });
  if (!phoneNumb) {
    const error = new Error(`Phone number is not registered`);
    error.statusCode = 400;
    throw error;
  }
  return phoneNumb;
};

export const validateEmailAlreadyRegistered = async (email) => {
  const record = await riderModel.findOne({ email });
  if(record) {
    const error = new Error(`Email is already registered`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateEmailAlreadyRegisteredExceptId = async (id,email) => {
  const record = await riderModel.findOne({_id: { $ne: id }, email: email });
  if(record) {
    const error = new Error(`Email is already registered with another rider`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateNumberAlreadyRegisteredExceptId = async (id,phoneNumber) => {
  const numberAlreadyExist = await riderModel.findOne({_id: { $ne: id }, phoneNumber : phoneNumber });
  if (numberAlreadyExist) {
    const error = new Error(`Your phone number is already registered with another rider`);
    error.statusCode = 400;
    throw error;
  }
};

export const validateCnicAlreadyRegisteredExceptId = async (id,cnic) => {
  const record = await riderModel.findOne({ _id: { $ne: id }, cnic: cnic });
  if (record) {
    const error = new Error(`Your cnic is already registered with another rider`);
    error.statusCode = 400;
    throw error;
  }
};
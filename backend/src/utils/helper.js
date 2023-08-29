import { config } from "dotenv";
import moment from "moment";
import { APP_CONSTANT } from "./constants/app.js";
config();

export const createError = (res, e, next) => {
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  if (!e.message || (e.statusCode == 500 && process.env.APP_ENV === "production")) {
    e.message = "Failed request: something went wrong";
  }
  res.status(e.statusCode).json({ code: e.statusCode, error: true, message: e.message, data: e.data || null });
  next(e);
};

export const createResponse = (res, resp) => {
  if (!resp.statusCode) {
    resp.statusCode = 200;
  }
  if (!resp.message) {
    resp.message = "Request was successful";
  }
  res.status(resp.statusCode).json({
    code: resp.statusCode,
    error: false,
    message: resp.message,
    data: resp.data ? resp.data : null,
    pagination: resp.pagination ? resp.pagination : null,
  });
};

export const pluck = (arr, key) => arr.map((i) => i[key]);

export const convertUnixToDateTime = (date) => moment.unix(date);

export const convertUnixToDayStart = (seconds) => {
  var now = new Date(seconds * 1000);
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var dayStartTimestamp = startOfDay / 1000;
  return dayStartTimestamp;
};

export const convertUnixToDayEnd = (seconds) => {
  var now = new Date(seconds * 1000);
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var dayStartTimestamp = startOfDay / 1000;
  var dayEndTimestamp = dayStartTimestamp + 86400 -1;
  return dayEndTimestamp;
};

export const convertDateTimeToUnix = (date) => moment(date, "YYYY-MM-DD").utcOffset(APP_CONSTANT.DEFAULT_TIME_ZONE).unix();

export const validURL = (url) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
};

export const getCurrentDateTime = () => moment().utcOffset(APP_CONSTANT.DEFAULT_TIME_ZONE);


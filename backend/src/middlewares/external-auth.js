import { createError } from "../utils/helper.js";
import { config } from "dotenv";
config();

const ExternalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not Authenticated! Missing headers!");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    if(token !== process.env.EXTERNAL_AUTH) {
      const error = new Error("Invalid Credentials!");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (err) {
    if(!err.message) {
      err.message = "Unauthorized request!";
    }
    createError(res, err, next);
  }
};
export default ExternalAuthMiddleware;

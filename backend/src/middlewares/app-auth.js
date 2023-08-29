import jwt from "jsonwebtoken";
import { createError } from "../utils/helper.js";
import { config } from "dotenv";
config();

const AppAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Unauthorized request!");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("Unauthorized request!");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (err) {
    err.message = "Unauthorized request!";
    createError(res, err, next);
  }
};
export default AppAuthMiddleware;

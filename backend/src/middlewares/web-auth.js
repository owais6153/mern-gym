import redisConfig from "../utils/redis.js";
import { createError } from "../utils/helper.js";

const WebAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    const { userid } = req.headers;
    if (!authHeader) {
      const error = new Error("Not Authenticated! Missing headers!");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let userData = await redisConfig.getByKey("K2_ACCOUNT_USERS");
    let currentUser;
    userData.map(function (data) {
      if (data.id == userid && data.token == token) currentUser = data;
    });
    if (!currentUser) {
      const error = new Error("Not Authenticated!");
      error.statusCode = 401;
      throw error;
    }
    req.user = currentUser;
    next();
  } catch (err) {
    createError(res, err, next);
  }
};
export default WebAuthMiddleware;

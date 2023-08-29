import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import { allowingCors } from "./src/utils/allowing.cors.js";
import { config } from "dotenv";
import rootRoutes from "./src/routes/root.route.js";
import { mongooseConnection } from "./src/config/database.js";
import s3 from "./src/utils/s3.js";
import redisConfig from "./src/utils/redis.js";
config();

const app = express();
app.use(logger("dev")); // developers use log for debugging, its a middleware func that reads req and res values that are coming.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  s3.uploadFileToS3.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicFront", maxCount: 1 },
    { name: "cnicBack", maxCount: 1 },
    { name: "licenseFront", maxCount: 1 },
    { name: "licenseBack", maxCount: 1 },
    { name: "bill", maxCount: 1 },
  ])
);
app.use(bodyParser.json());
app.use((req, res, next) => allowingCors(req, res, next));
app.options('/*', (_, res) => {
  res.sendStatus(200);
});
app.use("/api", rootRoutes);

process.env.REDIS_URL;
redisConfig.redisInit();
// BOILER PLATE MONGOOSE CONNECTION AND SERVER STARTED
mongooseConnection(app);

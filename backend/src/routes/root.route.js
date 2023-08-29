import express from "express";
import AppRouter from "./app.route.js";
import WebRouter from "./web.route.js";
import ExternalRouter from "./external.route.js";
import AppAuthlessRouter from "./app.noauth.route.js";
import WebAuthMiddleware from "../middlewares/web-auth.js";
import AppAuthMiddleware from "../middlewares/app-auth.js";
import ExternalAuthMiddleware from "../middlewares/external-auth.js";

const rootRouter = express.Router();
rootRouter.use("/web", WebAuthMiddleware, WebRouter);
rootRouter.use("/app", AppAuthlessRouter);
rootRouter.use("/app", AppAuthMiddleware, AppRouter);
rootRouter.use("/external", ExternalAuthMiddleware, ExternalRouter);

export default rootRouter;

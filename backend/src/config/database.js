import mongoose from "mongoose";
import { socket } from "./socket.js";

let PORT = process.env.PORT || 9001;

export const mongooseConnection = (app) => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((result) => {
      console.log("\u001b[" + 34 + "m" + `Server started in mode on port: ${PORT} and Connected to Database` + "\u001b[0m");
      const server = app.listen(PORT);
      const io = socket.init(server);
      io.on("connection", (socket) => {
        console.log("Client Connected with Socket!!");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

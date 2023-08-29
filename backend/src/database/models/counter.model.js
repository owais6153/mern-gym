import mongoose from "mongoose";

const Schema = mongoose.Schema;

const counterSchema = new Schema({
  identity: {
    type: String,
    require: true,
    enum: ["rider-counter", "shift-counter"],
  },
  seq: {
    type: Number,
    require: true,
  },
});

const CounterModel = mongoose.model("counter", counterSchema);
export default CounterModel;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const walletStackingSchema = new Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch",
      require: true,
    },
    cashLimit: {
      type: Number,
      require: true,
    },
    orderValueLimit: {
      type: Number,
      require: true
    },
    stackingLimit: {
      type: Number,
      require: true
    },
  },
  { timestamps: true }
);

const walletStackingModel = mongoose.model("walletStacking", walletStackingSchema);
export default walletStackingModel;

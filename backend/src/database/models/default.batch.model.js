import mongoose from "mongoose";
const Schema = mongoose.Schema;

const defaultBatchSchema = new Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch",
      require: true,
    },
    slotsPercentage: {
      type: Number,
      require: true,
    },
    startDisplayHours: {
      type: Number,
      require: true,
    },
    endDisplayHours: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const DefaultBatchModel = mongoose.model("defaultBatch", defaultBatchSchema);
export default DefaultBatchModel;

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const riderStatusLogSchema = new Schema(
  {
    rider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      require: true,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    start_date: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      require: true,
      enum: ["pending","approved","blocked","break-temporary","break","available"],
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const riderStatusLogModel = mongoose.model("rider-status-log", riderStatusLogSchema);
export default riderStatusLogModel;

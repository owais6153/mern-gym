import mongoose from "mongoose";
const Schema = mongoose.Schema;

const payoutSchema = new Schema(
  {
    perOrder: {
      type: Number,
      require: true,
    },
    perKilometre: {
      type: Number,
      require: true,
    },
    perHour: {
        type: Number,
        require: true,
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "batch",
        default: null,
        require: false,
    },
    batch: {
        type: Number,
        default: null,
        require: false,
    },
  },
  { timestamps: true }
);

const PayoutModel = mongoose.model("payout", payoutSchema);
export default PayoutModel;

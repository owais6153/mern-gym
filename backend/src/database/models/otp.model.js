import mongoose from "mongoose";
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    otpCode: {
      type: String,
      require: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      require: true,
    },
    phoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "phoneNumber",
      require: true,
    },
    creationTime: {
      type: Number,
      require: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model("otp", otpSchema);
export default OtpModel;

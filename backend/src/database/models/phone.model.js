import mongoose from "mongoose";
const Schema = mongoose.Schema;

const phoneSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PhoneModel = mongoose.model("phoneNumber", phoneSchema);
export default PhoneModel;

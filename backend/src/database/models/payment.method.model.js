import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      require: true,
    },
  },
  { timestamps: true }
);

const paymentMethodModel = mongoose.model("payment_method", paymentMethodSchema);
export default paymentMethodModel;

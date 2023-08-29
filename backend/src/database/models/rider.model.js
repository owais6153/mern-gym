import mongoose from "mongoose";
const Schema = mongoose.Schema;

const riderSchema = new Schema(
  {
    display_id: {
      type: Number,
      require: true,
      default: null,
    },
    t_riderId: {
      type: String,
      default: null,
    },
    fleet_id: {
      type: String,
      default: null,
    },
    team_id: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      require: true,
      default: null,
    },
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: [
        "pending",
        "approved",
        "blocked",
        "break-temporary",
        "break",
        "available",
      ],
      default: "pending",
    },
    cnic: {
      type: String,
      require: true,
    },
    vehicle: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    cnicFront: {
      type: String,
      require: true,
    },
    cnicBack: {
      type: String,
      require: true,
    },
    licenseFront: {
      type: String,
      require: true,
    },
    licenseBack: {
      type: String,
      require: true,
    },
    bill: {
      type: String,
      require: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch",
      require: true,
      default: null,
    },
    zone: { type: [Schema.Types.Mixed], default: null },
    deviceId: {
      type: String,
      require: true,
      default: null,
    },
    deviceType: {
      type: String,
      require: true,
      default: "android",
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
    marital_status: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    cnic_issue_date: {
      type: Date,
      default: null,
    },
    next_of_kin: {
      name: { type: String, default: null },
      relation: { type: String, default: null },
      cnic: { type: Number, default: null },
      number: { type: String, default: null },
    },
    payment: {
      jazz_cash: { type: String, default: null },
      hbl: { type: String, default: null },
      bank_account: { type: String, default: null },
      atm_status: { type: Boolean, default: null },
      easy_paisa: { type: String, default: null },
    },
    equipment: {
      hand_over_date: { type: Date, default: null },
      returning_date: { type: Date, default: null },
      delivery_bag: { type: Number, default: null },
      t_shirt_count: { type: Number, default: null },
      rain_coats: { type: Number, default: null },
      rain_jackets: { type: Number, default: null },
      caps: { type: Number, default: null },
      shirt_status: { type: Boolean, default: null },
      winter_jackets: { type: Number, default: null },
    },
  },
  { timestamps: true }
);
riderSchema.index({
  t_riderId: "text",
  fleet_id: "text",
  team_id: "text",
  fullName: "text",
  email: "text",
  phoneNumber: "text",
  cnic: "text",
});
const RiderModel = mongoose.model("rider", riderSchema);
export default RiderModel;

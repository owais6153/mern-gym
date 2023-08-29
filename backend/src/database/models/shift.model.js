import mongoose from "mongoose";
const Schema = mongoose.Schema;

// START_TIME will be in SECONDS and SHIFT_DURATION will be in HOURS

const subSchemaBatchlist = new Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "batch", require: true },
    maxSlots: { type: Number, require: true },
    slotsFilled: { type: Number, default: 0 },
    startDisplayHours: { type: Number, require: true },
    endDisplayHours: { type: Number, require: true },
  },
  { _id: false }
);

const shiftSchema = new Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "zone",
      require: true,
    },
    startTime: {
      type: Number,
      require: true,
    },
    shiftDuration: {
      type: Number,
      require: true,
    },
    endTime: {
      type: Number,
      require: true,
    },
    totalSlots: {
      type: Number,
      require: true,
    },
    totalSlotsFilled: {
      type: Number,
      default: 0, // not required
    },
    batchList: [subSchemaBatchlist],
    display_id: {
      type: Number,
      require: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const ShiftModel = mongoose.model("shift", shiftSchema);
export default ShiftModel;

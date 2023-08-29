import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Shifts assigned to riders

const shiftRiderSchema = new Schema({
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shift",
      require: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      require: true,
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

shiftRiderSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

shiftRiderSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});
const ShiftRiderModel = mongoose.model("shift-rider", shiftRiderSchema);

export default ShiftRiderModel;

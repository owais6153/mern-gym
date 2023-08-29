import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subSchemaStatus = new Schema(
  { 
    log: { title: { type: String }, slug: { type: String } }, 
    active: { type: Boolean, default: true }, 
    // overdue_minutes: { type: Number },
    created_at: { type: Date, default: Date.now } 
  },
  { _id: false }
);
const taskAssignmentSchema = new Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      require: true,
    },
    rider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      require: true,
    },
    status: [subSchemaStatus],
    reason: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const taskAssignmentModel = mongoose.model("task_assignment", taskAssignmentSchema);
export default taskAssignmentModel;

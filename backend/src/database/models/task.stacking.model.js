import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subSchemaStatus = new Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "task", require: true },
  },
  { _id: false }
);

const taskStackingSchema = new Schema(
  {
    deliveryTasks: [subSchemaStatus],
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

const TaskStackingModel = mongoose.model("task_stack", taskStackingSchema);
export default TaskStackingModel;

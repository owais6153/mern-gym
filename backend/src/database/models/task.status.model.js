import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskStatusSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    // overdue_minutes: {
    //   type: Number,
    //   default: 0
    // }
  },
  { timestamps: true }
);

const TaskStatusModel = mongoose.model("task_status", taskStatusSchema);
export default TaskStatusModel;

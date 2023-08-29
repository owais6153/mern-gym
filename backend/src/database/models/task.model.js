import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const Schema = mongoose.Schema;
const increment = AutoIncrement(mongoose);

const subSchemaStatus = new Schema(
  {
    status_logs: { type: mongoose.Schema.Types.ObjectId, ref: "task_status", require: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date },
    reason: { type: String, default: null },
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    order_id: {
      type: String,
      require: true,
    },
    store_id: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ["delivery", "pickup"],
      require: true,
    },
    auto_assignment: {
      type: String,
      require: true,
    },
    job_description: {
      type: String,
      require: true,
    },
    status: [subSchemaStatus],
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      default: null,
    },
    issues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task_issue",
      default: null,
    },
    pickup: {
      phone: { type: String, trim: true, require: true },
      address: { type: String, trim: true, require: true },
      latitude: { type: Number, require: true },
      longitude: { type: Number, require: true },
      datetime: { type: Date, require: true },
      note: { type: String, default: null },
    },
    delivery: {
      phone: { type: String, trim: true, require: true },
      username: { type: String, trim: true, require: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true, require: true },
      latitude: { type: Number, require: true },
      longitude: { type: Number, require: true },
      datetime: { type: Date, require: true },
      note: { type: String, default: null },
    },
    order_details: {
      order_items: { type: Array },
      delivery_charges: { type: Number, require: true },
      discount: { type: Number, require: true },
      sub_total: { type: Number, require: true },
      total_amount: { type: Number, require: true },
      special_instructions: { type: String },
      tip: { type: Number, require: true },
      payment_type: { type: Schema.Types.ObjectId, ref: "payment_method", require: true },
    },
    task_id: {
      type: Number,
    },
  },
  { timestamps: true }
);

taskSchema.plugin(increment, { id: "task_seq", inc_field: "task_id" });
const TaskModel = mongoose.model("task", taskSchema);
export default TaskModel;

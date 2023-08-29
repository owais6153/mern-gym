import mongoose from "mongoose";
const Schema = mongoose.Schema;

const issueScheme = new Schema({
  task_id : {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
    required: true
  },
  type :  { type: String, required:true },
  reason: { type: String, required: true, default: "" },
  amount: { type: Number, required: true},
  is_approved: { type: Boolean, required: true, default:false},
  updatedBy: { type: String, default:null},
  updatedTime: { type: Date, default:null},
},{timestamps : true });

const issueModel = mongoose.model("task_issue", issueScheme);
export default issueModel;
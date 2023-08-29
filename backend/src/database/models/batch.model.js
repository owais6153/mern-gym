import mongoose from "mongoose";
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  batchLevel: {
    type: String,
    require: true,
  },
},{ timestamps: true });

const BatchModel = mongoose.model("batch", batchSchema);
export default BatchModel;

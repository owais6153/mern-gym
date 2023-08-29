import mongoose from "mongoose";
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  storeId: {
    type: String,
    require: true,
  },
  zoneId: {
    type: Schema.Types.ObjectId,
    ref: "zone",
    require: true,
  },
});

const StoreModel = mongoose.model("store", storeSchema);
export default StoreModel;

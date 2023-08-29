import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subSchemaPolygon = new Schema({ latitude: { type: String, require: true }, longitude: { type: String, require: true } }, { _id: false });

const zoneSchema = new Schema(
  {
    zoneName: {
      type: String,
      require: true,
    },
    startPoint: {
      type: Object,
      // require: true,
      default: { latitude: "", longitude: "" },
    },
    // coordinate: { type: String, default: "" },
    // polygons: [subSchemaPolygon],
    polygons: { type: [subSchemaPolygon], default: [] },
  },
  { timestamps: true }
);

const ZoneModel = mongoose.model("zone", zoneSchema);
export default ZoneModel;

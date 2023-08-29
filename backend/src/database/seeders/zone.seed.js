import K2commerceService from "../../services/external/k2commerce.service.js";
import ZoneModel from "../models/zone.model.js";
import StoreModel from "../models/store.model.js";
import redisConfig from "../../utils/redis.js";
import mongoose from "mongoose";

const zoneQueries = [];

export const ZoneSeeder = async () => {
  try {
    const stores = await K2commerceService.fetchStores();
    stores.map((v, i) => {
      zoneQueries.push({ updateOne: { filter: { zoneName: v.name }, update: { $set: { zoneName: v.name } }, upsert: true } });
    });
    const zones = await ZoneModel.bulkWrite([...zoneQueries]);
    await StoreSeeder(stores, zones);
  } catch (e) {
    throw e;
  }
};

const storeQueries = [];

const StoreSeeder = async (stores, zones) => {
  try {
    zones.map((zone, i) => {
      stores.map((store, idx) => {
        if (zone.zoneName === store.storeName) {
          storeQueries.push({
            updateOne: { filter: { storeId: store.id }, update: { $set: { storeId: store.id, zoneId: mongoose.Types.ObjectId(zone._id) } }, upsert: true },
          });
        }
      });
    });
    const storeZones = await StoreModel.bulkWrite([...storeQueries]);
  } catch (e) {
    throw e;
  }
};

import Batch from "../models/batch.model.js";

const batchQueries = [
  {
    updateOne: {
      filter: { batchLevel: "1" },
      update: { $set: { batchLevel: "1" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { batchLevel: "2" },
      update: { $set: { batchLevel: "2" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { batchLevel: "3" },
      update: { $set: { batchLevel: "3" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { batchLevel: "4" },
      update: { $set: { batchLevel: "4" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { batchLevel: "5" },
      update: { $set: { batchLevel: "5" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { batchLevel: "6" },
      update: { $set: { batchLevel: "6" } },
      upsert: true,
    },
  },
];

export const batchSeeder = async () => {
  try {
    const batches = await Batch.bulkWrite([...batchQueries]);
    console.log(`${batches.result.upserted.length} batches created`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

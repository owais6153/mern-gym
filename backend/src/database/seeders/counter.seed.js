import CounterModel from "../models/counter.model.js";

const counterQueries = [
  {
    updateOne: {
      filter: { identity: "shift-counter" },
      update: { $set: { identity: "shift-counter", seq: 0 } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { identity: "rider-counter" },
      update: { $set: { identity: "rider-counter", seq: 0 } },
      upsert: true,
    },
  },
];

export const counterSeeder = async () => {
  try {
    const counters = await CounterModel.bulkWrite([...counterQueries]);
    console.log(`${counters.result.upserted.length} counters created`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

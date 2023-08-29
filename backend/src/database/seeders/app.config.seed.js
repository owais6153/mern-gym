import AppConfigModel from "../models/app.config.model.js"; 

const appConfigQueries = [
  {
    updateOne: {
      filter: { identity: "pickup_time_overdue_mins" },
      update: { $set: { identity: "pickup_time_overdue_mins", value: 10 } },
      upsert: true,
    },
  },
  {
   updateOne: {
     filter: { identity: "dropoff_time_overdue_mins" },
     update: { $set: { identity: "dropoff_time_overdue_mins", value: 10 } },
     upsert: true,
   },
  },
  {
    updateOne: {
      filter: { identity: "pickup_overdue_time_slots" },
      update: { $set: { identity: "pickup_overdue_time_slots", value: [{title: "5 minutes", duration: 5, type: "minutes"}, {title: "10 minutes", duration: 10, type: "minutes"}] } },
      upsert: true,
    },
  }
];

export const appConfigSeeder = async () => {
  try {
    const configs = await AppConfigModel.bulkWrite([...appConfigQueries]);
    console.log(`${configs.result.upserted.length} app configs created`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

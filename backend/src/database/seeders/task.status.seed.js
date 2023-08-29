import TaskStatus from "../models/task.status.model.js";

const statusQueries = [
  {
    updateOne: {
      filter: { slug: "un-assigned" },
      update: { $set: { title: "Un Assigned", slug: "un-assigned" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "assigned" },
      update: { $set: { title: "Assigned", slug: "assigned" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "failed" },
      update: { $set: { title: "Failed", slug: "failed" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "completed" },
      update: { $set: { title: "Completed", slug: "completed" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "cancel" },
      update: { $set: { title: "Cancel", slug: "cancel" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "arrived" },
      update: { $set: { title: "Arrived", slug: "arrived" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "started" },
      update: { $set: { title: "Started", slug: "started" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "accepted" },
      update: { $set: { title: "Accepted", slug: "accepted" } },
      upsert: true,
    },
  },
];
export const taskStatusSeeder = async () => {
  try {
    const statuses = await TaskStatus.bulkWrite([...statusQueries]);
    console.log(`${statuses.result.upserted.length} statuses created`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

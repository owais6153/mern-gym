import mongoose from "mongoose";
import { config } from "dotenv";
import paymentMethod from "../models/payment.method.model.js";

const paymentMethodQueries = [
  {
    updateOne: {
      filter: { slug: "cod" },
      update: { $set: { title: "Cash On Delivery", slug: "cod" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "online-payment" },
      update: { $set: { title: "Online Payment", slug: "online-payment" } },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { slug: "Wallet" },
      update: { $set: { title: "wallet", slug: "Wallet" } },
      upsert: true,
    },
  },
];

export const paymentMethodSeeder = async () => {
  try {
    const pms = await paymentMethod.bulkWrite([...paymentMethodQueries]);
    console.log(`${pms.result.upserted.length} payment methods created`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

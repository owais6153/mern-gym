import mongoose from "mongoose";
import { config } from "dotenv";
import { batchSeeder } from "./batch.seed.js";
import { taskStatusSeeder } from "./task.status.seed.js";
import { paymentMethodSeeder } from "./payment.method.seed.js";
import { counterSeeder } from "./counter.seed.js";
import { appConfigSeeder } from "./app.config.seed.js"
import { ZoneSeeder } from "./zone.seed.js";

config();
mongoose.connect(process.env.DATABASE_URL);

(async () => {
  try {
    const seeder = await Promise.all([
      batchSeeder(), 
      taskStatusSeeder(), 
      paymentMethodSeeder(), 
      counterSeeder(),
      appConfigSeeder()
      //, ZoneSeeder()
    ]);
    console.log(`Seeders run succesfully`);
  } catch (e) {
    console.log(`Seeders Failed`);
  } finally {
    mongoose.connection.close();
  }
})();

import rmsService from "../services/external/rms.service.js";
import redisConfig from "./redis.js";
import { WALLET_COLLECTION_TYPES } from "./wallet.collection.type.js";
import { config } from "dotenv";
config();

export const statusChange = async (status, task ) => {
    if(task.type == "delivery" && task.order_details.payment_type.slug == "cod" && task.rider && !task.issues)
        switch(status.slug) {
            case "completed": 
                const riderData = await redisConfig.getByKey(`${process.env.ROCKY_PREFIX}RIDER_${task?.rider?.display_id}`);
                const payload = {
                    order_id: task.order_id,
                    rider_display_id: task?.rider?.display_id,
                    store_id: task?.store_id,
                    rider_id: task?.rider?._id.toString(),
                    originator: 'rocky backend',
                    collection_type: WALLET_COLLECTION_TYPES.cashin,
                    amount: task?.order_details?.total_amount,
                    rider_wallet_id: riderData?.walletId,
                    note:'created by rocky backend on task delivery'
                };
                let walletTransaction = await rmsService.createWalletTransaction(payload);
                break;
        }
}
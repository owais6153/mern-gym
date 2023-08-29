import WalletStackingDto from "../../dto/wallet.stacking.dto.js";
import walletStackingService from "../../services/web/wallet.stacking.service.js";
import { createError, createResponse } from "../../utils/helper.js";

const createOrUpdate = async (req, res, next) => {
  try {
    let payload = [];
    req.body.forEach((v, i) => {
      payload.push({
        updateOne: {
          filter: { batch: v.batch },
          update: { $set: { batch: v.batch, cashLimit: v.cash_limit, orderValueLimit: v.order_value_limit, stackingLimit: v.stacking_limit } },
          upsert: true,
        },
      });
    });
    let records = await walletStackingService.createOrUpdate(payload);
    const response = await walletStackingService.findAll();
    response.data = response.data.map(WalletStackingDto);
    response.message = `Wallet Stacking has been created successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const findAll = async (req, res, next) => {
  try {
    const response = await walletStackingService.findAll();
    response.data = response.data.map(WalletStackingDto);
    response.message = `Wallet Stacking retrieved successfully`;
    createResponse(res, response);
  } catch (e) {
    createError(res, e, next);
  }
};

const WalletStackingController = {
  createOrUpdate,
  findAll,
};

export default WalletStackingController;

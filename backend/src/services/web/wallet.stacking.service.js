import walletStackingModel from "../../database/models/wallet.stacking.model.js";


const createOrUpdate = async (req) => {
  const resp = await walletStackingModel.bulkWrite(req);
  return { data: resp.result.upserted };
};

const findAll = async () => {
  const resp = await walletStackingModel.find().populate('batch').exec();
  return { data: resp };
};


const WalletStackingService = {
  createOrUpdate,
  findAll
};
export default WalletStackingService;

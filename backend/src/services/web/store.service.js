import storeModel from "../../database/models/store.model.js";
import K2commerceService from "../external/k2commerce.service.js";
import redis from "../../utils/redis.js";
import StoreDto from "../../dto/store.dto.js";
import { STATUS_CODE } from "../../utils/status.code.js";

const create = async (req) => {
  const resp = await storeModel.create(req.body);
  return { data: { storeId: resp.storeId } };
};

const updateStoreAssignedZone = async (req) => {
  const resp = await storeModel.findByIdAndUpdate(storeExist._id, { zoneId: req.body.zoneId });
  return { data: resp };
};

const findAll = async () => {
  let stores = await K2commerceService.fetchStores();
  let resp = await storeModel.find().populate("zoneId").exec();
  resp = resp.map(StoreDto);
  resp.map((v, i) => {
    stores.map((val, idx) => {
      if (String(val.id) === String(v.storeId)) {
        resp[i] = { ...resp[i], ...stores[idx] };
        delete resp[i].id;
      }
    });
  });
  return { data: resp };
};

const findByStoreId = async (storeId) => {
  let stores = await K2commerceService.fetchStores();
  let resp = await storeModel.findOne({ storeId }).populate("zoneId").exec();
  if (!resp) {
    const error = new Error(`Store doesn't exist`);
    error.statusCode = STATUS_CODE.bad_request;
    throw error;
  }
  resp = StoreDto(resp);
  stores.map((store, idx) => {
    if (String(store.id) === String(resp.storeId)) {
      resp = { ...resp, ...store };
      delete resp.id;
    }
  });
  return { data: resp };
};

const findOne = async (storeId) => {
  let resp = await storeModel.findOne({ storeId }).populate("zoneId").exec();
  return { data: resp };
};

const StoreService = {
  create,
  findAll,
  findByStoreId,
  findOne,
  updateStoreAssignedZone,
};
export default StoreService;

import appConfigModel from "../../database/models/app.config.model.js";

// const create = async (req) => {
//   const resp = await appConfigModel.create(req);
//   return resp;
// };

const findAll = async () => {
  const resp = await appConfigModel.find();
  return {data: resp}
}

const ConfigService = {
//   create,
  findAll
};
export default ConfigService;

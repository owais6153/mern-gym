import axios from "axios";
import { STATUS_CODE } from "../../utils/status.code.js";
const base_url = process.env.TOOKAN_URL;
const api_key = process.env.TOOKAN_API_KEY;

const importRidersTookanApi = async (req) => {
  try {
    const response = await axios({
      method: "post",
      url: `${base_url}/get_all_fleets`,
      data: {
        api_key: api_key,
      },
    });
    if (!response) {
      const error = new Error(`Failed to import riders`);
      error.statusCode = STATUS_CODE.internal_server_error;
      throw error;
    }
    return response;
  } catch (e) {
    throw e;
  }
};

const importFleetRidersTookanApi = async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${base_url}/view_teams`,
      data: {
        api_key: api_key,
      },
    });
    if (!response) {
      const error = new Error(`Failed to import fleets riders`);
      error.statusCode = STATUS_CODE.internal_server_error;
      throw error;
    }
    return response;
  } catch(e) {
    throw e;
  }
}

const TookanService = {
  importRidersTookanApi,
  importFleetRidersTookanApi
};
export default TookanService;

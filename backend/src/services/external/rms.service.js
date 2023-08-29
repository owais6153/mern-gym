import axios from "axios";
import { config } from "dotenv";
import redis from "../../utils/redis.js";
const base_url = process.env.RMS_URL;
config();

const login = async () => {
  const url = `${base_url}/auth/login`;
  const body = {
    email: process.env.RMS_EMAIL,
    password: process.env.RMS_PASSWORD
  };
  let token = await redis.getByKey("RMS_AUTH_TOKEN");
  if (!token) {
    const response = await axios.post( url, body );
    token = response.data?.data;
    await redis.setByKey("RMS_AUTH_TOKEN", JSON.stringify(response.data?.data), 1200);
  }
  return token;
};

const createWalletTransaction = async (body) => {
  try {
    let loginResponse = await login();
    const url =  `${base_url}/wallet-transactions`;
    const config = {
      headers: { Authorization: `Bearer ${loginResponse.token}` }
    };
    const response = await axios.post(url,body,config)
    return response.data.data;
  }
  catch (e){
    console.log(e)
  }
};

const rmsService = {
  login,
  createWalletTransaction
};
export default rmsService;

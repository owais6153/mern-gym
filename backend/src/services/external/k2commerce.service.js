import axios from "axios";
import redis from "../../utils/redis.js";
const base_url = process.env.K2COMMERCE_URL;

const fetchStores = async () => {
  let stores;
  stores = await redis.getByKey(process.env.ROCKY_PREFIX + "STORES");
  if (!stores) {
    await axios({
      method: "get",
      url: `${base_url}/store-list-d10`,
    })
      .then(function (response) {
        redis
          .setByKey(process.env.ROCKY_PREFIX + "STORES", JSON.stringify(response.data.data), 445500)
          .then(function (res) {
            console.log("stores added on redis");
          })
          .catch(function (err) {
            console.log(err);
          });
        stores = response.data;
      })
      .catch(function (error) {
        console.log(error);
        return error;
      });
  }
  return stores;
};

const K2commerceService = {
  fetchStores,
};
export default K2commerceService;

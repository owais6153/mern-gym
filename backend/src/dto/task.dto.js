import RiderDto from "../dto/rider.dto.js";
import statusDto from "../dto/status.dto.js";
import K2commerceService from "../services/external/k2commerce.service.js";
import TaskStoreDto from "./task.store.dto.js";
import paymentMethodDto from "./payment.method.dto.js"
const TaskDto = async (data) => {
  const rider = await RiderDto(data?.rider)
  return {
    id: data._id,
    display_id: data.display_id,
    order_id: data.order_id,
    // type: data.type,
    estimatedTaskTime: "12",
    store: data && data.store_id ? TaskStoreDto(await setStore(data.store_id)) : null,
    job_description: data.job_description,
    job_type: data.type,
    issues: data.issues,
    rider: rider,
    status: data.status.map(statusDto),
    auto_assignment: data.auto_assignment,
    pickup: {
      phone: data.pickup.phone,
      address: data.pickup.address,
      latitude: data.pickup.latitude,
      longitude: data.pickup.longitude,
      datetime: data.pickup.datetime,
    },
    delivery: {
      phone: data.delivery.phone,
      username: data.delivery.username,
      email: data.delivery.email,
      address: data.delivery.address,
      latitude: data.delivery.latitude,
      longitude: data.delivery.longitude,
      datetime: data.delivery.datetime,
    },
    order_details: {
      order_items: [...data.order_details.order_items],
      delivery_charges: data.order_details.delivery_charges,
      discount: data.order_details.discount,
      sub_total: data.order_details.sub_total,
      payment_type: paymentMethodDto(data.order_details.payment_type),
      total_amount: data.order_details.total_amount,
      special_instructions: data.order_details.special_instructions,
      tip: data.order_details.tip,
    },
  };
};

const setStore = async (storeId) => {
  const stores = await K2commerceService.fetchStores();
  let store = stores.find((v,i) => {
    return v.id = storeId
  })
  return store;
}
export default TaskDto;

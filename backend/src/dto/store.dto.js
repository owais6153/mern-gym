import zoneDto from "./zone.dto.js";

const StoreDto = (data) => {
  return {
    _id: data ? data._id : null,
    storeId: data ? data.storeId : null,
    zone: data ? zoneDto(data.zoneId) : null,
    team: data ? data.team : null,
    email: data ? data.email : null,
    phone: data ? data.phone : null,
    name: data ? data.name : null,
    address: data ? data.address : null,
    display_address: data ? data.display_address : null,
    longitude: data ? data.longitude : null,
    latitude: data ? data.latitude : null,
    mobile_banner_status: data ? data.mobile_banner_status : null,
    web_banner_status: data ? data.web_banner_status : null,
    status: data ? data.status : null,
    is_enabled: data ? data.is_enabled : null,
    warehouse_id: data ? data.warehouse_id : null,
    city_id: data ? data.city_id : null,
    tags: data ? data.tags : null,
    description: data ? data.description : null,
    min_price: data ? data.min_price : null,
    max_price: data ? data.max_price : null,
    created_at: data ? data.created_at : null,
    updated_at: data ? data.updated_at : null,
  };
};
export default StoreDto;

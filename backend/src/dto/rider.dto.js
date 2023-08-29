import batchDto from "../dto/batch.dto.js";
import zoneDto from "../dto/zone.dto.js";
import s3 from "../utils/s3.js";

const RiderDto = async (data) => {
  return {
    id: data ? data._id : null,
    display_id: data ? data.display_id : null,
    team_id: data ? data.team_id : null,
    t_riderId: data ? data.t_riderId : null,
    fleet_id: data ? data.fleet_id : null,
    email: data ? data.email : null,
    fullName: data ? data.fullName : null,
    phoneNumber: data ? data.phoneNumber : null,
    status: data ? data.status : null,
    cnic: data ? data.cnic : null,
    vehicle: data ? data.vehicle : null,
    city: data ? data.city : null,
    profileImage : data?.profileImage ? await getImage(data.profileImage) : null,
    cnicFront: data?.cnicFront ? await getImage(data.cnicFront) : null,
    cnicBack: data?.cnicBack ? await getImage(data.cnicBack) : null,
    licenseFront: data?.licenseFront ? await getImage(data.licenseFront) : null,
    licenseBack: data?.licenseBack ? await getImage(data.licenseBack) : null,
    bill: data?.bill ? await getImage(data.bill) : null,
    batch: data && data.batch ? batchDto(data.batch) : batchDto(null),
    deviceId: data ? data.deviceId : null,
    deviceType: data ? data.deviceType : null,
    is_approved: data ? data.is_approved : null,
    zone: data && data.zone ? data?.zone.map(zoneDto) : zoneDto(null),
    next_of_kin: { 
      name: (data && data.next_of_kin) ? data.next_of_kin.name : null, 
      relation: (data && data.next_of_kin) ? data.next_of_kin.relation : null, 
      cnic:  (data && data.next_of_kin) ? data.next_of_kin.cnic : null, 
      number: (data && data.next_of_kin) ? data.next_of_kin.number : null 
    },
    payment: {
      jazz_cash: (data && data.payment) ? data.payment.jazz_cash : null,
      hbl: (data && data.payment) ? data.payment.hbl : null,
      bank_account: (data && data.payment) ? data.payment.bank_account : null,
      atm_status: (data && data.payment) ? data.payment.atm_status : null,
      easy_paisa: (data && data.payment) ? data.payment.easy_paisa : null
    },
    equipment: {
      hand_over_date: (data && data.equipment) ? data.equipment.hand_over_date : null,
      returning_date: (data && data.equipment) ? data.equipment.returning_date : null,
      delivery_bag: (data && data.equipment) ? data.equipment.delivery_bag : null,
      t_shirt_count: (data && data.equipment) ? data.equipment.t_shirt_count : null,
      rain_coats: (data && data.equipment) ? data.equipment.rain_coats : null,
      rain_jackets: (data && data.equipment) ? data.equipment.rain_jackets : null,
      caps: (data && data.equipment) ? data.equipment.caps : null,
      shirt_status: (data && data.equipment) ? data.equipment.shirt_status : null,
      winter_jackets: (data && data.equipment) ? data.equipment.winter_jackets : null,
    },
    marital_status: data ? data.marital_status : null,
    dob: data ? data.dob : null,
    cnic_issue_date:  data ? data.cnic_issue_date : null,
  };
};

const getImage = async (image) => {
  let data = null;
  if(image) {
    const imageName = image.split('/').pop();
    data = await s3.getImage(imageName);
  }
  return data;
}
export default RiderDto;

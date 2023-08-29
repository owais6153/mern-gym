const formulateTookanData = (data) => {
  return {
    t_riderId: data.fleet_id.toString(),
    profileImage: data.fleet_image,
    fullName: data.name,
    email: data.email,
    phoneNumber: data.phone,
    cnic: data.license,
    vehicle: "bike",
    city: "",
    cnicFront: "",
    cnicBack: "",
    licenseFront: "",
    licenseBack: "",
    bill: "",
  };
};

const formulateTookanFleetData = (data) => {
  return {
    t_riderId: data.user_id.toString(),
    fleet_id: data.fleet_id,
    profileImage: data.fleet_image,
    fullName: data.fleet_name,
    email: data.email,
    phoneNumber: data.phone,
    cnic: "",
    vehicle: "bike",
    city: "",
    cnicFront: "",
    cnicBack: "",
    licenseFront: "",
    licenseBack: "",
    bill: "",
    team_id: data && data?.team_id ? data.team_id : null,
    zone: null
  };
};

const TookanDto = { formulateTookanData, formulateTookanFleetData };
export default TookanDto;

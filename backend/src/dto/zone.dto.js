const zoneDto = (data) => {
  return {
    id: data?._id ? data._id : null,
    zoneName: data?.zoneName ? data.zoneName : null,
    startPoint: data?.startPoint ? data.startPoint : null,
    polygons: data?.polygons ? data.polygons : null,
    created_at: data?.created_at ? data.created_at : null,
    updated_at: data?.updated_at ? data.updated_at : null,
  };
};
export default zoneDto;

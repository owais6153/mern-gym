const BatchDto = (data) => {
  return { id: data ? data._id : null, batchLevel: data ? data.batchLevel : null, created_at: data ? data.createdAt : null };
};
export default BatchDto;

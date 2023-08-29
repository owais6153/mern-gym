const statusDto = (data) => {
    return {
        id : (data && data.status_logs) ? data.status_logs._id : null,
        title: (data && data.status_logs) ? data.status_logs.title : null,
        slug:  (data && data.status_logs) ? data.status_logs.slug : null,
        reason:  data ? data.reason : null,
        current: data ? data.active : null,
        created_at: data ? data.createdAt : null 
    };
};
export default statusDto;
  
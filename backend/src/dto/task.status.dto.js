const taskStatusDto = (data) => {
    return {
        id : data ? data._id : null,
        title: data ? data.title : null,
        slug:  data ? data.slug : null,
        created_at: data ? data.createdAt : null 
    };
};
export default taskStatusDto;
  
import taskDto from "./task.dto.js"
const taskIssueDto = async (data) => {
    let task = await taskDto(data?.task_id)
    return {
        id : data ? data._id : null,
        reason: data ? data.reason : null,
        type:  data ? data.type : null,
        amount:  data ? data.amount : null,
        approved:  data ? data.is_approved : false,
        updatedBy: data ? data.updatedBy : null,
        updatedTime: data ? data.updatedTime : null,
        task: task,
        created_at: data ? data.createdAt : null 
    };
};
export default taskIssueDto;
  
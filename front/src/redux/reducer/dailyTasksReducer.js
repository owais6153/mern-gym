import * as t from "../types";

const defaultState = {
  daily_task: [],
  daily_tasks: [],
  daily_tasks_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,},
};

const dailyTasksReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_DAILY_TASK:
      return {
        ...state,
        daily_task: action.payload,
      };
    case t.SET_DAILY_TASKS:
      return {
        ...state,
        daily_tasks: action.payload,
      };
    case t.SET_DAILY_TASKS_PAGINATION:
      return {
        ...state,
        daily_tasks_pagination: action.payload,
      };
    case t.RESET_DAILY_TASKS:
      return {
        ...state,
        daily_task: [],
        daily_tasks: [],
        daily_tasks_pagination: {
          currentPage:1,
          limit:10,
          previousPage:null,
          nextPage:2,
          totalCount:0,
          totalPages:1,
        },
      };
    default:
      return state;
  }
}

export default dailyTasksReducer;

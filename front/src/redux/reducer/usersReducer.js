import * as t from "../types";

const defaultState = {
  user_view: [],
  users: [],
  total_users: 0,
  users_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const usersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_VIEW_USER:
      return {
        ...state,
        user_view: action.payload,
      };
    case t.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case t.SET_TOTAL_USERS:
      return {
        ...state,
        total_users: action.payload,
      };
    case t.SET_USERS_PAGINATION:
      return {
        ...state,
        users_pagination: action.payload,
      };
    case t.RESET_USERS:
      return {
        ...state,
        users: [],
        total_users: 0,
        users_pagination: {
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

export default usersReducer;

import * as t from "../types";

const defaultState = {
  plan: [],
  plans: [],
  plans_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const plansReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_PLAN:
      return {
        ...state,
        plan: action.payload,
      };
    case t.SET_PLANS:
      return {
        ...state,
        plans: action.payload,
      };
    case t.SET_PLANS_PAGINATION:
      return {
        ...state,
        plans_pagination: action.payload,
      };
    case t.RESET_PLANS:
      return {
        ...state,
        plan: [],
        plans: [],
        plans_pagination: {
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

export default plansReducer;

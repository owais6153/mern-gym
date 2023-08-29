import * as t from "../types";

const defaultState = {
  helpful_tip: [],
  helpful_tips: [],
  helpful_tips_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const helpfulTipsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_HELPFUL_TIP:
      return {
        ...state,
        helpful_tip: action.payload,
      };
    case t.SET_HELPFUL_TIPS:
      return {
        ...state,
        helpful_tips: action.payload,
      };
    case t.SET_HELPFUL_TIPS_PAGINATION:
      return {
        ...state,
        helpful_tips_pagination: action.payload,
      };
    case t.RESET_HELPFUL_TIPS:
      return {
        ...state,
        helpful_tips: [],
        helpful_tips_pagination: {},
        currentPage:1,
        limit:10,
        previousPage:null,
        nextPage:2,
        totalCount:0,
        totalPages:1,
      };
    default:
      return state;
  }
}

export default helpfulTipsReducer;

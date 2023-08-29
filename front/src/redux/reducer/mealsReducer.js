import * as t from "../types";

const defaultState = {
  meal: [],
  meals: [],
  meals_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const mealsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_MEAL:
      return {
        ...state,
        meal: action.payload,
      };
    case t.SET_MEALS:
      return {
        ...state,
        meals: action.payload,
      };
    case t.SET_MEALS_PAGINATION:
      return {
        ...state,
        meals_pagination: action.payload,
      };
    case t.RESET_MEALS:
      return {
        ...state,
        meal: [],
        meals: [],
        meals_pagination: {
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

export default mealsReducer;

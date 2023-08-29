import * as t from "../types";

const defaultState = {
  calorie_by_title: [],
  calorie_calculation: [],
  calorie_calculations: [],
  calorie_calculations_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const calorieCalculationsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_CALORIE_BY_TITLE:
      return {
        ...state,
        calorie_by_title: action.payload,
      };
    case t.SET_CALORIE_CALCULATION:
      return {
        ...state,
        calorie_calculation: action.payload,
      };
    case t.SET_CALORIE_CALCULATIONS:
      return {
        ...state,
        calorie_calculations: action.payload,
      };
    case t.SET_CALORIE_CALCULATIONS_PAGINATION:
      return {
        ...state,
        calorie_calculations_pagination: action.payload,
      };
    case t.RESET_CALORIE_CALCULATIONS:
      return {
        ...state,
        calorie_by_title:[],
        calorie_calculation: [],
        calorie_calculations: [],
        calorie_calculations_pagination: {
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

export default calorieCalculationsReducer;

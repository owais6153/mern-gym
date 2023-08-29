import * as t from "../types";

const defaultState = {
  content_of_the_day: [],
  content_of_the_days: [],
  content_of_the_days_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,},
};

const contentOfTheDaysReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_CONTENT_OF_THE_DAY:
      return {
        ...state,
        content_of_the_day: action.payload,
      };
    case t.SET_CONTENT_OF_THE_DAYS:
      return {
        ...state,
        content_of_the_days: action.payload,
      };
    case t.SET_CONTENT_OF_THE_DAYS_PAGINATION:
      return {
        ...state,
        content_of_the_days_pagination: action.payload,
      };
    case t.RESET_CONTENT_OF_THE_DAYS:
      return {
        ...state,
        content_of_the_day: [],
        content_of_the_days: [],
        content_of_the_days_pagination: {
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

export default contentOfTheDaysReducer;

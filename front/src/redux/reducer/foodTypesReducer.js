import * as t from "../types";

const defaultState = {
  food_type: [],
  food_types: [],
  food_types_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,},
};

const foodTypesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_FOOD_TYPE:
      return {
        ...state,
        food_type: action.payload,
      };
    case t.SET_FOOD_TYPES:
      return {
        ...state,
        food_types: action.payload,
      };
    case t.SET_FOOD_TYPES_PAGINATION:
      return {
        ...state,
        food_types_pagination: action.payload,
      };
    case t.RESET_FOOD_TYPES:
      return {
        ...state,
        food_type: [],
        food_types: [],
        food_types_pagination: {
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

export default foodTypesReducer;

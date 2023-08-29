import * as t from "../types";

const defaultState = {
  workout: [],
  workouts: [],
  workouts_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const workoutsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_WORKOUT:
      return {
        ...state,
        workout: action.payload,
      };
    case t.SET_WORKOUTS:
      return {
        ...state,
        workouts: action.payload,
      };
    case t.SET_WORKOUTS_PAGINATION:
      return {
        ...state,
        workouts_pagination: action.payload,
      };
    case t.RESET_WORKOUTS:
      return {
        ...state,
        workout: [],
        workouts: [],
        workouts_pagination: {
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

export default workoutsReducer;

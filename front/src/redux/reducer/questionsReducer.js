import * as t from "../types";

const defaultState = {
  question: [],
  questions: [],
  questions_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const questionsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_QUESTION:
      return {
        ...state,
        question: action.payload,
      };
    case t.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };
    case t.SET_QUESTIONS_PAGINATION:
      return {
        ...state,
        questions_pagination: action.payload,
      };
    case t.RESET_QUESTIONS:
      return {
        ...state,
        questions: [],
        questions_pagination: {
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

export default questionsReducer;

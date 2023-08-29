import * as t from "../types";
const defaultState = {
  medical_instruction: [],
  medical_instructions: [],
  medical_instructions_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,},
};

const medicalInstructionsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_MEDICAL_INSTRUCTION:
      return {
        ...state,
        medical_instruction: action.payload,
      };
    case t.SET_MEDICAL_INSTRUCTIONS:
      return {
        ...state,
        medical_instructions: action.payload,
      };
    case t.SET_MEDICAL_INSTRUCTIONS_PAGINATION:
      return {
        ...state,
        medical_instructions_pagination: action.payload,
      };
    case t.RESET_MEDICAL_INSTRUCTIONS:
      return {
        ...state,
        medical_instruction: [],
        medical_instructions: [],
        medical_instructions_pagination: {
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

export default medicalInstructionsReducer;

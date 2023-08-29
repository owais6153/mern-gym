import * as t from "../types";

const defaultState = {
  customer: [],
  customers: [],
  customers_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,},
};

const customersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
    case t.SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      };
    case t.SET_CUSTOMERS_PAGINATION:
      return {
        ...state,
        customers_pagination: action.payload,
      };
    case t.RESET_CUSTOMERS:
      return {
        ...state,
        customers: [],
        customers_pagination: {},
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

export default customersReducer;

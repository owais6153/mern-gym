import * as t from "../types";

const defaultState = {
  home_categorie: [],
  home_categories: [],
  home_categories_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
  
};

const homeCategoriesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_HOME_CATEGORIE:
      return {
        ...state,
        home_categorie: action.payload,
      };
    case t.SET_HOME_CATEGORIES:
      return {
        ...state,
        home_categories: action.payload,
      };
    case t.SET_HOME_CATEGORIES_PAGINATION:
      return {
        ...state,
        home_categories_pagination: action.payload,
      };
    case t.RESET_HOME_CATEGORIES:
      return {
        ...state,
        home_categories: [],
        home_categories_pagination: {
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

export default homeCategoriesReducer;

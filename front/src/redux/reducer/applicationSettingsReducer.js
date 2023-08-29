import * as t from "../types";

const defaultState = {
  application_setting: [],
  application_settings: [],
  application_settings_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const applicationSettingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_APPLICATION_SETTING:
      return {
        ...state,
        application_setting: action.payload,
      };
    case t.SET_APPLICATION_SETTINGS:
      return {
        ...state,
        application_settings: action.payload,
      };
    case t.SET_APPLICATION_SETTINGS_PAGINATION:
      return {
        ...state,
        application_settings_pagination: action.payload,
      };
    case t.RESET_APPLICATION_SETTINGS:
      return {
        ...state,
        application_settings: [],
        application_settings_pagination: {
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

export default applicationSettingsReducer;

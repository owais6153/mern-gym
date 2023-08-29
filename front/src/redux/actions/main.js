import * as t from "../types";

export const resetCommonReducerErrorsAction = (data) => async (dispatch, getState) => {
  dispatch({
    type: t.RESET_ERRORS,
    payload: data,
  });
}
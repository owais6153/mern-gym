import * as t from "../types";
import { validationErrors } from "../../helper/ErrorHandler";
import APP_CONSTANTS from "../../constants/app.constant.js"
import axios from 'axios'

export const getHelpFulTipsListAction = (data) => async (dispatch, getState) => {
  let request_status = false;
  let return_data = [];

  dispatch({
      type: t.SET_SHOW_LODER,
      payload: 1,
  });
  const config = {
      headers: { 
        Authorization: `Bearer ${getState().userReducer.token}`,
        userid: getState().userReducer.id
      }
  };
  await axios.get( process.env.REACT_APP_API_URL +'/admin/tips?limit='+APP_CONSTANTS.DEFAULT_LIMIT_PER_PAGE+(data ? '&page='+data:''), config).then((res) => {
      dispatch({
        type: t.SET_HELPFUL_TIPS,
        payload: res.data.data,
      });
      dispatch({
        type: t.SET_HELPFUL_TIPS_PAGINATION,
        payload: res.data.pagination,
      });
      return_data = res.data.meta;
      request_status = true;
      dispatch({
        type: t.SET_SHOW_LODER,
        payload: 0,
      });
  }).catch((err) => {
      dispatch({
          type: t.SET_ERRORS,
          payload: err.response ? err.response.data : (err.response.data ? err.response.data.message:''),
      });
      dispatch({
          type: t.SET_SHOW_LODER,
          payload: 0,
      });
  });
  
  if (request_status) return return_data;
  else return false;
};

export const helpFulTipsViewAction = (data) => async (dispatch, getState) => {
  let request_status = false;
  let return_data = [];

  dispatch({
      type: t.SET_SHOW_LODER,
      payload: 1,
  });
  const config = {
      headers: { 
        Authorization: `Bearer ${getState().userReducer.token}`,
        userid: getState().userReducer.id
      }
  };
  await axios.get( process.env.REACT_APP_API_URL +'/admin/tip/'+data, config).then((res) => {
      dispatch({
        type: t.SET_HELPFUL_TIP,
        payload: res.data.data,
      });
      return_data = res.data.data;
      request_status = true;
      dispatch({
        type: t.SET_SHOW_LODER,
        payload: 0,
      });
  }).catch((err) => {
      dispatch({
          type: t.SET_ERRORS,
          payload: err.response ? err.response.data : (err.response.data ? err.response.data.message:''),
      });
      dispatch({
          type: t.SET_SHOW_LODER,
          payload: 0,
      });
  });
  
  if (request_status) return return_data;
  else return false;
};

export const helpFulTipsUpdateAction = (data, navigate) => async (dispatch, getState) => {
  let request_status = false;
  dispatch({
    type: t.SET_SHOW_LODER,
    payload: 1,
  });

  const config = {
    headers: { 
      Authorization: `Bearer ${getState().userReducer.token}`,
      userid: getState().userReducer.id
    } 
  };

  await axios.patch( process.env.REACT_APP_API_URL +'/admin/tip/'+data.id, data, config).then((res) => {
    
    dispatch({
      type: t.SET_ERRORS,
      payload: {},
    });
    request_status = true;
    navigate('/admin/app-content')
  }).catch((err) => {
    validationErrors(err)
    dispatch({
      type: t.SET_ERRORS,
      payload: err.response.data.data,
    });
  });
  dispatch({
    type: t.SET_SHOW_LODER,
    payload: 0,
  });
  if (request_status) return true;
  else return false;
};

export const helpFulTipsCreateAction = (data, navigate) => async (dispatch, getState) => {
  let request_status = false;
  dispatch({
      type: t.SET_SHOW_LODER,
      payload: 1,
  });

  const config = {
    headers: { 
      Authorization: `Bearer ${getState().userReducer.token}`,
      userid: getState().userReducer.id
    } 
  };

  await axios.post( process.env.REACT_APP_API_URL +'/admin/tip', data, config).then((res) => {
    
    dispatch({
      type: t.SET_ERRORS,
      payload: {},
    });
    request_status = true;
    navigate('/admin/app-content')
  }).catch((err) => {
    validationErrors(err)
    dispatch({
      type: t.SET_ERRORS,
      payload: err.response.data.data,
    });
  });
  dispatch({
    type: t.SET_SHOW_LODER,
    payload: 0,
  });
  if (request_status) return true;
  else return false;
};

export const helpFulTipsDeleteAction = (data_id, navigate) => async (dispatch, getState) => {
  let request_status = false;
  dispatch({
      type: t.SET_SHOW_LODER,
      payload: 1,
  });
  const config = {
    headers: { 
      Authorization: `Bearer ${getState().userReducer.token}`,
      userid: getState().userReducer.id
    } 
  };
  await axios.delete( process.env.REACT_APP_API_URL +'/admin/tip/'+data_id, config).then((res) => {
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 0,
    });
    request_status = true;
  }).catch((err) => {
    validationErrors(err)
  });
  if (request_status) return true;
  else return false;
};
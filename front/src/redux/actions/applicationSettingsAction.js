import * as t from "../types";
import { validationErrors } from "../../helper/ErrorHandler";
import APP_CONSTANTS from "../../constants/app.constant.js"
import axios from 'axios'

export const getApplicationSettingsListAction = (data) => async (dispatch, getState) => {
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
  await axios.get( process.env.REACT_APP_API_URL +'/admin/app-setting?limit='+APP_CONSTANTS.DEFAULT_LIMIT_PER_PAGE+(data ? '&page='+data:''), config).then((res) => {
      dispatch({
        type: t.SET_APPLICATION_SETTINGS,
        payload: res.data.data,
      });
      dispatch({
        type: t.SET_APPLICATION_SETTINGS_PAGINATION,
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

export const ApplicationSettingsViewAction = (data) => async (dispatch, getState) => {
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
  await axios.get( process.env.REACT_APP_API_URL +'/admin/app-setting/'+data, config).then((res) => {
      dispatch({
        type: t.SET_APPLICATION_SETTING,
        payload: res.data.data,
      });
      return_data = res.data.data;
      request_status = true;
      
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
  dispatch({
    type: t.SET_SHOW_LODER,
    payload: 0,
  });
  if (request_status) return return_data;
  else return false;
};

export const ApplicationSettingsUpdateAction = (data, id, navigate) => async (dispatch, getState) => {
  let request_status = false;
  dispatch({
    type: t.SET_SHOW_LODER,
    payload: 1,
  });

  const config = {
    headers: { 
      Authorization: `Bearer ${getState().userReducer.token}`,
      userid: getState().userReducer.id,
      'content-type': 'multipart/form-data'
    } 
  };
  await axios.patch( process.env.REACT_APP_API_URL +'/admin/app-setting/'+id, data, config).then((res) => {
    
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

export const ApplicationSettingsCreateAction = (data, navigate) => async (dispatch, getState) => {
  let request_status = false;
  dispatch({
      type: t.SET_SHOW_LODER,
      payload: 1,
  });

  const config = {
    headers: { 
      Authorization: `Bearer ${getState().userReducer.token}`,
      userid: getState().userReducer.id,
      'content-type': 'multipart/form-data'
    } 
  };

  await axios.post( process.env.REACT_APP_API_URL +'/admin/app-setting', data, config).then((res) => {
    
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

export const ApplicationSettingsDeleteAction = (data_id, navigate) => async (dispatch, getState) => {
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
  console.log("data_id: ",data_id);
  await axios.delete( process.env.REACT_APP_API_URL +'/admin/app-setting/'+data_id, config).then((res) => {
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

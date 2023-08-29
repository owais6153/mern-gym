import * as t from "../types";
import axios from 'axios'

export const getEntitiesListAction = (data) => async (dispatch, getState) => {
  let request_status = false;
  let return_data = [];
  const config = {
      headers: { 
        Authorization: `Bearer ${getState().userReducer.token}`,
        userid: getState().userReducer.id
      }
  };
  await axios.get( process.env.REACT_APP_API_URL +'/admin/entities', config).then((res) => {
      dispatch({
        type: t.SET_ENTITIES,
        payload: res.data.data,
      });
      request_status = true;
  }).catch((err) => {
  });
  
  if (request_status) return return_data;
  else return false;
};

export const getAttributesFromEntitieNameAction = (data) => async (dispatch, getState) => {
  let request_status = false;
  let return_data = [];
  const config = {
      headers: { 
        Authorization: `Bearer ${getState().userReducer.token}`,
        userid: getState().userReducer.id
      }
  };
  await axios.get( process.env.REACT_APP_API_URL +'/admin/entity/attributes/'+data, config).then((res) => {
      dispatch({
        type: t.SET_ATTRIBUTES,
        payload: res.data.data,
      });
      request_status = true;
  }).catch((err) => {
    dispatch({
      type: t.SET_ATTRIBUTES,
      payload: ["id","full_name","email","phone_number","password","age","weight","height"], //for now
    });
  });
  
  if (request_status) return return_data;
  else return false;
};

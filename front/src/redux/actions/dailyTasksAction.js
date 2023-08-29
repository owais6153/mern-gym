import * as t from "../types";
import { validationErrors } from "../../helper/ErrorHandler";
import APP_CONSTANTS from "../../constants/app.constant.js"
import axios from 'axios'
var _ = require('lodash');

export const getDailyTasksListAction = (data, limit) => async (dispatch, getState) => {
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
  await axios.get( process.env.REACT_APP_API_URL +'/admin/daily-tasks?limit='+(limit ? limit : APP_CONSTANTS.DEFAULT_LIMIT_PER_PAGE)+(data ? '&page='+data:''), config).then((res) => {
      dispatch({
        type: t.SET_DAILY_TASKS,
        payload: res.data.data,
      });
      dispatch({
        type: t.SET_DAILY_TASKS_PAGINATION,
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

export const DailyTasksViewAction = (data) => async (dispatch, getState) => {
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
  await axios.get( process.env.REACT_APP_API_URL +'/admin/daily-task/'+data, config).then((res) => {
      dispatch({
        type: t.SET_DAILY_TASK,
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

export const DailyTasksUpdateAction = (data, id, answerInputList, navigate) => async (dispatch, getState) => {
  let newtemp = [];
  for (let i = 0; i < answerInputList.length; i++) {
    newtemp[i] = answerInputList[i];
  }
  _.forEach(newtemp, function(value, key) {
    if(!newtemp[key].description) delete newtemp[key].description; 
    if(!newtemp[key].title) delete newtemp[key].title; 
    if(!newtemp[key].meal_plan_id) delete newtemp[key].meal_plan_id; 
    if(!newtemp[key].workout_id) delete newtemp[key].workout_id; 
    delete newtemp[key].milestone_type; 
    delete newtemp[key].mealPlan; 
    delete newtemp[key].workout; 
  });
  let submit_data = {
    title: data.get('title'),
    description: data.get('description'),
    day: data.get('day'),
    status: 0,
    type: data.get('type'),
    "milestones": newtemp
  }
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
  await axios.patch( process.env.REACT_APP_API_URL +'/admin/daily-task/'+id, submit_data, config).then((res) => {
    dispatch({
      type: t.SET_ERRORS,
      payload: {},
    });
    request_status = true;
    navigate('/admin/DailyTasks')
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

export const DailyTasksCreateAction = (data, answerInputList, navigate) => async (dispatch, getState) => {
  _.forEach(answerInputList, function(value, key) {
    if(!answerInputList[key].description) delete answerInputList[key].description; 
    if(!answerInputList[key].title) delete answerInputList[key].title; 
    if(!answerInputList[key].meal_plan_id) delete answerInputList[key].meal_plan_id; 
    if(!answerInputList[key].workout_id) delete answerInputList[key].workout_id; 
    if(answerInputList[key].is_mandatory == true) answerInputList[key].is_mandatory = 1; 
    else answerInputList[key].is_mandatory = 1; 
    delete answerInputList[key].milestone_type; 
  });
  let submit_data = {
    title: data.get('title'),
    description: data.get('description'),
    day: data.get('day'),
    status: 0,
    type: data.get('type'),
    "milestones": answerInputList
  }
  console.log(submit_data)

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
  await axios.post( process.env.REACT_APP_API_URL +'/admin/daily-task', submit_data, config).then((res) => {
    dispatch({
      type: t.SET_ERRORS,
      payload: {},
    });
    request_status = true;
    navigate('/admin/DailyTasks')
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

export const DailyTasksDeleteAction = (data_id, navigate) => async (dispatch, getState) => {
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
  await axios.delete( process.env.REACT_APP_API_URL +'/admin/daily-task/'+data_id, config).then((res) => {
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

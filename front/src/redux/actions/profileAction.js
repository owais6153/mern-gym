import * as t from "../types";
import axios from 'axios'
import { toast } from "react-toastify";

export const getUserAction = (data) => async (dispatch, getState) => {
  let request_status = false;
  const config = {
      headers: { Authorization: `Bearer ${getState().userReducer.token}` }
  };
  await axios.get( import.meta.env.VITE_API_URL +'/api/authorized/user', config).then((res) => {
      if(res.data.error) {
          dispatch({
              type: t.SET_ERRORS,
              payload: res.data.error,
          });
          
      } else {
          dispatch({
            type: t.SET_USER,
            payload: {
              id:res.data.data.id,
              name:res.data.data.name,
              user_name:res.data.data.user_name,
              email:res.data.data.email,
              bio:res.data.data.bio,
              profile_image:res.data.data.profile_image,
              post_count:res.data.data.post_count,
              followers_count:res.data.data.followers_count,
              following_count:res.data.data.following_count,
            },
          });
          request_status = true;
      }
  }).catch((err) => {
      // console.log(err.response ? err.response.data : err.response.data.message);
      dispatch({
          type: t.SET_ERRORS,
          payload: err.response ? err.response.data : (err.response.data ? err.response.data.message:''),
      });
  });
  
  if (request_status) return true;
  else return false;
};

export const getUserPostListAction = (data, user_id) => async (dispatch, getState) => {
    let request_status = false;
    let return_data = [];

    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    const config = {
        headers: { Authorization: `Bearer ${getState().userReducer.token}` }
    };
    let url = import.meta.env.VITE_API_URL +'/api/authorized/posts'+(data ? "?page="+data : '');
    if(user_id){
      url = url+ '&user_id='+user_id;
    }
    await axios.get(url, config).then((res) => {
        if(res.data.error) {
            dispatch({
                type: t.SET_ERRORS,
                payload: res.data.error,
            });
        } else {
            dispatch({
              type: t.SET_USER_POSTS,
              payload: getState().postReducer.user_posts.concat(res.data.data),
            });
            return_data = res.data;
            request_status = true;
        }
        dispatch({
            type: t.SET_SHOW_LODER,
            payload: 0,
        });
    }).catch((err) => {
        // console.log(err.response ? err.response.data : err.response.data.message);
        toast.error(err.response ? err.response.data : err.response.data.message);
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

export const resetUserPostListAction = () => async (dispatch) => {
  dispatch({
      type: t.RESET_USER_POSTS,
      payload: [],
  });
};

export const updateUserProfileAction = (data) => async (dispatch, getState) => {
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    const config = {
        headers: { 
            Authorization: `Bearer ${getState().userReducer.token}`,
        }
    };
    
    await axios.post( import.meta.env.VITE_API_URL +'/api/authorized/user', data, config).then((res) => {
        if(res.data.error) {
            dispatch({
                type: t.SET_ERRORS,
                payload: res.data.error,
            });
            dispatch({
                type: t.SET_SHOW_LODER,
                payload: 0,
            });
        } else {
            toast.dismiss();
            toast.success("Profile updated succesfully");
            dispatch({
                type: t.SET_USER,
                payload: {
                    id:res.data.data.id,
                    name:res.data.data.name,
                    user_name:res.data.data.user_name,
                    email:res.data.data.email,
                    bio:res.data.data.bio,
                    profile_image:res.data.data.profile_image,
                },
            });
            dispatch({
                type: t.SET_MESSAGE,
                payload: res.data.message ? res.data.message : "",
            });
            dispatch({
                type: t.SET_SHOW_LODER,
                payload: 0,
            });
            dispatch({
                type: t.SET_ERRORS,
                payload: {},
            });
            request_status = true;
        }
        dispatch({
            type: t.SET_SHOW_LODER,
            payload: 0,
        });

    }).catch((err) => {
      
        let message_temp = err.response.data.message.indexOf('(and') > 0 ? 
                            err.response.data.message.slice(0, err.response.data.message.indexOf('(and')) 
                          :
                            err.response.data.message;
        err.response ? toast.error(message_temp) : err.response.data.message
        dispatch({
            type: t.SET_SHOW_LODER,
            payload: 0,
        });
        dispatch({
            type: t.SET_ERRORS,
            payload: err.response ? err.response.data.errors : err.response.data.message,
        });

    });
    
    if (request_status) return true;
    else return false;
};
import * as t from "../types";
import axios from 'axios'

export const userLoginAction = (data, navigate) => async (dispatch) => {
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    await axios.post( process.env.REACT_APP_API_URL +'/web/login', data).then((res) => {
      dispatch({
          type: t.SET_USER_TOKEN,
          payload: res.data.data.token,
      });
      dispatch({
          type: t.SET_USER,
          payload: {
              id:res.data.data.id,
              fullName:res.data.data.fullName,
              email:res.data.data.email,
              isVerified:res.data.data.isVerified,
          },
      });
      dispatch({
          type: t.SET_SHOW_LODER,
          payload: 0,
      });
      navigate('/admin/dashboard')
      request_status = true;
    }).catch((err) => {
        // console.log(err.response ? err.response.data.errors : err.response.data.message);
        dispatch({
            type: t.SET_SHOW_LODER,
            payload: 0,
        });
        console.log(err.response.data.data)
        dispatch({
            type: t.SET_ERRORS,
            payload: err.response.data.data,
        });
    });
   
    if (request_status) return true;
    else return false;
};

export const userSignupAction = (data) => async (dispatch) => {
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    await axios.post( process.env.REACT_APP_API_URL +'/auth/signup', data).then((res) => {
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
        // console.log(err.response ? err.response.data : err.response.data.message);
        // console.log(err.response.data.errors);
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

export const userForgotPasswordResetEmailAction = (data) => async (dispatch) => {
    // console.log(data);
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    await axios.post( process.env.REACT_APP_API_URL +'/auth/password/reset/link/email', data).then((res) => {
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
        // console.log(err.response ? err.response.data : err.response.data.message);
        // console.log(err.response.data.errors);
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

export const userForgotPasswordResetAction = (data) => async (dispatch) => {
    // console.log(data);
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });
    await axios.post( process.env.REACT_APP_API_URL +'/auth/password/reset', data).then((res) => {
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
        // console.log(err.response ? err.response.data : err.response.data.message);
        // console.log(err.response.data.errors);
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

export const userLogoutAction = (data) => async (dispatch, getState) => {
    let request_status = false;
    dispatch({
        type: t.SET_SHOW_LODER,
        payload: 1,
    });

    // const config = {
    //     headers: { Authorization: `Bearer ${getState().userReducer.token}` }
    // };
    // await axios.post( process.env.REACT_APP_API_URL +'/authorized/logout', data, config).then((res) => {
    //     if(res.data.error) {
    //         dispatch({
    //             type: t.SET_ERRORS,
    //             payload: res.data.error,
    //         });
    //         dispatch({
    //             type: t.SET_SHOW_LODER,
    //             payload: 0,
    //         });
    //     } else {
            dispatch({
                type: t.RESET_USER,
                payload: {},
            });
            request_status = true;
    //     }
    //     dispatch({
    //         type: t.SET_SHOW_LODER,
    //         payload: 0,
    //     });
    // }).catch((err) => {
    //     // console.log(err.response ? err.response.data : err.response.data.message);
    //     dispatch({
    //         type: t.SET_SHOW_LODER,
    //         payload: 0,
    //     });
    //     dispatch({
    //         type: t.SET_ERRORS,
    //         payload: err.response ? err.response.data : err.response.data.message,
    //     });
    //     dispatch({
    //       type: t.RESET_USER,
    //       payload: {},
    //     });
    // });
    
    if (request_status) return true;
    else return false;
};
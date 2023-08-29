import * as t from "../types";

const defaultState = {
  id: 0,
  fullName: "",
  email: "",
  profile_image: "",
  token: "",
  isVerified: 0,
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_USER:
      return {
        ...state,
        id: action.payload.id,
        fullName: action.payload.fullName,
        email: action.payload.email,
        profile_image: action.payload.profile_image,
        isVerified: action.payload.isVerified,
      };
    case t.SET_USER_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case t.UPDATE_USER:
      return {
        ...state,
        fullName: action.payload.fullName,
        email: action.payload.email,
        profile_image: action.payload.profile_image,
        token: action.payload.token,
        isVerified: action.payload.isVerified,
      };
    case t.RESET_USER:
      return {
        ...state,
        id: 0,
        fullName: "",
        email: "",
        profile_image: "",
        token: "",
        isVerified: 0,
      };
    default:
      return state;
  }
}

export default userReducer;

import * as t from "../types";

const defaultState = {
    show_loder: 0,
    errors: {},
    message: "",
};

const commonReducer = (state = defaultState, action) => {
    switch (action.type) {
        case t.SET_SHOW_LODER:
        return {
            ...state,
            show_loder: action.payload,
        };
        case t.SET_ERRORS:
            return {
                ...state,
                errors: action.payload,
            };
        case t.RESET_ERRORS:
            return {
                ...state,
                errors: {},
                show_loder: 0,
                message: ""
            };
        case t.SET_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        default:
            return state;
    }
}

export default commonReducer;

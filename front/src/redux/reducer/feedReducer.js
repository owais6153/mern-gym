import * as t from "../types";

const defaultState = {
    feed: [],
};

const feedReducer = (state = defaultState, action) => {
    switch (action.type) {
        case t.SET_FEED:
            return {
                ...state,
                feed: action.payload,
            };
        case t.RESET_FEED:
            return {
                ...state,
                feed: [],
            };
        default:
            return state;
    }
}

export default feedReducer;

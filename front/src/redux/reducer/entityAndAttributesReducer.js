import * as t from "../types";

const defaultState = {
  entities: [],
  attributes: [],
};

const entityAndAttributesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_ENTITIES:
      return {
        ...state,
        entities: action.payload,
      };
    case t.SET_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
      };
    case t.RESET_ENTITY_AND_ATTRIBUTES:
      return {
        ...state,
        entities: [],
        attributes: [],
      };
    default:
      return state;
  }
}

export default entityAndAttributesReducer;

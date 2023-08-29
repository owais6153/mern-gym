import * as t from "../types";

const defaultState = {
  promotion_banner: [],
  promotion_banners: [],
  promotion_banners_pagination: {
    currentPage:1,
    limit:10,
    previousPage:null,
    nextPage:2,
    totalCount:0,
    totalPages:1,
  },
};

const promotionBannersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case t.SET_PROMOTION_BANNER:
      return {
        ...state,
        promotion_banner: action.payload,
      };
    case t.SET_PROMOTION_BANNERS:
      return {
        ...state,
        promotion_banners: action.payload,
      };
    case t.SET_PROMOTION_BANNERS_PAGINATION:
      return {
        ...state,
        promotion_banners_pagination: action.payload,
      };
    case t.RESET_PROMOTION_BANNERS:
      return {
        ...state,
        promotion_banner: [],
        promotion_banners: [],
        promotion_banners_pagination: {
          currentPage:1,
          limit:10,
          previousPage:null,
          nextPage:2,
          totalCount:0,
          totalPages:1,
        },
      };
    default:
      return state;
  }
}

export default promotionBannersReducer;

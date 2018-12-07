import {FETCH_PHOTOS_TO_MODERATE} from "../actions/actionTypes";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_PHOTOS_TO_MODERATE:
      return action.payload;
    default:
      return state;
  }
};

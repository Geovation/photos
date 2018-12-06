import {FETCH_PHOTOS_TO_MODERATE} from "./actionTypes";
import config from "../custom/config";

export const fetchPhotosToModerate = () => async dispatch => {
  if (!unregisterPhotosToModerateObserver) {
    unregisterPhotosToModerateObserver = config.dbModule.onPhotosToModerate(photosToModerate => {
      dispatch({
        type: FETCH_PHOTOS_TO_MODERATE,
        payload: photosToModerate
      });
    });
  }
};

//TODO: it is not exported
export let unregisterPhotosToModerateObserver;

import {FETCH_PHOTOS_TO_MODERATE} from "./actionTypes";
import config from "../custom/config";

let unregisterPhotosToModerateObserver = undefined;

export const startFetchingPhotosToModerate = (dispatch) => async () => {
  if (!unregisterPhotosToModerateObserver) {

    unregisterPhotosToModerateObserver = config.dbModule.onPhotosToModerate(photosToModerate => {
      dispatch({
        type: FETCH_PHOTOS_TO_MODERATE,
        payload: photosToModerate
      });
    });
  }
};

export const stopFetchingPhotosToModerate = () => {
  if (unregisterPhotosToModerateObserver) {
    unregisterPhotosToModerateObserver();
  }
  unregisterPhotosToModerateObserver = undefined;
}

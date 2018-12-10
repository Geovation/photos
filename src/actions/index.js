import {FETCH_PHOTOS_TO_MODERATE} from "./actionTypes";
import dbFirebase from "../dbFirebase";

let unregisterPhotosToModerateObserver = undefined;

export const startFetchingPhotosToModerate = (dispatch) => async () => {
  if (!unregisterPhotosToModerateObserver) {

    unregisterPhotosToModerateObserver = dbFirebase.onPhotosToModerate(photosToModerate => {
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

import {FETCH_PHOTOS_TO_MODERATE, FETCH_FEEDBACKS_TO_MODERATE} from "./actionTypes";
import dbFirebase from "../dbFirebase";

let unregisterToModerateObserver = undefined;

export const stopFetchingToModerate = () => {
  if (unregisterToModerateObserver) {
    unregisterToModerateObserver();
  }
  unregisterToModerateObserver = undefined;
}

export const startFetchingToModerate = (collection, dispatch) => async () => {
  let query, type;
  if (collection === 'photos') {
    query = {field: "moderated", value: null};
    type = FETCH_PHOTOS_TO_MODERATE;
  } else {
    query = {field: "buildNumber", value: "0"};
    type = FETCH_FEEDBACKS_TO_MODERATE;
  }

  if (!unregisterToModerateObserver) {
    unregisterToModerateObserver = dbFirebase.onCollectionToModerate(collection, query, value => {
      dispatch({
        type: type,
        payload: value
      });
    });
  }
};

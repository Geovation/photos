import { put, takeLatest, all } from 'redux-saga/effects'
import _ from "lodash";
import * as localforage from "localforage";

const delay = (ms) => new Promise(res => setTimeout(res, ms))

let waitUnil = 0;

// dont save more than once every 10 seconds
function* saveGeojsonAsync(action) {
  const waitFor = waitUnil - Date.now() + 1 * 1000;
  console.debug(`I'll wait for ${waitFor}`);
  yield delay(waitFor);
  waitUnil = Date.now();
  console.debug("Setting value")
  localforage.setItem("featuresDict", action.payload.featuresDict);
  const geojson = {
    type: "FeatureCollection",
    features: _.map(action.payload.featuresDict, f => f),
  };
  yield put({ type: 'geojson', payload: { geojson } })
}

function* watchSaveGeojsonAsync() {
  yield takeLatest('geojson/async', saveGeojsonAsync)
}

export default function* rootSaga() {
  yield all([
    watchSaveGeojsonAsync()
  ])
}
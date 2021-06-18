import { put, takeLatest, takeEvery, all, delay } from 'redux-saga/effects'
import _ from "lodash";
import * as localforage from "localforage";

let waitUnil = 0;

// TODO: to retrieve it automatically
let featuresDict = {};

// dont save more than once every 10 seconds
function* saveGeojsonAsync(action) {
  const waitFor = waitUnil - Date.now() + 1 * 1000;
  console.debug(`I'll wait for ${waitFor}`);
  yield delay(waitFor);
  waitUnil = Date.now();
  console.debug("Setting value")
  localforage.setItem("featuresDict", featuresDict);
  let geojson = null;
  if (!_.isEmpty(featuresDict)) {
    geojson = {
      type: "FeatureCollection",
      features: _.map(featuresDict, f => f),
    };
  }

  yield put({ type: "SET_GEOJSON", payload: { geojson } })
}

function* watchSaveGeojsonAsync() {
  yield takeLatest("SET_GEOJSON_ASYNC", saveGeojsonAsync)
}


function* modifyFeature(action) {
  const photo = action.payload.photo;

  const feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [photo.location.longitude, photo.location.latitude],
    },
    properties: photo,
  };

  featuresDict[photo.id]=feature
  yield put({ type: "SET_GEOJSON_ASYNC" })
}

function* deleteFeature(action) {
  const photo = action.payload.photo;

  delete featuresDict[photo.id]
  yield put({ type: "SET_GEOJSON_ASYNC" })
}

function* setFeatures(action) {
  featuresDict = action.payload.featuresDict
  yield put({ type: "SET_GEOJSON_ASYNC" })
}

function* watchModifyFeature() {
  yield takeEvery("UPDATE_FEATURE", modifyFeature)
}

function* watchDeleteFeature() {
  yield takeEvery("DELETE_FEATURE", deleteFeature)
}

function* watchSetFeature() {
  yield takeEvery("SET_FEATURES", setFeatures)
}

export default function* rootSaga() {
  yield all([
    watchSaveGeojsonAsync(),
    watchModifyFeature(),
    watchDeleteFeature(),
    watchSetFeature()
  ])
}
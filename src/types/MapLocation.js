import _ from "lodash";

import config from "custom/config";

class MapLocation {
  constructor({
    latitude = config.CENTER[1],
    longitude = config.CENTER[0],
    zoom = config.ZOOM_FLYTO,
    online = false,
    updated = new Date(),
  } = {}) {
    this.latitude = Number(latitude);
    this.longitude = Number(longitude);
    this.zoom = Number(zoom);
    this.online = Boolean(online);
    this.updated = new Date(updated);
  }

  formatted() {
    return {
      latitude: this.latitude.toFixed(7),
      longitude: this.longitude.toFixed(7),
      zoom: this.zoom.toFixed(2),
    };
  }

  urlFormated() {
    const f = this.formatted();
    return `${f.latitude},${f.longitude},${f.zoom}z`;
  }

  getCenter() {
    return [this.longitude, this.latitude];
  }

  isEqual(otherMapLocation) {
    return (
      otherMapLocation &&
      otherMapLocation.formatted &&
      _.isEqual(this.formatted(), otherMapLocation.formatted())
    );
  }
}

export default MapLocation;

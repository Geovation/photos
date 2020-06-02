import _ from "lodash";

import config from "../custom/config";

class MapLocation {
  constructor(latitude, longitude, zoom) {
    this.latitude = isNaN(latitude) ? config.CENTER[1] : Number(latitude);
    this.longitude = isNaN(longitude) ? config.CENTER[0] : Number(longitude);
    this.zoom = isNaN(zoom) ? config.ZOOM_FLYTO : Number(zoom);
  }

  formatted() {
    return {
      latitude: this.latitude.toFixed(7),
      longitude: this.longitude.toFixed(7),
      zoom: this.zoom.toFixed(2)
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

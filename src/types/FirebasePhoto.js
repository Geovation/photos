import firebase from 'firebase/app';

import config from '../custom/config';

class FirebaseFoto {
  constructor(latitude, longitude, field) {
    this.location = new firebase.firestore.GeoPoint(latitude, longitude);
    this[config.PHOTO_FIELD.name] = field;
  }

  toObj() {
    return {
      location: this.location,
      [config.PHOTO_FIELD.name]: this[config.PHOTO_FIELD.name]
    }
  }
}

export default FirebaseFoto;

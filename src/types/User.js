class User {
  constructor(id, displayName, isModerator, email, emailVerified, isAnonymous, phoneNumber, photoURL, description, location, profileURL) {
    this.id = id;
    this.displayName = displayName;
    this.isModerator = isModerator;
    this.email = email;
    this.emailVerified = emailVerified;
    this.isAnonymous = isAnonymous;
    this.phoneNumber = phoneNumber;
    this.photoURL = photoURL;
    this.description = description;
    this.location = location;
    this.profileURL = profileURL;
  }
}

export default User;

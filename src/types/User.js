class User {
  constructor(id, displayName, isModerator, email, emailVerified, isAnonymous, phoneNumber, photoURL) {
    this.id = id;
    this.displayName = displayName;
    this.isModerator = isModerator;
    this.email = email;
    this.emailVerified = emailVerified;
    this.isAnonymous = isAnonymous;
    this.phoneNumber = phoneNumber;
    this.photoURL = photoURL;
  }
}

export default User;

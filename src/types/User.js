class User {
  constructor(id, displayName, groups, email, emailVerified, isAnonymous, phoneNumber, photoURL) {
    this.id = id;
    this.displayName = displayName;
    this.groups = groups;
    this.email = email;
    this.emailVerified = emailVerified;
    this.isAnonymous = isAnonymous;
    this.phoneNumber = phoneNumber;
    this.photoURL = photoURL;
  }
}

export default User;

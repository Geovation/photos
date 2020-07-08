let auth;

// see https://firebase.google.com/docs/auth/admin/custom-claims

const userChange = (change, context) => {
  const after = change.after.data();
  const before = change.before.data();

  // console.log(before);
  // console.log(after);
  // console.log(context.params);

  const fieldsToCheck = ["isModerator", "isAdmin"];

  const newClaims = fieldsToCheck.find(
    (current) => !before || before[current] !== after[current]
  );

  const claims = fieldsToCheck.reduce((acc, current) => {
    acc[current] = Boolean(after[current]);
    return acc;
  }, {});

  // at least one
  if (newClaims) {
    console.log(
      `The user ${context.params.userId} has now Custom User Claims `,
      claims
    );

    return auth.setCustomUserClaims(context.params.userId, claims);
  }

  return true;
};

const isItAdminOrModerator = (anAuth) => {
  auth = anAuth;

  return userChange;
};

exports.isItAdminOrModerator = isItAdminOrModerator;

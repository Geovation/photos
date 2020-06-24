let firestore;
let messaging;

// TODO: send a cloud message of the owner telling him that the photo has been published or rejected
// it will read the token the user profile
const photoPublishedChange = (change, context) => {
  // context.params.photoId (not sure If I need this)
  // change.after.data() == {
  //  ...
  //  userId: "qwerasdfasfd",
  //  publiushed: true/false
  //
  //  ...
  // }
  // The user shouuld contain fcmToken: "asdasasd"

  // console.log(change.after.data());
  const after = change.after.data();
  const before = change.before.data();

  // console.log(before);
  // console.log(after);

  let rtn;

  if (after.published && !before.published) {
    rtn = sendMessage(
      "Photo published",
      context.params.photoId,
      before.owner_id,
      true
    );
  } else if (after.published === false && before.published !== false) {
    rtn = sendMessage(
      "Photo UN-published",
      context.params.photoId,
      before.owner_id,
      false
    );
  }

  return rtn;
};

async function sendMessage(message, photoId, userId, published) {
  // console.log("message ", message);
  // console.log("photoId ", photoId);
  // console.log("userId ", userId);

  // in case we want to send to a topic instead
  // if (userId) {
  //   const msg = {
  //     data: { photoId, message, published: `${published}` },
  //     notification: {
  //       title: `Photo ${published ? "Published" : "un published"}`,
  //       body: message,
  //     },
  //     topic: userId,
  //   };

  //   console.log("I'm goping to send this message:", msg);

  //   return messaging
  //     .send(msg)
  //     .then((response) => {
  //       // Response is a message ID string.
  //       console.log("Successfully sent message:", response);
  //       return true;
  //     })
  //     .catch((error) => {
  //       console.log("Error sending message:", error);
  //     });
  // }

  const user = await firestore.collection("users").doc(userId).get();
  if (user && user.exists) {
    const fcmToken = user.data().fcmToken;

    if (fcmToken) {
      return messaging
        .send({
          data: { photoId, message, published: `${published}` },
          notification: {
            title: `Photo moderated`,
            body: message,
          },
          token: fcmToken,
        })
        .then((response) => {
          console.log("Successfully sent message:", response);
          return true;
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    console.log("user ", user.data());
  }

  return false;
}

const getPhotoPublishedChange = (aFirestore, aMessaging) => {
  firestore = aFirestore;
  messaging = aMessaging;

  return photoPublishedChange;
};

exports.getPhotoPublishedChange = getPhotoPublishedChange;

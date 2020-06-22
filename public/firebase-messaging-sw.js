// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js"
);

let myRequest = new Request("config.json");

fetch(myRequest)
  .then(function (response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(function (response) {
    console.log(response);
    debugger;

    // Initialize the Firebase app in the service worker by passing in
    // your app's Firebase config object.
    // https://firebase.google.com/docs/web/setup#config-object
    firebase.initializeApp(response.FIREBASE);

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = firebase.messaging();

    // messaging.setBackgroundMessageHandler(function (payload) {
    //   debugger;

    //   console.log(
    //     "[firebase-messaging-sw.js] Received background message ",
    //     payload
    //   );
    //   // Customize notification here
    //   const notificationTitle = "Background Message Title";
    //   const notificationOptions = {
    //     body: "Background Message body.",
    //     icon: "/firebase-logo.png",
    //   };

    //   return self.registration.showNotification(
    //     notificationTitle,
    //     notificationOptions
    //   );
    // });
  });

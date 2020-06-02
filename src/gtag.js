import firebase from "firebase/app";

let analytics;

export const gtagInit = () => {
  if (
    window.cordova &&
    window.cordova.plugins &&
    window.cordova.plugins.firebase
  ) {
    analytics = window.cordova.plugins.firebase.analytics;
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "mobile",
      non_interaction: true
    });
  } else {
    analytics = firebase.analytics();
    analytics.logEvent("type", {
      event_category: "Tech",
      event_label: "web",
      non_interaction: true
    });
  }

  analytics.setCurrentScreen("/#");

  analytics.logEvent("app_version", {
    event_category: "Tech",
    event_label: String(process.env.REACT_APP_VERSION),
    non_interaction: true
  });

  analytics.logEvent("build_number", {
    event_category: "Tech",
    event_label: String(process.env.REACT_APP_BUILD_NUMBER),
    non_interaction: true
  });
};

export const gtagPageView = pathname => {
  analytics.setCurrentScreen("/#" + pathname);
};

export const gtagEvent = (
  name,
  category = null,
  label = null,
  non_interaction = false
) => {
  analytics.logEvent(String(name).replace(/ /g, "_"), {
    event_category: String(category),
    event_label: String(label),
    non_interaction: Boolean(non_interaction)
  });
};

export const gtagSetId = id => {
  analytics.setUserId(String(id));
};

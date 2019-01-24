import config from './custom/config';

export const gtagInit = () => {
  if (window.cordova) {
    window.ga.startTrackerWithId(config.GA_TRACKING_ID, 1, () => {
      window.ga.setAppVersion(process.env.REACT_APP_VERSION);
      window.ga.trackEvent('Tech','type','mobile');
      window.ga.trackEvent('Tech','app version',process.env.REACT_APP_VERSION);
      window.ga.trackEvent('Tech','build number',process.env.REACT_APP_BUILD_NUMBER);
      window.ga.trackView('/#/');
    });
  }
  else{
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.GA_TRACKING_ID}`;
    document.body.appendChild(script);

    gtag('js', new Date());
    gtag('config', config.GA_TRACKING_ID, {
      'page_path' : '/#/'
    });

    gtag('event', 'app version', {
      'event_category' : 'Tech',
      'event_label' : process.env.REACT_APP_VERSION,
      'non_interaction': true
    });

    gtag('event', 'build number', {
      'event_category' : 'Tech',
      'event_label' : process.env.REACT_APP_BUILD_NUMBER,
      'non_interaction': true
    });

    gtag('event', 'type', {
      'event_category' : 'Tech',
      'event_label' : 'web',
      'non_interaction': true
    });

  }
}

export const gtagPageView = (pathname) => {
  if (window.cordova) {
    window.ga.trackView('/#' + pathname);
  }
  else{
    gtag('config', config.GA_TRACKING_ID, {
      'page_path' : '/#' + pathname
    });
  }
}

export const gtagEvent = (action,category=null, label=null,non_interaction=false) => {
  if (window.cordova) {
    window.ga.trackEvent(category,action,label);
  }
  else{
    gtag('event', action, {
      'event_category' : category,
      'event_label' : label,
      'non_interaction': non_interaction
    });
  }
}

export const gtagSetId = (id) => {
  if (window.cordova) {
    window.ga.setUserId(id);
  }
  else{
    gtag('set', {
      'userId' : id,
    });
  }
}

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}

export default gtag;

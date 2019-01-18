export const device = () => {
  const agent = navigator.userAgent;
  if (agent.match(/Android/i)){
      return 'Android';
  }
  else if (agent.match(/BlackBerry/i)){
    return 'BlackBerry';
  }
  else if (agent.match(/iPhone|iPad|iPod/i)){
    return 'iOS';
  }
  else if (agent.match(/Opera Mini/i)){
    return 'Opera Mini';
  }
  else if (agent.match(/IEMobile/i)){
    return 'IEMobile';
  }
  else {
    return 'Web';
  }
};

export const isIphoneWithNotchAndCordova = () => {

      // Really basic check for the ios platform
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      // Get the device pixel ratio
    const ratio = window.devicePixelRatio || 1;

      // Define the users device screen dimensions
    const screen = {
      width : window.screen.width * ratio,
      height : window.screen.height * ratio
    };

      // iPhone X Detection
    if (iOS && window.cordova && ((screen.width === 1125 && screen.height === 2436) || (screen.height === 1125 && screen.width === 2436))) {
      return true;
    }
    // iPhone XR Detection
    else if (iOS && window.cordova && ((screen.width === 828 && screen.height === 1792) || (screen.height === 1792 && screen.width === 828))) {
      return true;
    }
    // iPhone XS Max Detection
    else if (iOS && window.cordova && ((screen.width === 1242 && screen.height === 2688) || (screen.height === 1242 && screen.width === 2688))) {
      return true;
    }
    return false;
}

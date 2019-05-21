import config from './custom/config';

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

export const isIphoneAndCordova = !!(device() === 'iOS' && window.cordova);

export const isIphoneWithNotchAndCordova = () => {
  const IPHONEX = {
    width : 1125,
    height: 2436
  }

  const IPHONEXR = {
    width : 828,
    height: 1792
  }

  const IPHONEXSMAX = {
    width : 1242,
    height: 2688
  }

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

  // check if device is iOS and cordova exists
  const cordovaIOS = !!(iOS && window.cordova);

  // check the screen dimensions either in portrait or landscape mode

  // iPhone X Detection
  if (cordovaIOS && ((screen.width === IPHONEX.width && screen.height === IPHONEX.height) || (screen.height === IPHONEX.width && screen.width === IPHONEX.height))) {
    return true;
  }
  // iPhone XR Detection
  else if (cordovaIOS && ((screen.width === IPHONEXR.width && screen.height === IPHONEXR.height) || (screen.height === IPHONEXR.width && screen.width === IPHONEXR.height))) {
    return true;
  }
  // iPhone XS Max Detection
  else if (cordovaIOS && ((screen.width === IPHONEXSMAX.width && screen.height === IPHONEXSMAX.height) || (screen.height === IPHONEXSMAX.width && screen.width === IPHONEXSMAX.height))) {
    return true;
  }
  return false;
}

export function getValueFromTree(tree,value){
  let foundedNode;

  function searchTree(tree,key_to_find) {
    Object.entries(tree).forEach(([key,value]) => {
      if (key_to_find === key){
        foundedNode = value.label;
      }
      if(value.children){
        searchTree(value.children,key_to_find);
      }
    })
  }

  searchTree(tree,value);
  return foundedNode;
}

export function getValueAndAncestorsFromTree(tree,key_to_find){
  const stack = [];
  let listWithNodes = [];

  function findPathOfFoundedNode(tree,key_to_find) {
    Object.entries(tree).forEach(([key,value]) => {
      if (key_to_find === key){
        const foundedNode = value.label
        listWithNodes = [...stack,foundedNode];
      }
      if(value.children){
        stack.push(value.label);
        findPathOfFoundedNode(value.children,key_to_find);
        stack.pop();
      }
    });
  }
  findPathOfFoundedNode(tree,key_to_find);
  return listWithNodes;
}

export function customiseString(page, key) {
  return (config.CUSTOM_STRING[page][key] || key);
}

export default {
  customiseString
}

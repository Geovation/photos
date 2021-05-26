import _ from "lodash";

import config from "../custom/config";

export const device = () => {
  const agent = navigator.userAgent;
  if (agent.match(/Android/i)) {
    return "Android";
  } else if (agent.match(/BlackBerry/i)) {
    return "BlackBerry";
  } else if (agent.match(/iPhone|iPad|iPod/i)) {
    return "iOS";
  } else if (agent.match(/Opera Mini/i)) {
    return "Opera Mini";
  } else if (agent.match(/IEMobile/i)) {
    return "IEMobile";
  } else {
    return "Web";
  }
};

export function getValueFromTree(tree, value) {
  let foundedNode;

  function searchTree(tree, key_to_find) {
    Object.entries(tree).forEach(([key, value]) => {
      if (key_to_find === key) {
        foundedNode = value.label;
      }
      if (value.children) {
        searchTree(value.children, key_to_find);
      }
    });
  }

  searchTree(tree, value);
  return foundedNode;
}

export function getValueAndAncestorsFromTree(tree, key_to_find) {
  const stack = [];
  let listWithNodes = [];

  function findPathOfFoundedNode(tree, key_to_find) {
    Object.entries(tree).forEach(([key, value]) => {
      if (key_to_find === key) {
        const foundedNode = value.label;
        listWithNodes = [...stack, foundedNode];
      }
      if (value.children) {
        stack.push(value.label);
        findPathOfFoundedNode(value.children, key_to_find);
        stack.pop();
      }
    });
  }
  findPathOfFoundedNode(tree, key_to_find);
  return listWithNodes;
}

export function customiseString(page, key) {
  return _.get(config.CUSTOM_STRING, `${page}["${key}"]`, key);
}

const rtn = {
  customiseString,
};
export default rtn;

export const sortArrayByObjectKey = (array, keyName) => {
  return array.sort((a, b) => {
    if (a[keyName] < b[keyName]) {
      return -1;
    }
    if (a[keyName] > b[keyName]) {
      return 1;
    }
    return 0;
  });
};

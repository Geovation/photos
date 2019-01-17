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

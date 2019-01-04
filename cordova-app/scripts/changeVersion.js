module.exports = function(ctx) {
  var configXmlHelper = require('./configXmlHelper');

  var configXml = configXmlHelper.readConfigXML();
  var widget = configXml.getElementsByTagName("widget")[0];

  var version = widget.getAttribute("version");
  var androidVersionCode = widget.getAttribute("android-versionCode");
  var iosCFBundleVersion = widget.getAttribute("ios-CFBundleVersion");

  var versionSplit = version.split(".");
  versionSplit[2] = parseInt(process.env.TRAVIS_BUILD_NUMBER || "0");

  var newAndroidVersionCode = versionSplit[0] * 10000000 + versionSplit[1] * 10000 + versionSplit[2];
  var newVersion = versionSplit.join(".");
  var newIosCFBundleVersion = newVersion;

  console.log("Version:", version);
  console.log("android-versionCode:", androidVersionCode);
  console.log("ios-CFBundleVersion:", iosCFBundleVersion);

  widget.setAttribute("version", newVersion);
  widget.setAttribute("ios-CFBundleVersion", newIosCFBundleVersion);
  widget.setAttribute("android-versionCode", newAndroidVersionCode);

  console.log("New Version:", widget.getAttribute("version"));
  console.log("New android-versionCode:", widget.getAttribute("android-versionCode"));
  console.log("New ios-CFBundleVersion:", widget.getAttribute("ios-CFBundleVersion"));

  configXmlHelper.writeConfigXML(configXml);
};

if (!require.main.loaded) {
  module.exports({
    cmdLine: process.argv.join(" ")
  });
}

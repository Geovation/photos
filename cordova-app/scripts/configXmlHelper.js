var filePath = "config.xml";
var xmldom = require('xmldom');
var fs = require('fs');

module.exports = {
  readConfigXML: function() {
    var DOMParser = xmldom.DOMParser;
    var xmlString = fs.readFileSync(filePath, "utf-8");

    return new DOMParser().parseFromString(xmlString);
  },

  writeConfigXML: function (configXml) {
    var XMLSerializer = xmldom.XMLSerializer;
    var xmlString = new XMLSerializer().serializeToString(configXml);

    fs.writeFileSync(filePath, xmlString, 'utf8');
  }
};

const config =
  process.env.NODE_ENV === "development"
    ? require("../../custom/config.dev.json")
    : require("../../custom/config.prod.json");

export default config;

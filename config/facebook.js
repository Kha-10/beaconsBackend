const axios = require("axios");

const fbApi = axios.create({
  baseURL: "https://graph.facebook.com/v24.0",
});

module.exports = fbApi;

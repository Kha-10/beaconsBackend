const fbApi = require("../config/facebook");

async function getUserAccessToken(code, redirectUri) {
  const tokenRes = await fbApi.get("/oauth/access_token", {
    params: {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: redirectUri,
      code,
    },
  });
  return tokenRes.data.access_token;
}

async function getLongLivedUserToken(shortLivedToken) {
  const res = await fbApi.get("/oauth/access_token", {
    params: {
      grant_type: "fb_exchange_token",
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      fb_exchange_token: shortLivedToken,
    },
  });
  return res.data.access_token;
}

async function getUserPages(userToken) {
  const pagesRes = await fbApi.get("/me/accounts", {
    params: { access_token: userToken },
  });

  return pagesRes.data.data.map((page) => ({
    id: page.id,
    name: page.name,
    category: page.category,
    access_token: page.access_token,
    picture: `/${page.id}/picture?redirect=false&access_token=${page.access_token}`,
  }));
}

async function checkTokenExpiration(pageToken) {
  const res = await fbApi.get("/debug_token", {
    params: {
      input_token: pageToken,
      access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
    },
  });
  const expiresAtUnix = res.data.data.data_access_expires_at;
  
  if (expiresAtUnix === 0) {
    return null;
  }

  return new Date(expiresAtUnix * 1000).toISOString();
}

module.exports = {
  getUserAccessToken,
  getLongLivedUserToken,
  getUserPages,
  checkTokenExpiration,
};

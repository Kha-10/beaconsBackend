const redis = require("../config/redis");
const supabase = require("../config/supabase");

// Map to store pending token fetch promises per user
const tokenPromiseMap = new Map();

const getAccessTokenFromPostgres = async (userId) => {
  try {
    const result = await supabase
      .from("social_accounts")
      .select("access_token,token_expires_at")
      .eq("user_id", userId)
      .eq("platform", "facebook")
      .eq("is_connected", true)
      .single();
    console.log("result", result);

    if (!result.data.access_token) {
      const err = new Error("Access token not found or expired");
      err.status = 401;
      throw err;
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching token from Postgres:", error);
    throw error;
  }
};

const getAccessToken = async (userId) => {
  const cacheKey = `access_token:${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    if (tokenPromiseMap.has(userId)) {
      return tokenPromiseMap.get(userId);
    }

    const tokenPromise = (async () => {
      const { access_token, token_expires_at } =
        await getAccessTokenFromPostgres(userId);
      console.log(
        "access_token, token_expires_at",
        access_token,
        token_expires_at
      );

      if (!access_token || !token_expires_at) {
        const err = new Error("Access token not found or expired");
        err.status = 401;
        throw err;
      }

      if (new Date(token_expires_at) < new Date()) {
        const err = new Error("Access token is expired");
        err.status = 401;
        throw err;
      }

      const ttl = Math.min(
        3600,
        Math.floor((new Date(token_expires_at) - new Date()) / 1000)
      );
      await redis.setex(cacheKey, ttl, access_token);

      return token;
    })().finally(() => tokenPromiseMap.delete(userId));

    tokenPromiseMap.set(userId, tokenPromise);
    return tokenPromise;
  } catch (error) {
    console.error("Token fetch error:", error);
    tokenPromiseMap.delete(userId); // Clean up on error
    throw error;
  }
};

module.exports = { getAccessToken };

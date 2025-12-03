const fbApi = require("../config/facebook");

const getPageInsights = async (token) => {
  try {
    const res = await fbApi.get(
      `/${process.env.PAGE_ID}/insights?metric=page_post_engagements,page_follows,page_impressions_unique&period=days_28&access_token=${token}`
    );
    return res.data;
  } catch (error) {
    const err = new Error(
      error.response?.data?.error?.message || "Failed fetching page insights"
    );
    err.status = error.response?.status;
    throw err;
  }
};

const getPostId = async (token) => {
  try {
    const res = await fbApi.get(
      `/${process.env.PAGE_ID}/published_posts?access_token=${token}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Facebook post data:", error.message);
    const err = new Error(
      error.response?.data?.error?.message || "Failed fetching post data"
    );
    err.status = error.response?.status;
    throw err;
  }
};

const getPostInsights = async (postId, token) => {
  try {
    const metrics = [
      "id",
      "created_time",
      "from",
      "full_picture",
      "permalink_url",
      "is_hidden",
      "properties",
      "shares",
      "attachments{description,media,media_type,title,type,unshimmed_url,url}",
      "comments.summary(true).order(reverse_chronological){message,from,created_time,comment_count}",
      "likes.summary(true)",
    ].join(",");

    const res = await fbApi.get(
      `/${postId}?fields=${metrics}&access_token=${token}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching Facebook post data:",
      error.response?.data?.error || error.message
    );
    const err = new Error(
      error.response?.data?.error?.message || "Failed fetching post data"
    );
    err.status = error.response?.status;
    throw err;
  }
};

module.exports = { fbApi, getPageInsights, getPostInsights, getPostId };

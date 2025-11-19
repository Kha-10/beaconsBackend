const axios = require("axios");

const fbApi = axios.create({
  baseURL: "https://graph.facebook.com/v24.0",
});

const getPageInsights = async () => {
  try {
    const res = await fbApi.get(
      `/${process.env.PAGE_ID}/insights?metric=page_post_engagements,page_follows,page_impressions_unique&period=days_28&access_token=${process.env.ACCESS_TOKEN}`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching Facebook post data:",
      error.response?.data?.error || error.message
    );
    throw error;
  }
};

const getPostId = async () => {
  try {
    const res = await fbApi.get(
      `/${process.env.PAGE_ID}/published_posts?access_token=${process.env.ACCESS_TOKEN}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Facebook post data:", error.message);
    throw error;
  }
};

const getPostInsights = async (postId) => {
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
      `/${postId}?fields=${metrics}&access_token=${process.env.ACCESS_TOKEN}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Facebook post data:",  error.response?.data?.error || error.message);
    throw error;
  }
};

module.exports = { fbApi, getPageInsights, getPostInsights, getPostId };

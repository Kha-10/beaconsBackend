const supabase = require("../config/supabase");
const {
  getUserAccessToken,
  getLongLivedUserToken,
  getUserPages,
  checkTokenExpiration,
} = require("../services/socialAccounts");

const SocialAccountController = {
  create: async (req, res) => {
    const { userId } = req;
    const { code, team_id } = req.body;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    try {
      if (!code || !userId) {
        return res.status(400).json({ error: "Missing code or user_id" });
      }
      const shortLivedToken = await getUserAccessToken(code, redirectUri);

      const userAccessToken = await getLongLivedUserToken(shortLivedToken);

      const pagesRes = await getUserPages(userAccessToken);

      const pages = await Promise.all(
        pagesRes.map(async (page) => {
          const debugRes = await checkTokenExpiration(page.access_token);
          const expires_at = debugRes;

          const { data: existing } = await supabase
            .from("social_accounts")
            .select("id")
            .eq("platform_account_id", page.id)
            .single();

          if (!existing) {
            let res = await supabase.from("social_accounts").insert({
              user_id: userId,
              team_id: team_id || null,
              platform: "facebook",
              platform_account_id: page.id,
              name: page.name,
              category: page.category,
              access_token: page.access_token,
              picture: `https://graph.facebook.com/${page.id}/picture?redirect=false&access_token=${page.access_token}`,
              token_expires_at: expires_at,
              is_connected: true,
            });
            console.log("res", res);
            if (res.error) {
              throw new Error("Error inserting social account:", res.error);
            }
          }

          return {
            id: page.id,
            name: page.name,
            category: page.category,
            picture: `https://graph.facebook.com/${page.id}/picture?redirect=false&access_token=${page.access_token}`,
            expires_at,
          };
        })
      );

      return res.json({ pages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = SocialAccountController;

const supabase = require("../config/supabase");
const {
  getUserAccessToken,
  getLongLivedUserToken,
  getUserPages,
  checkTokenExpiration,
} = require("../services/socialAccounts");

const SocialAccountController = {
  get: async (req, res) => {
    const { code, user_id, team_id } = req.body;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
    try {
      if (!code || !user_id) {
        return res.status(400).json({ error: "Missing code or user_id" });
      }
      const tokenRes = await getUserAccessToken(code, redirectUri);
      const shortLivedToken = tokenRes.data.access_token;

      const longLivedRes = await getLongLivedUserToken(shortLivedToken);
      const userAccessToken = longLivedRes.data.access_token;

      const pagesRes = await getUserPages(userAccessToken);

      const pages = await Promise.all(
        pagesRes.data.data.map(async (page) => {
          const debugRes = await checkTokenExpiration(page.access_token);
          const expires_at = debugRes.data.data.expires_at;

          const { data: existing } = await supabase
            .from("social_accounts")
            .select("id")
            .eq("platform_account_id", page.id)
            .single();

          if (!existing) {
            await supabase.from("social_accounts").insert({
              user_id,
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

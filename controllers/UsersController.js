const supabase = require("../config/supabase");

const UserController = {
  createProfile: async (req, res) => {
    try {
      const { id, email, name, avatar_url } = req.body;

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .single();

      if (existing) {
        return res.json({ message: "Profile exists" });
      }

      // Create profile
      const user = await supabase.from("profiles").insert({
        id,
        email,
        name,
        avatar_url,
      });

      res.json({ message: user.data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;

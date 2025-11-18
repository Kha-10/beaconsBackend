const supabase = require("../config/supabase");

const UserController = {
  index: async (req, res) => {
    try {
      console.log("i work");

      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;
      console.log("data", data);

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = UserController;

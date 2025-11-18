const express = require("express");

require("dotenv").config();

const morgan = require("morgan");

// const productRoutes = require("./routes/products");

// const categoryRoutes = require("./routes/category");

// const cartRoutes = require("./routes/cart");

const userRoutes = require("./routes/users");

const analyticsRoutes = require("./routes/analytics");
// const customerRoutes = require("./routes/customer");

// const orderRoutes = require("./routes/orders");

// const analyticsRoutes = require("./routes/analytics");

// const storeRoutes = require("./routes/store");

// const publicStore = require("./routes/publicStore");

const cors = require("cors");

const cookieParser = require("cookie-parser");

// const authMiddleware = require("./middlewares/authMiddleware");
// const resolveSlugMiddleware = require("./middlewares/resolveSlugMiddleware");

const app = express();

app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`app is running on localhost:${PORT}`);
});

app.use(morgan("dev"));

app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

// CREATE - Add new record
// app.post("/users", async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     const { data, error } = await supabase
//       .from("users")
//       .insert([{ name, email }])
//       .select();

//     if (error) throw error;

//     res.status(201).json(data);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/analytics", analyticsRoutes);

// app.use("/api/stores/:storeId/products", authMiddleware, productRoutes);

// app.use("/api/stores/:storeId/categories", authMiddleware, categoryRoutes);

// app.use("/api/stores/:storeId/cart", authMiddleware, cartRoutes);

// app.use("/api/stores/:storeId/customers", authMiddleware, customerRoutes);

// app.use("/api/stores/:storeId/orders", authMiddleware, orderRoutes);

// app.use("/api/stores/:storeId/analytics", authMiddleware, analyticsRoutes);

// app.use("/api/stores/:storeSlug", publicStore);

// app.use("/api/stores", authMiddleware, storeRoutes);

// app.use("/api/users", userRoutes);

// app.use(
//   "/api/public/stores/:storeSlug/categories",
//   resolveSlugMiddleware,
//   categoryRoutes
// );

// app.use(
//   "/api/public/stores/:storeSlug/products",
//   resolveSlugMiddleware,
//   productRoutes
// );

// app.use(
//   "/api/public/stores/:storeSlug/cart",
//   resolveSlugMiddleware,
//   cartRoutes
// );

// app.use(
//   "/api/public/stores/:storeSlug/orders",
//   resolveSlugMiddleware,
//   orderRoutes
// );

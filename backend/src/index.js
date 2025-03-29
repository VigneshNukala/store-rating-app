require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const { database } = require("./db/db.js");

const authRouter = require("./routes/authRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const storeOwnerRouter = require("./routes/storeOwnerRoutes.js");
const authenticateToken = require("./middleware/authMiddleware.js");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());

// Start the server
const startServer = async () => {
  try {
    await database.connect();
    await database.createTables();

    app.use("/auth", authRouter);
    // app.use("/admin", authenticateToken, adminRouter);
    // app.use("/users", userRouter);
    // app.use("/store-owner", authenticateToken, storeOwnerRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

startServer();

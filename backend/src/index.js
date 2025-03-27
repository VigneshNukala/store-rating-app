require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { database } = require("./db/db.js");
const authRouter = require("./routes/authRoutes.js");
// const productRouter = require("./routes/productsRoute.js");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Start the server
const startServer = async () => {
  try {
      await database.connect();
      await database.createTable();
      app.use("/auth", authRouter);
    // app.use("/products", productRouter);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

startServer();

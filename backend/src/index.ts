import express from 'express';
const app = express();

import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";
import userRouter from "./routes/userRoutes";
import storeOwnerRouter from "./routes/storeOwnerRoutes";
import { authenticateToken } from "./middleware/authMiddleware";
import { database } from './db/db';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://store-rating-app-five.vercel.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(cookieParser());

// Start the server
const startServer = async () => {
  try {
    await database.connect();
    await database.createTables();

    app.use("/auth", authRouter);
    app.use("/admin", authenticateToken, adminRouter);
    app.use("/user", userRouter);
    app.use("/owner", authenticateToken, storeOwnerRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

startServer();

export default app;

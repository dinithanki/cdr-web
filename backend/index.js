import express from "express";
import connectDB from "./config/db.js";
import { protect } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());

// connect database
connectDB();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running ");
});

// routes
app.use("/api/users", userRoutes);

// error handler

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

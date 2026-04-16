import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';




connectDB();

const app = express();

// Middlewares FIRST
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
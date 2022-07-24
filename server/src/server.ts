import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import morgan from "morgan";
import morganBody from "morgan-body";
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import contestantRoutes from './routes/contestant';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, "../.env") });
import "./config/database";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(helmet({crossOriginEmbedderPolicy: false}));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contestant", contestantRoutes);

app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  morganBody(app);
}

app.listen(PORT, () => {
  console.log(`Now listening to port ${PORT}`);
});
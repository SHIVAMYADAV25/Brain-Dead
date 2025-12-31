// src/server.ts
import express, { type Application } from 'express';
import cors from "cors"

const app :Application = express();

app.use(express.json());
app.use(cors());

import AuthRouter from "./routes/auth.route.js"
import ContentRouter from "./routes/content.route.js";
import { userMiddleware } from './middlewares/auth.middleware.js';

app.use("/api/v1/user",AuthRouter);
app.use("/ap1/v1/content",userMiddleware,ContentRouter);

export default app
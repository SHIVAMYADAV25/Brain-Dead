// src/server.ts
import express, { type Application } from 'express';
import cors from "cors"

const app :Application = express();

app.use(express.json());
app.use(cors());

import AuthRouter from "./routes/auth.route.js"
import ContentRouter from "./routes/content.route.js";
import { userMiddleware } from './middlewares/auth.middleware.js';
import PageRouter from "./routes/page.route.js"
import projectRouter from "./routes/project.route.js";

app.use("/api/v1/user",AuthRouter);
app.use("/api/v1/content",userMiddleware,ContentRouter);
app.use("/api/v1/page",userMiddleware,PageRouter);
app.use("/api/v1/project",userMiddleware,projectRouter);

export default app
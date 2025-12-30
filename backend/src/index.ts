// src/server.ts
import express, { type Application } from 'express';
import AuthRouter from "./routes/auth.route.js"
import cors from "cors"

const app :Application = express();

app.use(express.json());
app.use(cors());

app.use("api/v1/user",AuthRouter);

export default app
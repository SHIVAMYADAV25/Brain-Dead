import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config.js";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwtConfig.verify(token);
    // console.log(decoded);

    if (typeof decoded !== "object" || !("userId" in decoded)) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = (decoded as JwtPayload & { userId: string }).userId;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

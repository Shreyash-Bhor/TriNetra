import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: "admin" | "volunteer" | "user";
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // 1️⃣ Prefer token from cookies (task requirement)
    let token = req.cookies?.accessToken;

    // 2️⃣ Fallback to Authorization header (optional)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authentication token missing",
      });
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: (decoded.role as "admin" | "volunteer" | "user") || "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired access token",
    });
  }
}

const ROLE_PRIORITY: Record<"user" | "volunteer" | "admin", number> = {
  user: 1,
  volunteer: 2,
  admin: 3,
};

export function requireRole(
  ...allowedRoles: ("user" | "volunteer" | "admin")[]
) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    const userRole = req.user.role || "user";
    const userRank = ROLE_PRIORITY[userRole];

    const minAllowedRank = Math.min(
      ...allowedRoles.map((r) => ROLE_PRIORITY[r])
    );

    if (userRank >= minAllowedRank) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Access Denied: insufficient permissions" });
  };
}

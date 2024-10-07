import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/prisma.mjs";
import { AuthenticationError, AuthorizationError } from "../errors/index.mjs";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader)
        throw new AuthenticationError("Authentication failed", {
          error: "Authorization header is missing",
        });

      const token = authHeader.split(" ")[1];

      if (!token)
        throw new AuthenticationError("Authentication failed", {
          error: "Token is missing",
        });

      const decode = jwt.verify(token, JWT_SECRET_KEY);

      const user = await prisma.users.findUnique({
        where: {
          id: decode.id,
        },
      });

      if (!user)
        throw new AuthorizationError("Authorization failed", {
          error: "User not found",
        });

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import {
  AuthenticationError,
  AuthorizationError,
  CustomError,
} from "../../errors/index.mjs";
import { AuthenticationErrorHandler } from "./auth_error.mjs";
import { CustomErrorHandler } from "./custom_error.mjs";
import { JWTErrorHandler } from "./jwt_error.mjs";
import {
  prismaErrorHandler,
  prismaInitializationErrorHandler,
  prismaRustPanicErrorHandler,
  prismaUnknownErrorHandler,
  prismaValidationErrorHandler,
} from "./prisma_error.mjs";
import { zodErrorHandler } from "./zod_error.mjs";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) return zodErrorHandler(err, res);

  if (err instanceof jwt.JsonWebTokenError) return JWTErrorHandler(err, res);

  if (err instanceof AuthenticationError)
    return AuthenticationErrorHandler(err, res);

  if (err instanceof AuthorizationError)
    return AuthenticationErrorHandler(err, res);

  if (err instanceof Prisma.PrismaClientKnownRequestError)
    return prismaErrorHandler(err, res);

  if (err instanceof Prisma.PrismaClientUnknownRequestError)
    return prismaUnknownErrorHandler(err, res);

  if (err instanceof Prisma.PrismaClientValidationError)
    return prismaValidationErrorHandler(err, res);

  if (err instanceof Prisma.PrismaClientInitializationError)
    return prismaInitializationErrorHandler(err, res);

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return prismaRustPanicErrorHandler(err, res);
  }

  if (err instanceof CustomError) return CustomErrorHandler(err, res);

  // Generic error handling
  return res.status(500).json({
    error: err.message || "An unknown error occurred.",
  });
}

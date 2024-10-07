import { Router } from "express";
import {
  register,
  login,
  getUser,
  getUserWithMail,
} from "../controllers/user_controller.mjs";
import { auth } from "../middleware/auth.mjs";

const UserRoutes = Router();

UserRoutes.post("/auth/register", register);
UserRoutes.post("/auth/login", login);
UserRoutes.get("/auth/get-user", auth(), getUser);
UserRoutes.post("/auth/get-user-with-email", getUserWithMail);

export default UserRoutes;

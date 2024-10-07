import {
  create,
  getAll,
  getById,
  getActivityById,
  updateBoardTitle,
  updateBoardDescription,
  updateBackground,
  addMember,
} from "../controllers/board_controller.mjs";
import { Router } from "express";
import { auth } from "../middleware/index.mjs";

const BoardRoutes = Router();

BoardRoutes.get("/", auth(), getAll);
BoardRoutes.get("/:b_id", auth(), getById);
BoardRoutes.post("/:b_id/add-member", auth(), addMember);
BoardRoutes.put("/:b_id/update-background", auth(), updateBackground);
BoardRoutes.put(
  "/:b_id/update-board-description",
  auth(),
  updateBoardDescription
);
BoardRoutes.put("/:b_id/update-board-title", auth(), updateBoardTitle);
BoardRoutes.post("/create", auth(), create);
BoardRoutes.get("/:b_id/activity", auth(), getActivityById);

export default BoardRoutes;

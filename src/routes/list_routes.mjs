import { Router } from "express";
import {
  updateListTitle,
  create,
  getAll,
  deleteById,
  updateCardOrder,
  updateListOrder,
} from "../controllers/list_controller.mjs";
import { auth } from "../middleware/auth.mjs";

const ListRoutes = Router();

ListRoutes.get("/:b_id", auth(), getAll);
ListRoutes.put("/:b_id/:l_id/update-title", auth(), updateListTitle);
ListRoutes.post("/create", auth(), create);
ListRoutes.delete("/:b_id/:listId", auth(), deleteById);
ListRoutes.post("/change-card-order", auth(), updateCardOrder);
ListRoutes.post("/change-list-order", auth(), updateListOrder);

export default ListRoutes;

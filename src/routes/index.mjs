import { Router } from "express";
import express from "express";
import UserRoutes from "./user_routes.mjs";
import BoardRoutes from "./board_routes.mjs";
import ListRoutes from "./list_routes.mjs";
import CardRoutes from "./card_routes.mjs";

const router = Router();

router.use("/api", UserRoutes);
router.use("/boards", BoardRoutes);
router.use("/lists", ListRoutes);
router.use("/cards", CardRoutes);
router.use("/api/uploaded", express.static("upoadedFile"));

export default router;

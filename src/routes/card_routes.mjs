import { Router } from "express";
import {
  deleteById,
  updateCover,
  updateAttachment,
  addAttachment,
  updateStartDueDates,
  updateDateCompleted,
  deleteChecklistItem,
  setChecklistItemText,
  setChecklistItemCompleted,
  addChecklistItem,
  deleteChecklist,
  updateLabelSelection,
  deleteLabel,
  updateLabel,
  createLabel,
  addMember,
  deleteMember,
  create,
  getCard,
  update,
  addComment,
  updateComment,
  deleteComment,
  deleteAttachment,
  createChecklist,
} from "../controllers/card_controller.mjs";
import { auth } from "../middleware/auth.mjs";

const CardRoutes = Router();

CardRoutes.delete(
  "cards/:boardId/:listId/:cardId/delete-card",
  auth(),
  deleteById
);
CardRoutes.put("/:boardId/:listId/:cardId/update-cover", auth(), updateCover);
CardRoutes.put(
  "/:boardId/:listId/:cardId/:attachmentId/update-attachment",
  auth(),
  updateAttachment
);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:attachmentId/delete-attachment",
  auth(),
  deleteAttachment
);
CardRoutes.post(
  "/:boardId/:listId/:cardId/add-attachment",
  auth(),
  addAttachment
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/update-dates",
  auth(),
  updateStartDueDates
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/update-date-completed",
  auth(),
  updateDateCompleted
);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:checklistId/:checklistItemId/delete-checklist-item",
  auth(),
  deleteChecklistItem
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-text",
  auth(),
  setChecklistItemText
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-completed",
  auth(),
  setChecklistItemCompleted
);
CardRoutes.post(
  "/:boardId/:listId/:cardId/:checklistId/add-checklist-item",
  auth(),
  addChecklistItem
);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:checklistId/delete-checklist",
  auth(),
  deleteChecklist
);
CardRoutes.post(
  "/:boardId/:listId/:cardId/create-checklist",
  auth(),
  createChecklist
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/:labelId/update-label-selection",
  auth(),
  updateLabelSelection
);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:labelId/delete-label",
  auth(),
  deleteLabel
);
CardRoutes.put(
  "/:boardId/:listId/:cardId/:labelId/update-label",
  auth(),
  updateLabel
);
CardRoutes.post("/:boardId/:listId/:cardId/create-label", auth(), createLabel);
CardRoutes.post("/:boardId/:listId/:cardId/add-member", auth(), addMember);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:memberId/delete-member",
  auth(),
  deleteMember
);
CardRoutes.post("/create", auth(), create);
CardRoutes.get("/:boardId/:listId/:cardId", auth(), getCard);
CardRoutes.put("/:boardId/:listId/:cardId", auth(), update);
CardRoutes.post("/:boardId/:listId/:cardId/add-comment", auth(), addComment);
CardRoutes.put("/:boardId/:listId/:cardId/:commentId", auth(), updateComment);
CardRoutes.delete(
  "/:boardId/:listId/:cardId/:commentId",
  auth(),
  deleteComment
);

export default CardRoutes;

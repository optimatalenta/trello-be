import * as cardService from "../services/card_service.mjs";
import { prisma } from "../../prisma/prisma.mjs";

export const create = async (req, res) => {
  const { title, listId, boardId } = req.body;
  const user = req.user;

  if (!(title && listId && boardId)) {
    return res.status(400).send({
      errMessage:
        "The create operation could not be completed because there is missing information",
    });
  }

  try {
    const result = await cardService.create(title, listId, boardId, user.id);
    console.log("User ID:", user.id);
    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteById = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteById(cardId, listId, boardId, user);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const getCard = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.getCard(cardId, listId, boardId, user);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const update = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;

  // Log the IDs to verify they are received
  console.log("boardId:", boardId);
  console.log("listId:", listId);
  console.log("cardId:", cardId);
  console.log("user:", user);

  try {
    const result = await cardService.update(
      cardId,
      listId,
      boardId,
      user,
      req.body
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const addComment = async (req, res, next) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.addComment(
      cardId,
      listId,
      boardId,
      user,
      req.body
    );
    return res.status(200).send({
      status: true,
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res) => {
  const { boardId, listId, cardId, commentId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.updateComment(
      cardId,
      listId,
      boardId,
      commentId,
      user,
      req.body
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { boardId, listId, cardId, commentId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteComment(
      cardId,
      listId,
      boardId,
      commentId,
      user
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const addMember = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;
  const { memberId } = req.body;

  try {
    const result = await cardService.addMember(
      cardId,
      listId,
      boardId,
      user,
      memberId
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteMember = async (req, res) => {
  const { boardId, listId, cardId, memberId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteMember(
      cardId,
      listId,
      boardId,
      user,
      memberId
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const createLabel = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;
  const label = req.body;

  try {
    const result = await cardService.createLabel(
      cardId,
      listId,
      boardId,
      user,
      label
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateLabel = async (req, res) => {
  const { boardId, listId, cardId, labelId } = req.params;
  const user = req.user;
  const label = req.body;

  try {
    const result = await cardService.updateLabel(
      cardId,
      listId,
      boardId,
      labelId,
      user,
      label
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteLabel = async (req, res) => {
  const { boardId, listId, cardId, labelId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteLabel(
      cardId,
      listId,
      boardId,
      labelId,
      user
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateLabelSelection = async (req, res) => {
  const { boardId, listId, cardId, labelId } = req.params;
  const user = req.user;
  const { selected } = req.body;

  try {
    const result = await cardService.updateLabelSelection(
      cardId,
      listId,
      boardId,
      labelId,
      user,
      selected
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const createChecklist = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;
  const { title } = req.body;

  try {
    const result = await cardService.createChecklist(
      cardId,
      listId,
      boardId,
      user,
      title
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteChecklist = async (req, res) => {
  const { boardId, listId, cardId, checklistId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteChecklist(
      cardId,
      listId,
      boardId,
      checklistId,
      user
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const addChecklistItem = async (req, res) => {
  const { boardId, listId, cardId, checklistId } = req.params;
  const user = req.user;
  const { text } = req.body;

  try {
    const result = await cardService.addChecklistItem(
      cardId,
      listId,
      boardId,
      user,
      checklistId,
      text
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const setChecklistItemCompleted = async (req, res) => {
  const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;
  const user = req.user;
  const { completed } = req.body;

  try {
    const result = await cardService.setChecklistItemCompleted(
      cardId,
      listId,
      boardId,
      user,
      checklistId,
      checklistItemId,
      completed
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const setChecklistItemText = async (req, res) => {
  const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;
  const user = req.user;
  const { text } = req.body;

  try {
    const result = await cardService.setChecklistItemText(
      cardId,
      listId,
      boardId,
      user,
      checklistId,
      checklistItemId,
      text
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteChecklistItem = async (req, res) => {
  const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;
  const user = req.user;

  try {
    const result = await cardService.deleteChecklistItem(
      cardId,
      listId,
      boardId,
      user,
      checklistId,
      checklistItemId
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateStartDueDates = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;
  const { startDate, dueDate, dueTime } = req.body;

  try {
    const result = await cardService.updateStartDueDates(
      cardId,
      listId,
      boardId,
      user,
      startDate,
      dueDate,
      dueTime
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateDateCompleted = async (req, res) => {
  const { boardId, listId, cardId } = req.params;
  const user = req.user;
  const { completed } = req.body;

  try {
    const result = await cardService.updateDateCompleted(
      cardId,
      listId,
      boardId,
      user,
      completed
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const addAttachment = async (cardId, boardId, user, link, name) => {
  try {
    const isMember = await prisma.boards.findUnique({
      where: { id: boardId },
      include: { users: true },
    });

    if (!isMember || !isMember.users.some((u) => u.id === user.id)) {
      throw new Error("You are not a member of this board");
    }

    const attachment = await prisma.attachments.create({
      data: {
        link,
        name,
        card: { connect: { id: cardId } },
      },
    });

    return attachment;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteAttachment = async (boardId, user, attachmentId) => {
  try {
    const isMember = await prisma.boards.findUnique({
      where: { id: boardId },
      include: { users: true },
    });

    if (!isMember || !isMember.users.some((u) => u.id === user.id)) {
      throw new Error("You are not a member of this board");
    }

    await prisma.attachments.delete({
      where: { id: attachmentId },
    });

    return { message: "Attachment deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAttachment = async (
  boardId,
  user,
  attachmentId,
  link,
  name
) => {
  try {
    const isMember = await prisma.boards.findUnique({
      where: { id: boardId },
      include: { users: true },
    });

    if (!isMember || !isMember.users.some((u) => u.id === user.id)) {
      throw new Error("You are not a member of this board");
    }

    const updatedAttachment = await prisma.attachments.update({
      where: { id: attachmentId },
      data: { link, name },
    });

    return updatedAttachment;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCover = async (
  cardId,
  listId,
  boardId,
  user,
  color,
  isSizeOne
) => {
  try {
    const isMember = await prisma.boards.findUnique({
      where: { id: boardId },
      include: { users: true },
    });

    if (!isMember || !isMember.users.some((u) => u.id === user.id)) {
      throw new Error("You are not a member of this board");
    }

    const updatedCard = await prisma.cards.update({
      where: { id: cardId },
      data: { coverColor: color, isSizeOne },
    });

    return updatedCard;
  } catch (error) {
    throw new Error(error.message);
  }
};

import { prisma } from "../../prisma/prisma.mjs";

export const createList = async (model, user) => {
  const boardId = parseInt(model.boardId);
  try {
    const newList = await prisma.lists.create({
      data: {
        title: model.title,
        boardId: boardId,
      },
    });

    const ownerBoard = await prisma.boards.findUnique({
      where: { id: parseInt(model.boardId) },
    });

    if (!ownerBoard) {
      return { errMessage: "Board not found" };
    }

    await prisma.board_activities.create({
      data: {
        board_id: parseInt(ownerBoard.id),
        user_id: user.id,
        name: user.name,
        action: `added ${newList.title} to this board`,
        color: user.color,
      },
    });

    return newList;
  } catch (error) {
    console.error("Error creating lists:", error);
    throw error;
  }
};

export const getAll = async (boardId) => {
  try {
    const lists = await prisma.lists.findMany({
      where: { boardId: parseInt(boardId) },
      include: { cards: true },
    });

    return lists;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteById = async (listId, boardId, user, callback) => {
  try {
    const list = await prisma.lists.findUnique({
      where: { id: listId },
    });

    if (!list || list.boardId !== boardId) {
      return callback({ errMessage: "List or board information is wrong" });
    }

    const userBoards = await prisma.boards.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });

    const userBoardIds = userBoards.map((board) => board.id);
    if (!userBoardIds.includes(boardId)) {
      return callback({
        errMessage:
          "You cannot delete a list that does not belong to your boards",
      });
    }

    await prisma.cards.deleteMany({ where: { listId } });
    await prisma.lists.delete({ where: { id: listId } });

    await prisma.board_activities.create({
      data: {
        boardId,
        userId: user.id,
        name: user.name,
        action: `deleted ${list.title} from this board`,
        color: user.color,
      },
    });

    return callback(false, list);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
export const updateCardOrder = async (
  boardId,
  sourceId,
  destinationId,
  destinationIndex,
  cardId,
  user,
  callback
) => {
  try {
    const sourceList = await prisma.lists.findUnique({
      where: { id: sourceId },
    });
    const destinationList = await prisma.lists.findUnique({
      where: { id: destinationId },
    });
    const card = await prisma.cards.findUnique({ where: { id: cardId } });

    if (
      !sourceList ||
      !destinationList ||
      !card ||
      sourceList.boardId !== boardId
    ) {
      return callback({ errMessage: "List or board information is wrong" });
    }

    // Update the card's listId and position
    await prisma.cards.update({
      where: { id: cardId },
      data: {
        listId: destinationId,
        position: destinationIndex,
      },
    });

    // Add card activity if moved to a different list
    if (sourceId !== destinationId) {
      await prisma.cardsActivity.create({
        data: {
          cardId: card.id,
          text: `moved this card from ${sourceList.title} to ${destinationList.title}`,
          userName: user.name,
          color: user.color,
        },
      });
    }

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

export const updateListOrder = async (
  boardId,
  destinationIndex,
  listId,
  callback
) => {
  try {
    const list = await prisma.lists.findUnique({ where: { id: listId } });

    if (!list || list.boardId !== boardId) {
      return callback({ errMessage: "List or board information is wrong" });
    }

    await prisma.lists.update({
      where: { id: listId },
      data: { position: destinationIndex },
    });

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

export const updateListTitle = async (
  listId,
  boardId,
  user,
  title,
  callback
) => {
  try {
    const list = await prisma.lists.findUnique({ where: { id: listId } });

    if (!list || list.boardId !== boardId) {
      return callback({ errMessage: "List or board information is wrong" });
    }

    const userBoards = await prisma.boards.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });

    const userBoardIds = userBoards.map((board) => board.id);
    if (!userBoardIds.includes(boardId)) {
      return callback({
        errMessage:
          "You cannot update a list that does not belong to your boards",
      });
    }

    await prisma.lists.update({
      where: { id: listId },
      data: { title },
    });

    return callback(false, { message: "Success" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

import { prisma } from "../../prisma/prisma.mjs";

// export const validateCardOwners = async (
//   cardId = null,
//   listId,
//   boardId,
//   userId,
//   isCreate = false
// ) => {
//   if (!cardId || !listId || !boardId || !userId) return false;

//   try {
//     const card = await prisma.cardss.findUnique({ where: { id: cardId } });
//     const list = await prisma.listss.findUnique({ where: { id: listId } });
//     const board = await prisma.boards.findUnique({ where: { id: boardId } });
//     const user = await prisma.userss.findUnique({ where: { id: userId } });

//     if (!card || !list || !board || !user) return false;

//     const validate =
//       isCreate ||
//       (
//         await prisma.listss.findMany({
//           where: { id: listId },
//           include: { cards: true },
//         })
//       ).some((list) => list.cards.some((c) => c.id === cardId));

//     const validate2 = (
//       await prisma.boards.findUnique({
//         where: { id: boardId },
//         include: { lists: true },
//       })
//     ).lists.some((l) => l.id === listId);

//     const validate3 = user.boards.some((b) => b.id === boardId);

//     return validate && validate2 && validate3;
//   } catch (error) {
//     console.error("Error in validateCardOwners:", error);
//     return false;
//   }
// };

export const validateCardOwners = async (
  cardId = null,
  listId,
  boardId,
  userId,
  isCreate = false
) => {
  console.log("Raw userId in validateCardOwners:", userId);
  if (!listId || !boardId || !userId)
    return { valid: false, message: "Missing required IDs." };

  try {
    const parsedListId = parseInt(listId);
    const parsedBoardId = parseInt(boardId);
    const parsedUserId = parseInt(userId);
    const parsedCardId = cardId ? parseInt(cardId) : null;

    if (isNaN(parsedListId) || isNaN(parsedBoardId) || isNaN(parsedUserId)) {
      return { valid: false, message: "Invalid IDs provided." };
    }

    // Fetch list, board, and user details
    const [list, board, user] = await Promise.all([
      prisma.lists.findUnique({ where: { id: parsedListId } }),
      prisma.boards.findUnique({ where: { id: parsedBoardId } }),
      // prisma.users.findUnique({
      //   where: { id: parsedUserId },
      //   include: { board_members: { include: { boards: true } } },
      // }),
      // prisma.users.findUnique({
      //   where: { id: parsedUserId },
      //   include: { boards: true }, // Ensure the boards relation is included
      // }),
      prisma.users.findUnique({
        where: { id: parsedUserId },
        include: { boards_boards_userIdTousers: true },
      }),
    ]);

    // Log data for debugging
    console.log("List found:", list);
    console.log("Board found:", board);
    console.log("User found:", user);

    if (!list)
      return {
        valid: false,
        message: `List with ID ${parsedListId} not found.`,
      };
    if (!board)
      return {
        valid: false,
        message: `Board with ID ${parsedBoardId} not found.`,
      };
    if (!user)
      return {
        valid: false,
        message: `User with ID ${parsedUserId} not found.`,
      };

    const listBelongsToBoard = (list, board) => {
      return list && board && list.boardId === board.id;
    };

    const isListBelongsToBoard = listBelongsToBoard(list, board);
    console.log("Is list belongs to board:", isListBelongsToBoard);
    if (!isListBelongsToBoard) {
      return {
        valid: false,
        message: `List ${parsedListId} does not belong to Board ${parsedBoardId}.`,
      };
    }

    // Check if user belongs to the board
    const userBelongsToBoard = user.boards_boards_userIdTousers.some(
      (bm) => bm.id === parsedBoardId
    );
    console.log("Does user belong to board:", userBelongsToBoard);
    if (!userBelongsToBoard) {
      return {
        valid: false,
        message: `User ${parsedUserId} does not belong to Board ${parsedBoardId}.`,
      };
    }

    // Check card ownership when not creating
    if (!isCreate) {
      const card = await prisma.cards.findUnique({
        where: { id: parsedCardId },
      });
      if (!card)
        return {
          valid: false,
          message: `Card with ID ${parsedCardId} not found.`,
        };

      const cardBelongsToList = await prisma.lists
        .findMany({
          where: { id: parsedListId },
          include: { cards: true },
        })
        .then((lists) =>
          lists.some((list) => list.cards.some((c) => c.id === parsedCardId))
        );

      if (!cardBelongsToList) {
        return {
          valid: false,
          message: `Card ${parsedCardId} does not belong to List ${parsedListId}.`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    console.error("Error in validateCardOwners:", error);
    return { valid: false, message: "Validation failed due to an error." };
  }
};

export const labelsSeed = [
  { text: "", color: "#61bd4f", backColor: "#519839", selected: false },
  { text: "", color: "#f2d600", backColor: "#d9b51c", selected: false },
  { text: "", color: "#ff9f1a", backColor: "#cd8313", selected: false },
  { text: "", color: "#eb5a46", backColor: "#b04632", selected: false },
  { text: "", color: "#c377e0", backColor: "#89609e", selected: false },
  { text: "", color: "#0079bf", backColor: "#055a8c", selected: false },
];

export const createRandomHexColor = () => {
  const values = "0123456789ABCDEF";
  let hex = "#";

  for (let i = 0; i < 6; i++) {
    hex += values[Math.floor(Math.random() * 16)];
  }
  return hex;
};

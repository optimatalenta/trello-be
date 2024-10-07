import { prisma } from "../../prisma/prisma.mjs";
import { CustomError } from "../errors/index.mjs";

export const createBoard = async ({
  title,
  backgroundImageLink,
  userId,
  isImage,
  description,
}) => {
  try {
    const newBoard = await prisma.boards.create({
      data: {
        title,
        backgroundImageLink,
        description,
        isImage,
        userId,
      },
    });
    return newBoard;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

export const getAll = async (userId) => {
  const boards = await prisma.boards.findMany({
    where: { userId },
  });

  if (!boards)
    throw new CustomError(404, "not found", { error: "Boards not found" });

  return boards;
};

export const getById = async (boardId, userId) => {
  const board = await prisma.boards.findFirst({
    where: {
      AND: [{ id: parseInt(boardId) }, { userId: parseInt(userId) }],
    },
  });
  return board;
};

// export const getActivityById = async (boardId, userId) => {
//   const board = await prisma.boards.findFirst({
//     where: {
//       id: boardId,
//       members: {
//         some: { userId },
//       },
//     },
//     include: {
//       activities: true,
//     },
//   });
//   return board?.activities || null;
// };

export const getActivityById = async (boardId) => {
  try {
    const board = await prisma.boards.findUnique({
      where: {
        id: parseInt(boardId),
      },
      include: {
        activities: true, // Include related activities
      },
    });
    if (!board) {
      console.log("Board", board);
      throw new Error(
        "Activity not found or user is not a member of the board"
      );
    }
    console.log("activities: ", board.activities);
    return board.activities;
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};

export const updateBoardTitle = async (boardId, title, userId) => {
  const updatedBoard = await prisma.boards.update({
    where: { id: parseInt(boardId) },
    data: { title },
  });
  return updatedBoard;
};

export const updateBoardDescription = async (boardId, description, userId) => {
  const updatedBoard = await prisma.boards.update({
    where: {
      id_ownerId: {
        id: boardId,
        ownerId: userId,
      },
    },
    data: { description },
  });
  return updatedBoard;
};

export const updateBackground = async (
  boardId,
  background,
  isImage,
  userId
) => {
  const updatedBoard = await prisma.boards.update({
    where: {
      id_ownerId: {
        id: boardId,
        ownerId: userId,
      },
    },
    data: {
      backgroundImageLink: background,
      isImage,
    },
  });
  return updatedBoard;
};

export const addMember = async (boardId, members, userId) => {
  const board = await prisma.boards.findUnique({
    where: { id: boardId },
    include: { members: true },
  });

  if (!board || board.ownerId !== userId) {
    return null; // Prevent adding members if the user is not the owner
  }

  const updatedMembers = await prisma.board_members.createMany({
    data: members.map((member) => ({
      boardId,
      userId: member.userId,
    })),
    skipDuplicates: true, // Ensure no duplicate entries are created
  });

  return updatedMembers;
};

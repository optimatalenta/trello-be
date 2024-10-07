import { prisma } from "../../prisma/prisma.mjs";
import { CustomError } from "../errors/index.mjs";
import { validateCardOwners, labelsSeed } from "./helper.mjs";

export const create = async (title, listId, boardId, userId) => {
  try {
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });

    const validate = await validateCardOwners(
      null,
      parseInt(listId),
      parseInt(boardId),
      parseInt(userId),
      true
    );

    if (!validate.valid) {
      return {
        errMessage:
          "You don't have permission to add a card to this list or board",
      };
    }
    const card = await prisma.cards.create({
      data: {
        title,
        lists: {
          connect: { id: parseInt(listId) },
        },
        card_activities: {
          create: [
            {
              text: `added this card to ${list.title}`,
              userName: user.name,
              color: user.color,
            },
          ],
        },
        labels: {
          create: labelsSeed.map((label) => ({
            text: label.text,
            color: label.color,
            backColor: label.backColor,
            selected: label.selected,
          })),
        },
      },
    });

    await prisma.lists.update({
      where: { id: parseInt(listId) },
      data: {
        cards: {
          connect: { id: card.id },
        },
      },
    });

    await prisma.boards.update({
      where: { id: parseInt(boardId) },
      data: {
        activities: {
          create: {
            users: {
              connect: { id: parseInt(userId) },
            },
            action: `added ${card.title} to this board`,
            color: user.color,
            name: user.name,
          },
        },
      },
    });

    const result = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
      include: { cards: true },
    });

    return { errMessage: false, result };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const getCard = async (cardId, listId, boardId, user) => {
  try {
    if (!cardId || !listId || !boardId) {
      return { errMessage: "Missing card, list, or board ID." };
    }

    const cardIdInt = parseInt(cardId);
    const listIdInt = parseInt(listId);
    const boardIdInt = parseInt(boardId);

    if (isNaN(cardIdInt) || isNaN(listIdInt) || isNaN(boardIdInt)) {
      return { errMessage: "Invalid card, list, or board ID." };
    }

    const card = await prisma.cards.findUnique({
      where: { id: cardIdInt },
      include: { card_activities: true, checklists: true },
    });

    const list = await prisma.lists.findUnique({
      where: { id: listIdInt },
    });

    const board = await prisma.boards.findUnique({
      where: { id: boardIdInt },
    });

    if (!card || !list || !board) {
      return {
        errMessage: "Invalid card, list, or board ID.",
      };
    }

    const validate = await validateCardOwners(
      cardIdInt,
      listIdInt,
      boardIdInt,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to view this card",
      };
    }

    const returnObject = {
      ...card,
      listTitle: list.title,
      listId: listIdInt,
      boardId: boardIdInt,
    };

    return returnObject;
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const update = async (cardId, listId, boardId, user, updatedObj) => {
  try {
    const cardIdInt = parseInt(cardId, 10);
    const listIdInt = parseInt(listId, 10);
    const boardIdInt = parseInt(boardId, 10);

    if (isNaN(cardIdInt) || isNaN(listIdInt) || isNaN(boardIdInt)) {
      return {
        errMessage: "Invalid card, list, or board ID.",
      };
    }

    const card = await prisma.cards.findUnique({
      where: { id: cardIdInt },
    });

    console.log("card: ", card);

    const list = await prisma.lists.findUnique({
      where: { id: listIdInt },
    });

    const board = await prisma.boards.findUnique({
      where: { id: boardIdInt },
    });

    if (!card || !list || !board) {
      return {
        errMessage: "Card, list, or board not found.",
      };
    }

    const validate = await validateCardOwners(
      cardIdInt,
      listIdInt,
      boardIdInt,
      user.id,
      false
    );

    if (!validate) {
      return {
        errMessage: "You don't have permission to update this card",
      };
    }

    await prisma.cards.update({
      where: { id: cardIdInt },
      data: updatedObj,
    });

    return { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const addComment = async (cardId, listId, boardId, user, body) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });

    if (!card)
      throw new CustomError(404, "Card not found", { error: "Card not found" });

    if (!list)
      throw new CustomError(404, "List not found", { error: "List not found" });

    if (!board)
      throw new CustomError(404, "Board not found", {
        error: "Board not found",
      });

    const isValid = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );

    if (!isValid)
      throw new CustomError(403, "Authorization Error", {
        error: "You don't have permission to add a comment to this card",
      });

    const updatedCard = await prisma.cards.update({
      where: { id: parseInt(cardId) },
      data: {
        card_activities: {
          create: {
            text: body.text,
            userName: user.name,
            isComment: true,
            color: user.color,
          },
        },
      },
    });

    const updatedBoard = await prisma.boards.update({
      where: { id: parseInt(boardId) },
      data: {
        activities: {
          create: {
            userId: user.id,
            name: user.name,
            action: `added comment ${body.text} to the card ${card.title}`,
            actionType: "comment",
            cardTitle: card.title,
            color: user.color,
          },
        },
      },
    });

    if (updatedCard && updatedBoard) {
      const result = await prisma.cards.findUnique({
        where: { id: parseInt(cardId) },
        include: { card_activities: true },
      });

      return result.card_activities;
    }
  } catch (error) {
    throw new CustomError(500, "Internal Server Error", {
      error: "Internal Server Error",
    });
  }
};

export const updateComment = async (
  cardId,
  listId,
  boardId,
  commentId,
  user,
  body
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) },
      include: { activities: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update this card",
      };
    }

    const commentIndex = card.activities.findIndex(
      (activity) => activity.id === commentId
    );
    if (commentIndex === -1) {
      return {
        errMessage: "Comment not found",
      };
    }

    if (card.activities[commentIndex].userName !== user.name) {
      return {
        errMessage: "You cannot edit a comment that you did not create",
      };
    }

    await prisma.cards.update({
      where: { id: parseInt(cardId) },
      data: {
        activities: {
          update: {
            where: { id: parseInt(commentId) },
            data: { text: body.text },
          },
        },
      },
    });

    await prisma.boards.update({
      where: { id: parseInt(boardId) },
      data: {
        activities: {
          create: {
            name: user.name,
            action: body.text,
            actionType: "comment",
            edited: true,
            color: user.color,
            cardTitle: card.title,
          },
        },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteComment = async (
  cardId,
  listId,
  boardId,
  commentId,
  user
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) },
      include: { activities: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to delete this comment",
      };
    }

    await prisma.cards.update({
      where: { id: parseInt(cardId) },
      data: {
        activities: {
          delete: { id: parseInt(commentId) },
        },
      },
    });

    await prisma.boards.update({
      where: { id: parseInt(boardId) },
      data: {
        activities: {
          create: {
            userName: user.name,
            action: `deleted their own comment from ${card.title}`,
            color: user.color,
          },
        },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const addMember = async (cardId, listId, boardId, user, memberId) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });
    const member = await prisma.users.findUnique({
      where: { id: parseInt(memberId) },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to add a member to this card",
      };
    }

    await prisma.cards.update({
      where: { id: parseInt(cardId) },
      data: {
        members: {
          create: {
            userId: parseInt(memberId),
            name: member.name,
            color: member.color,
          },
        },
      },
    });

    await prisma.boards.update({
      where: { id: parseInt(boardId) },
      data: {
        activity: {
          create: {
            userName: user.name,
            action: `added '${member.name}' to ${card.title}`,
            color: user.color,
          },
        },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteMember = async (cardId, listId, boardId, user, memberId) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { members: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: listId },
    });
    const board = await prisma.boards.findUnique({
      where: { id: boardId },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to remove this member",
      };
    }

    await prisma.cards.update({
      where: { id: cardId },
      data: {
        members: {
          delete: {
            userId: memberId,
          },
        },
      },
    });

    const tempMember = await prisma.users.findUnique({
      where: { id: memberId },
    });

    await prisma.boards.update({
      where: { id: boardId },
      data: {
        activity: {
          create: {
            userName: user.name,
            action:
              tempMember.name === user.name
                ? `left ${card.title}`
                : `removed '${tempMember.name}' from ${card.title}`,
            color: user.color,
          },
        },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const createLabel = async (cardId, listId, boardId, user, label) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) },
      include: { labels: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to add label to this card",
      };
    }

    const newLabel = await prisma.labels.create({
      data: {
        text: label.text,
        color: label.color,
        backColor: label.backColor,
        cardId: parseInt(cardId),
      },
    });

    return false, { labelId: newLabel.id };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const updateLabel = async (
  cardId,
  listId,
  boardId,
  labelId,
  user,
  label
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { labels: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: listId },
    });
    const board = await prisma.boards.findUnique({
      where: { id: boardId },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update this label",
      };
    }

    await prisma.labels.update({
      where: { id: labelId },
      data: {
        text: label.text,
        color: label.color,
        backColor: label.backColor,
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteLabel = async (cardId, listId, boardId, labelId, user) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { labels: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: listId },
    });
    const board = await prisma.boards.findUnique({
      where: { id: boardId },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to delete this label",
      };
    }

    await prisma.labels.delete({
      where: { id: labelId },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const updateLabelSelection = async (
  cardId,
  listId,
  boardId,
  labelId,
  user,
  selected
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { labels: true },
    });
    const list = await prisma.lists.findUnique({
      where: { id: listId },
    });
    const board = await prisma.boards.findUnique({
      where: { id: boardId },
    });

    const validate = await validateCardOwners(
      cardId,
      listId,
      boardId,
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update this card",
      };
    }

    await prisma.labels.update({
      where: { id: labelId },
      data: { selected },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

// export const createChecklist = async (cardId, listId, boardId, user, title) => {
//   try {
//     const card = await prisma.cards.findUnique({
//       where: { id: parseInt(cardId) },
//       include: { checklists: true },
//     });
//     const list = await prisma.lists.findUnique({
//       where: { id: listId },
//     });
//     const board = await prisma.boards.findUnique({
//       where: { id: boardId },
//     });

//     const validate = await validateCardOwners(
//       cardId,
//       listId,
//       boardId,
//       user.id,
//       false
//     );
//     if (!validate) {
//       return {
//         errMessage: "You don't have permission to add a checklist to this card",
//       };
//     }

//     const newChecklist = await prisma.checklists.create({
//       data: {
//         title,
//         card: { connect: { id: cardId } },
//       },
//     });

//     await prisma.boards.update({
//       where: { id: boardId },
//       data: {
//         activities: {
//           create: {
//             userName: user.name,
//             action: `added '${title}' to ${card.title}`,
//             color: user.color,
//           },
//         },
//       },
//     });

//     return false, { checklistId: newChecklist.id };
//   } catch (error) {
//     return {
//       errMessage: "Something went wrong",
//       details: error.message,
//     };
//   }
// };

export const createChecklist = async (cardId, listId, boardId, user, title) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: parseInt(cardId) }, // Konversi id ke Int
      include: { checklists: true },
    });

    const list = await prisma.lists.findUnique({
      where: { id: parseInt(listId) }, // Konversi id ke Int
    });

    const board = await prisma.boards.findUnique({
      where: { id: parseInt(boardId) }, // Konversi id ke Int
    });

    const validate = await validateCardOwners(
      parseInt(cardId), // Konversi id ke Int
      parseInt(listId), // Konversi id ke Int
      parseInt(boardId), // Konversi id ke Int
      user.id,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to add a checklist to this card",
      };
    }

    const newChecklist = await prisma.checklists.create({
      data: {
        title,
        cards: { connect: { id: parseInt(cardId) } }, // Konversi id ke Int
      },
    });

    await prisma.boards.update({
      where: { id: parseInt(boardId) }, // Konversi id ke Int
      data: {
        activities: {
          create: {
            name: user.name,
            action: `added '${title}' to ${card.title}`,
            color: user.color,
          },
        },
      },
    });

    return { checklistId: newChecklist.id, title: title };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteChecklist = async (
  cardId,
  listId,
  boardId,
  checklistId,
  user
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { checklists: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to delete this checklist",
      };
    }

    await prisma.checklists.delete({ where: { id: checklistId } });

    await prisma.activities.create({
      data: {
        userId: user.id,
        name: user.name,
        action: `removed '${
          (
            await prisma.checklist.findUnique({ where: { id: checklistId } })
          ).title
        }' from ${card.title}`,
        color: user.color,
        boardId: board.id,
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const addChecklistItem = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  text
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { checklists: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to add item to this checklist",
      };
    }

    const checklist = await prisma.checklists.update({
      where: { id: checklistId },
      data: {
        items: {
          create: { text: text },
        },
      },
      include: {
        items: true,
      },
    });

    const checklistItemId = checklist.items[checklist.items.length - 1].id;

    return false, { checklistItemId: checklistItemId };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const setChecklistItemCompleted = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId,
  completed
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: {
        checklists: {
          include: { items: true },
        },
      },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage:
          "You don't have permission to set completion of this checklist item",
      };
    }

    const checklistItem = card.checklists
      .flatMap((cl) => cl.items)
      .find((item) => item.id === checklistItemId);

    await prisma.checklist_items.update({
      where: { id: checklistItemId },
      data: { completed: completed },
    });

    await prisma.activities.create({
      data: {
        userId: user.id,
        name: user.name,
        action: completed
          ? `completed '${checklistItem.text}' on ${card.title}`
          : `marked '${checklistItem.text}' as uncompleted on ${card.title}`,
        color: user.color,
        boardId: board.id,
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const setChecklistItemText = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId,
  text
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: {
        checklists: {
          include: { items: true },
        },
      },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });

    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage:
          "You don't have permission to set text of this checklist item",
      };
    }

    await prisma.checklist_items.update({
      where: { id: checklistItemId },
      data: { text: text },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteChecklistItem = async (
  cardId,
  listId,
  boardId,
  user,
  checklistId,
  checklistItemId
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: {
        checklists: {
          include: { items: true },
        },
      },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to delete this checklist item",
      };
    }
    await prisma.checklist_items.delete({ where: { id: checklistItemId } });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const updateStartDueDates = async (
  cardId,
  listId,
  boardId,
  user,
  startDate,
  dueDate,
  dueTime
) => {
  try {
    const card = await prisma.cards.findUnique({ where: { id: cardId } });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update date of this card",
      };
    }

    await prisma.cards.update({
      where: { id: cardId },
      data: {
        date: {
          startDate: startDate,
          dueDate: dueDate,
          dueTime: dueTime,
          completed: dueDate === null ? false : card.date.completed,
        },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const updateDateCompleted = async (
  cardId,
  listId,
  boardId,
  user,
  completed
) => {
  try {
    const card = await prisma.cards.findUnique({ where: { id: cardId } });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage:
          "You don't have permission to update the completion status of this card",
      };
    }

    await prisma.cards.update({
      where: { id: cardId },
      data: { date: { completed: completed } },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const addAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  link,
  name
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { attachments: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update date of this card",
      };
    }

    const validLink = /^https?:\/\//.test(link) ? link : "http://" + link;
    const attachment = await prisma.attachments.create({
      data: {
        link: validLink,
        name: name,
        card: { connect: { id: cardId } },
      },
    });

    await prisma.activities.create({
      data: {
        userId: user.id,
        name: user.name,
        action: `attached ${validLink} to ${card.title}`,
        color: user.color,
        boardId: board.id,
      },
    });

    return false, { attachmentId: attachment.id };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteById = async (cardId, listId, boardId, user) => {
  try {
    const parsedCardId = parseInt(cardId, 10);
    const parsedListId = parseInt(listId, 10);
    const parsedBoardId = parseInt(boardId, 10);

    console.log("card:", parsedCardId);
    console.log("list:", parsedListId);
    console.log("board:", parsedBoardId);

    // Get models
    const card = await prisma.cards.findUnique({
      where: { id: parsedCardId },
    });
    const list = await prisma.lists.findUnique({
      where: { id: parsedListId },
    });
    const board = await prisma.boards.findUnique({
      where: { id: parsedBoardId },
    });

    // Validate owner
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to update this card",
      };
    }

    // Delete the card
    const result = await prisma.cards.delete({
      where: { id: parsedCardId },
    });

    // Delete the card from the list's cards
    await prisma.lists.update({
      where: { id: parsedListId },
      data: {
        cards: {
          disconnect: { id: parsedCardId },
        },
      },
    });

    // Add activity log to board
    await prisma.boards.update({
      where: { id: parsedBoardId },
      data: {
        activity: {
          push: {
            userId: user.id,
            userName: user.name,
            action: `deleted ${result.title} from ${list.title}`,
            color: user.color,
          },
        },
      },
    });

    return { message: "Success" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const deleteAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  attachmentId
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { attachments: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage: "You don't have permission to delete this attachment",
      };
    }

    const attachment = await prisma.attachments.findUnique({
      where: { id: attachmentId },
    });
    await prisma.attachments.delete({ where: { id: attachmentId } });
    await prisma.activities.create({
      data: {
        userId: user.id,
        name: user.name,
        action: `deleted the ${attachment.link} attachment from ${card.title}`,
        color: user.color,
        boardId: board.id,
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

export const updateAttachment = async (
  cardId,
  listId,
  boardId,
  user,
  attachmentId,
  link,
  name
) => {
  try {
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { attachments: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage:
          "You don't have permission to update attachment of this card",
      };
    }

    await prisma.attachments.update({
      where: { id: attachmentId },
      data: { link: link, name: name },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
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
    const card = await prisma.cards.findUnique({
      where: { id: cardId },
      include: { cover: true },
    });
    const list = await prisma.lists.findUnique({ where: { id: listId } });
    const board = await prisma.boards.findUnique({ where: { id: boardId } });
    const validate = await helperMethods.validateCardOwners(
      card,
      list,
      board,
      user,
      false
    );
    if (!validate) {
      return {
        errMessage:
          "You don't have permission to update the cover of this card",
      };
    }

    await prisma.cover.upsert({
      where: { cardId: cardId },
      update: { color: color, isSizeOne: isSizeOne },
      create: {
        color: color,
        isSizeOne: isSizeOne,
        card: { connect: { id: cardId } },
      },
    });

    return false, { message: "Success!" };
  } catch (error) {
    return {
      errMessage: "Something went wrong",
      details: error.message,
    };
  }
};

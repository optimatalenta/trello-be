import { CustomError } from "../errors/index.mjs";
import * as boardService from "../services/board_service.mjs";

export const create = async (req, res, next) => {
  const { title, backgroundImageLink, isImage } = req.body;

  if (!(title && backgroundImageLink)) {
    return res
      .status(400)
      .json({ errMessage: "Title and/or image cannot be null" });
  }

  try {
    const board = await boardService.createBoard({
      title,
      backgroundImageLink,
      isImage,
      userId: req.user.id,
    });

    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const boards = await boardService.getAll(req.user.id);
    console.log("boards: ", boards);
    res.status(200).json({
      status: "success",
      message: "Boards fetched successfully",
      boards,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const board = await boardService.getById(req.params.b_id, req.user.id);

    if (!board) {
      return res.status(403).json({
        errMessage:
          "You cannot access this board, you are not a member or owner!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Board fetched successfully",
      board,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  const { b_id } = req.params;
  const { id } = req.user;

  console.log("BoardId", b_id);
  console.log("UserId", id);

  try {
    const board = await boardService.getById(b_id, id);

    if (!board) {
      throw new CustomError(404, "Board not found", {
        error: "Board not found",
      });
    }

    const activities = await boardService.getActivityById(b_id, id);

    if (!activities) {
      return res.status(403).json({
        errMessage:
          "You cannot access this board's activities, you are not a member or owner!",
      });
    }

    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

export const updateBoardTitle = async (req, res, next) => {
  const { b_id } = req.params;
  const { title } = req.body;
  const { id } = req.user;

  try {
    const board = await boardService.getById(b_id, id);

    if (!board) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Board not found" });
    }

    const updatedTitle = await boardService.updateBoardTitle(b_id, title, id);

    if (!updatedTitle) {
      return res.status(500).json({
        status: "Failed",
        message: "Cannot update board title",
      });
    }

    res.status(200).json(updatedTitle);
  } catch (error) {
    next(error);
  }
};

export const updateBoardDescription = async (req, res, next) => {
  try {
    const board = await boardService.updateBoardDescription(
      req.params.b_id,
      req.body.description,
      req.user.id
    );

    if (!board) {
      return res.status(403).json({
        errMessage:
          "You cannot change the description of this board, you are not a member or owner!",
      });
    }

    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const updateBackground = async (req, res, next) => {
  try {
    const board = await boardService.updateBackground(
      req.params.b_id,
      req.body.background,
      req.body.isImage,
      req.user.id
    );

    if (!board) {
      return res.status(403).json({
        errMessage:
          "You cannot change the background of this board, you are not a member or owner!",
      });
    }

    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const board = await boardService.addMember(
      req.params.b_id,
      req.body.members,
      req.user.id
    );

    if (!board) {
      return res.status(403).json({
        errMessage:
          "You cannot add members to this board, you are not a member or owner!",
      });
    }

    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

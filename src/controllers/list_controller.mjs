import * as listService from "../services/list_service.mjs";

export const create = async (req, res) => {
  const { title, boardId } = req.body;

  if (!(title && boardId))
    return res.status(400).send({ errMessage: "Title cannot be empty" });

  try {
    const result = await listService.createList({ title, boardId }, req.user);
    console.log(req.user);
    return res.status(201).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const getAll = async (req, res) => {
  const boardId = req.params.b_id;

  try {
    const result = await listService.getAll(boardId, req.user);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const deleteById = async (req, res) => {
  const { listId, boardId } = req.params;
  const user = req.user;

  if (!(listId && boardId))
    return res.status(400).send({ errMessage: "List or board undefined" });

  try {
    const result = await listService.deleteById(listId, boardId, user);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateCardOrder = async (req, res) => {
  const { boardId, sourceId, destinationId, destinationIndex, cardId } =
    req.body;
  const user = req.user;

  if (!(boardId && sourceId && destinationId && cardId))
    return res.status(400).send({ errMessage: "All parameters not provided" });

  try {
    const result = await listService.updateCardOrder(
      boardId,
      sourceId,
      destinationId,
      destinationIndex,
      cardId,
      user
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateListOrder = async (req, res) => {
  const { boardId, sourceIndex, destinationIndex, listId } = req.body;
  const user = req.user;

  if (
    !(
      boardId &&
      sourceIndex != undefined &&
      destinationIndex != undefined &&
      listId
    )
  )
    return res.status(400).send({ errMessage: "All parameters not provided" });

  try {
    const result = await listService.updateListOrder(
      boardId,
      sourceIndex,
      destinationIndex,
      listId,
      user
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ errMessage: error.message });
  }
};

export const updateListTitle = async (req, res) => {
  const { listId, boardId } = req.params;
  const user = req.user;
  const { title } = req.body;

  if (!(listId && boardId))
    return res.status(400).send({ errMessage: "List or board undefined" });

  try {
    const result = await listService.updateListTitle(
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

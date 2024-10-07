import { loginSchema, registerSchema } from "../schema/user_schema.mjs";
import * as userService from "../services/user_service.mjs";

export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await userService.registerService(parsed);

    if (user) {
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await userService.loginService(parsed);

    if (result)
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  console.log("Fetching user...");
  try {
    const user = req.user;
    console.log(user);
    const { password, ...restUser } = user;

    if (user) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched user by ID",
        data: { ...restUser },
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserWithMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await userService.getUserWithMail(email);

    const dataTransferObject = {
      name: data.name,
      surname: data.surname,
      color: data.color,
      email: data.email,
    };

    res.status(200).json({
      status: "success",
      message: "Successfully fetched user by email",
      data: dataTransferObject,
    });
  } catch (error) {
    next(error);
  }
};

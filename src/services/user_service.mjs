import bcrypt from "bcrypt";
import { prisma } from "../../prisma/prisma.mjs";
import { AuthenticationError } from "../errors/index.mjs";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export const registerService = async (data) => {
  const hashedPassword = bcrypt.hashSync(data.password, 12);

  const user = await prisma.users.create({
    data: { ...data, password: hashedPassword },
  });

  const { password, ...restUser } = user;

  return { ...restUser };
};

export const loginService = async (data) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AuthenticationError("Authentication failed", {
        error: "Invalid email or password",
      });

    const access_token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refresh_token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    const { password, ...userData } = user;
    return { ...userData, token: { access_token, refresh_token } };
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!user) throw new Error("User not found!");
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getUserWithMail = async (email) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) throw new Error("There is no registered user with this e-mail.");
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

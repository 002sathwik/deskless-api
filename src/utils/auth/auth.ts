import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";

import { somethingWentWrong } from "~/utils/error";

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserById = async (id: number): Promise<User | null> => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const hashPassword = async (password: string): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) return null;
    return hashedPassword;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const compareHashedPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (!validPassword)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect password",
      });

    return validPassword;
  } catch (error) {
    console.error(error);
    somethingWentWrong(error);
  }
};

export { getUserByEmail, hashPassword, compareHashedPassword, getUserById };

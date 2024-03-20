"use server";

import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { ENV } from "@/lib/env";
import { signJWT } from "@/lib/jwt";
import { hash } from "bcrypt";
import { cookies } from "next/headers";
import { SigninUserInput } from "../auth/sigin-form";
import { SignupUserInput } from "./signup-form";

export async function signupUser(data: SignupUserInput) {
  try {
    const { JWT_EXPIRY } = ENV;
    const existentUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existentUser) {
      throw new Error("User already exists");
    }

    if (data.password !== data.passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await hash(data.password, 12);
    const { passwordConfirm, password, ...rest } = data;

    const createdUser = await prisma.user.create({
      data: { password: hashedPassword, ...rest },
    });

    const token = await signJWT(
      {
        sub: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
      { exp: `${JWT_EXPIRY}d` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRY) * 86400;
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    });

    const { password: _, ...user } = createdUser;

    return {
      status: true,
      data: { user },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function signinUser(data: SigninUserInput) {
  try {
    const { JWT_EXPIRY } = ENV;
    const existentUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (
      !existentUser ||
      !(await compare(data.password, existentUser.password))
    ) {
      throw new Error("Invalid Username or password");
    }

    const token = await signJWT(
      {
        sub: existentUser.id,
        username: existentUser.username,
        email: existentUser.email,
      },
      { exp: `${JWT_EXPIRY}d` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRY) * 86400;

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    });

    const { password, ...user } = existentUser;
    return {
      status: true,
      data: { user },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function signoutUser() {
  cookies().delete("token");

  return {
    status: true,
    message: "User signed out",
  };
}

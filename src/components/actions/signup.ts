"use server";

import prisma from "@/lib/prisma";
import { SignupUserInput } from "../signup-form";
import { hash } from "bcrypt";
import { ENV } from "@/lib/env";
import { signJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

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
      { sub: createdUser.id },
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

    cookies().set({
      name: "username",
      value: createdUser.username,
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

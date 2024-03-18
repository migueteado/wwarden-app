"use server";

import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { ENV } from "@/lib/env";
import { signJWT } from "@/lib/jwt";
import { cookies } from "next/headers";
import { SigninUserInput } from "../SigninForm";

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
      { sub: existentUser.id },
      { exp: `${JWT_EXPIRY}d` }
    );

    const tokenMaxAge = parseInt(JWT_EXPIRY) * 86400;
    const cookieOptions = {
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: tokenMaxAge,
    };

    cookies().set(cookieOptions);

    return {
      status: true,
      data: existentUser.username,
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

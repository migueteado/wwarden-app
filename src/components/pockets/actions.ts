"use server";

import { cookies } from "next/headers";
import { CreatePocketInput } from "./create-pocket-form";
import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function createPocket(data: CreatePocketInput) {
  try {
    const token = cookies().get("token")?.value ?? "";

    if (!token) {
      throw new Error("Unauthorized");
    }

    const { sub } = await verifyJWT(token);
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      throw new Error("Unauthorized");
    }

    const pocket = await prisma.pocket.create({
      data: {
        ...data,
        balance: 0,
      },
    });

    return {
      status: true,
      data: { pocket },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

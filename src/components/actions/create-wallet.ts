"use server";

import prisma from "@/lib/prisma";
import { CreateWalletInput } from "../add-wallet";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function createWallet(data: CreateWalletInput) {
  try {
    const { date, ...rest } = data;
    const token = cookies().get("token")?.value ?? "";

    if (!token) {
      throw new Error("Unauthorized");
    }

    const { sub } = await verifyJWT(token);
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      throw new Error("Unauthorized");
    }

    const subcategory = await prisma.subcategories.findFirst({
      where: { name: "Balance Inicial" },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      const wallet = await prisma.wallet.create({
        data: { userId: user.id, ...rest },
      });

      const transaction = await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "ADJUSTMENT",
          amount: data.balance,
          previousBalance: 0,
          newBalance: data.balance,
          categoryId: subcategory.categoryId,
          subcategoryId: subcategory.id,
          date: data.date,
        },
      });

      return { wallet, transaction };
    });

    return {
      status: true,
      data: { wallet, transaction },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

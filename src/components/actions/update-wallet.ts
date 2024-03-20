"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { UpdateWalletInput } from "../wallet-actions";

export async function updateWallet(data: UpdateWalletInput) {
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

    const subcategory = await prisma.subcategories.findFirst({
      where: { name: "Ajuste de Billetera" },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    const prevWallet = await prisma.wallet.findFirst({
      where: { id: data.id },
    });

    if (!prevWallet) {
      throw new Error("Wallet not found");
    }

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      let transaction = null;
      const prevWalletBalance = Number(prevWallet.balance);
      if (prevWalletBalance !== data.balance) {
        transaction = await prisma.transaction.create({
          data: {
            walletId: prevWallet.id,
            type: "ADJUSTMENT",
            amount: data.balance - prevWalletBalance,
            previousBalance: prevWallet.balance,
            newBalance: data.balance,
            categoryId: subcategory.categoryId,
            subcategoryId: subcategory.id,
            date: new Date(),
          },
        });
      }

      const wallet = await prisma.wallet.update({
        where: { id: prevWallet.id },
        data: { ...data },
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

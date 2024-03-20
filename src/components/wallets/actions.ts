"use server";

import prisma from "@/lib/prisma";
import { CreateWalletInput } from "../wallets/add-wallet";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { DeleteWalletInput } from "../wallets/wallet-actions";
import { UpdateWalletInput } from "../wallets/wallet-actions";

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

export async function deleteWallet(data: DeleteWalletInput) {
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

    const wallet = await prisma.wallet.delete({
      where: { id: data.id },
    });

    return {
      status: true,
      data: { wallet: { ...wallet, balance: Number(wallet.balance) } },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

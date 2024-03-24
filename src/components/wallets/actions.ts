"use server";

import { CreateWalletInput } from "../wallets/add-wallet";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { DeleteWalletInput } from "../wallets/wallet-actions";
import { UpdateWalletInput } from "../wallets/wallet-actions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

    const subcategory = await prisma.subcategory.findFirst({
      where: { name: "Balance Inicial" },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    const wallet = await prisma.wallet.create({
      data: { userId: user.id, ...rest },
    });

    return {
      status: true,
      data: { wallet },
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

    const subcategory = await prisma.subcategory.findFirst({
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

    const exchangeRate = await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!exchangeRate || !exchangeRate.data) {
      throw new Error("Exchange rate not found");
    }

    const rateToUSD: number = (exchangeRate.data as Prisma.JsonObject)[
      prevWallet.currency
    ] as number;

    if (!rateToUSD) {
      throw new Error("Exchange rate not found");
    }

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      let transaction = null;
      const prevWalletBalance = Number(prevWallet.balance);
      if (prevWalletBalance !== data.balance) {
        const transactionAmount = data.balance - prevWalletBalance;
        transaction = await prisma.transaction.create({
          data: {
            walletId: prevWallet.id,
            type: "ADJUSTMENT",
            amount: transactionAmount,
            amountUSD: transactionAmount / rateToUSD,
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

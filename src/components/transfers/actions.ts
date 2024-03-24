"use server";

import { cookies } from "next/headers";
import { CreateTransferInput } from "./create-transfer-form";
import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createTransfer(data: CreateTransferInput) {
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

    const { transfer } = await prisma.$transaction(async (tx) => {
      const [fromWallet, toWallet] = await Promise.all([
        prisma.wallet.findUnique({
          where: { id: data.fromWalletId },
        }),
        await prisma.wallet.findUnique({
          where: { id: data.toWalletId },
        }),
      ]);

      if (!fromWallet || !toWallet) {
        throw new Error("Wallet not found");
      }

      const fromBalance = Number(fromWallet.balance) - data.fromAmount;
      const toBalance = Number(toWallet.balance) + data.toAmount;
      if (fromBalance < 0 || toBalance < 0) {
        throw new Error("Insufficient funds");
      }

      const exchangeRate = await prisma.exchangeRate.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!exchangeRate || !exchangeRate.data) {
        throw new Error("Exchange rate not found");
      }

      const fromWalletRateToUSD: number = (
        exchangeRate.data as Prisma.JsonObject
      )[fromWallet.currency] as number;

      const toWalletRateToUSD: number = (
        exchangeRate.data as Prisma.JsonObject
      )[toWallet.currency] as number;

      if (!fromWalletRateToUSD || !toWalletRateToUSD) {
        throw new Error("Exchange rate not found");
      }

      const [transfer, walletFrom, walletTo] = await Promise.all([
        prisma.transfer.create({
          data: {
            fee: data.fee ?? 0,
            feeUSD: (data.fee ?? 0) / fromWalletRateToUSD,
          },
        }),
        prisma.wallet.update({
          where: { id: data.fromWalletId },
          data: { balance: fromBalance },
        }),
        prisma.wallet.update({
          where: { id: data.toWalletId },
          data: { balance: toBalance },
        }),
      ]);

      const subcategories = await prisma.subcategory.findMany({
        where: { name: "Transferencias Internas" },
        include: { category: true },
      });

      const incomeSubcategory = subcategories.find(
        (s) => s.category.type === "INCOME"
      );
      const expenseSubcategory = subcategories.find(
        (s) => s.category.type === "EXPENSE"
      );

      if (!incomeSubcategory || !expenseSubcategory) {
        throw new Error("Internal transfer subcategories not found");
      }

      const [fromTransaction, toTransaction] = await Promise.all([
        prisma.transaction.create({
          data: {
            walletId: data.fromWalletId,
            amount: -data.fromAmount,
            amountUsd: -data.fromAmount / fromWalletRateToUSD,
            type: "EXPENSE",
            categoryId: expenseSubcategory.categoryId,
            subcategoryId: expenseSubcategory.id,
            description: data.description,
            date: new Date(data.date),
            transferId: transfer.id,
          },
        }),
        prisma.transaction.create({
          data: {
            walletId: data.toWalletId,
            amount: data.toAmount,
            amountUsd: data.toAmount / toWalletRateToUSD,
            type: "INCOME",
            categoryId: incomeSubcategory.categoryId,
            subcategoryId: incomeSubcategory.id,
            description: data.description,
            date: new Date(data.date),
            transferId: transfer.id,
          },
        }),
      ]);

      return { transfer };
    });

    return {
      status: true,
      data: {
        transfer,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

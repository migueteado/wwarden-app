"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CreateTransactionInput } from "./create-transaction-form";
import { DeleteTransactionInput } from "./delete-transaction-form";
import { UpdateTransactionInput } from "./update-transaction-form";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createTransaction(data: CreateTransactionInput) {
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

    const existentWallet = await prisma.wallet.findUnique({
      where: { id: data.walletId },
    });

    if (!existentWallet) {
      throw new Error("Wallet not found");
    }

    const exchangeRate = await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!exchangeRate || !exchangeRate.data) {
      throw new Error("Exchange rate not found");
    }

    const rateToUSD: number = (exchangeRate.data as Prisma.JsonObject)[
      existentWallet.currency
    ] as number;

    if (!rateToUSD) {
      throw new Error("Exchange rate not found");
    }

    const { transaction } = await prisma.$transaction(async (tx) => {
      let amount = data.type === "EXPENSE" ? -data.amount : data.amount;
      const previousBalance = Number(existentWallet.balance);
      const newBalance = previousBalance + amount;
      if (newBalance < 0) {
        throw new Error("Insufficient funds");
      }

      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          amount,
          amountUSD: amount / rateToUSD,
        },
      });

      await prisma.wallet.update({
        where: { id: data.walletId },
        data: { balance: newBalance },
      });

      return { transaction };
    });

    return {
      status: true,
      data: {
        transaction: { ...transaction, amount: Number(transaction.amount) },
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function updateTransaction(data: UpdateTransactionInput) {
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

    const prevTransaction = await prisma.transaction.findFirst({
      where: { id: data.id },
      include: { wallet: true },
    });

    if (!prevTransaction) {
      throw new Error("Transaction not found");
    }

    const newWallet = await prisma.wallet.findFirst({
      where: { id: data.walletId },
    });

    if (!newWallet) {
      throw new Error("Wallet not found");
    }

    const { transaction } = await prisma.$transaction(async (tx) => {
      let amount = data.type === "EXPENSE" ? -data.amount : data.amount;
      if (prevTransaction.wallet.id === newWallet.id) {
        const newBalance =
          Number(prevTransaction.wallet.balance) -
          Number(prevTransaction.amount) +
          amount;

        if (newBalance < 0) {
          throw new Error("Insufficient funds");
        }

        await prisma.wallet.update({
          where: { id: prevTransaction.wallet.id },
          data: { balance: newBalance },
        });
      } else {
        const prevWalletNewBalance =
          Number(prevTransaction.wallet.balance) -
          Number(prevTransaction.amount);
        if (prevWalletNewBalance < 0) {
          throw new Error("Insufficient funds");
        }

        const newWalletNewBalance = Number(newWallet.balance) + amount;
        if (newWalletNewBalance < 0) {
          throw new Error("Insufficient funds");
        }

        await prisma.wallet.update({
          where: { id: prevTransaction.wallet.id },
          data: { balance: prevWalletNewBalance },
        });

        await prisma.wallet.update({
          where: { id: newWallet.id },
          data: { balance: newWalletNewBalance },
        });
      }

      const transaction = await prisma.transaction.update({
        where: { id: data.id },
        data: {
          ...data,
          amount,
          amountUSD:
            (amount * Number(prevTransaction.amountUSD)) /
            Number(prevTransaction.amount),
        },
      });

      return { transaction };
    });

    return {
      status: true,
      data: {
        transaction: { ...transaction, amount: Number(transaction.amount) },
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function deleteTransaction(data: DeleteTransactionInput) {
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

    const existentTransaction = await prisma.transaction.findUnique({
      where: { id: data.id },
    });

    if (!existentTransaction) {
      throw new Error("Transaction not found");
    }

    const { transaction } = await prisma.$transaction(async (tx) => {
      const existentWallet = await prisma.wallet.findUnique({
        where: { id: existentTransaction.walletId },
      });

      if (!existentWallet) {
        throw new Error("Wallet not found");
      }

      const amount = Number(existentTransaction.amount);
      const previousBalance = Number(existentWallet.balance);
      const newBalance = previousBalance - amount;
      if (newBalance < 0) {
        throw new Error("Insufficient funds");
      }

      await prisma.wallet.update({
        where: { id: existentTransaction.walletId },
        data: { balance: newBalance },
      });

      const transaction = await prisma.transaction.delete({
        where: { id: data.id },
      });

      return { transaction };
    });

    return {
      status: true,
      data: {
        transaction: { ...transaction, amount: Number(transaction.amount) },
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

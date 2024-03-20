"use server";

import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { DeleteWalletInput } from "../wallets/wallet-actions";
import { UpdateWalletInput } from "../wallets/wallet-actions";
import { PrismaClient } from "@prisma/client";
import { CreateTransactionInput } from "./add-transaction";
import { DeleteTransactionInput } from "./transaction-actions";

const prisma = new PrismaClient();

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

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      const existentWallet = await prisma.wallet.findUnique({
        where: { id: data.walletId },
      });

      if (!existentWallet) {
        throw new Error("Wallet not found");
      }

      let amount = data.amount;
      if (data.type === "EXPENSE") {
        if (Number(existentWallet.balance) < data.amount) {
          throw new Error("Insufficient funds");
        }
        amount = -data.amount;
      }

      const previousBalance = Number(existentWallet.balance);
      const newBalance = previousBalance + amount;

      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          amount,
        },
      });

      const wallet = await prisma.wallet.update({
        where: { id: data.walletId },
        data: { balance: newBalance },
      });

      return { wallet, transaction };
    });

    return {
      status: true,
      data: {
        wallet: { ...wallet, balance: Number(wallet.balance) },
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

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      let transaction = null;
      const prevWalletBalance = Number(prevWallet.balance);
      if (prevWalletBalance !== data.balance) {
        transaction = await prisma.transaction.create({
          data: {
            walletId: prevWallet.id,
            type: "ADJUSTMENT",
            amount: data.balance - prevWalletBalance,
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

    const { wallet, transaction } = await prisma.$transaction(async (tx) => {
      const existentWallet = await prisma.wallet.findUnique({
        where: { id: existentTransaction.walletId },
      });

      if (!existentWallet) {
        throw new Error("Wallet not found");
      }

      const amount = -existentTransaction.amount;
      if (existentTransaction.type === "INCOME") {
        if (
          Number(existentWallet.balance) < Number(existentTransaction.amount)
        ) {
          throw new Error("Insufficient funds");
        }
      }

      const previousBalance = Number(existentWallet.balance);
      const newBalance = previousBalance + amount;

      const transaction = await prisma.transaction.delete({
        where: { id: data.id },
      });

      const wallet = await prisma.wallet.update({
        where: { id: existentTransaction.walletId },
        data: { balance: newBalance },
      });

      return { wallet, transaction };
    });

    return {
      status: true,
      data: {
        wallet: { ...wallet, balance: Number(wallet.balance) },
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

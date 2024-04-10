"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ExOverview } from "./ex-overview";

const transactionSelect = Prisma.validator<Prisma.TransactionSelect>()({
  id: true,
  entity: true,
  description: true,
  amount: true,
  amountUSD: true,
  type: true,
  date: true,
  transfer: {
    select: {
      feeUSD: true,
      transactions: { select: { id: true, walletId: true } },
    },
  },
  category: {
    select: { id: true, name: true },
  },
  subcategory: {
    select: { id: true, name: true },
  },
  wallet: {
    select: {
      id: true,
      currency: true,
      name: true,
      user: { select: { id: true, username: true } },
    },
  },
});

interface ExpensesOverviewProps {
  walletIds: string[];
}

type DataEntry = { name: string; [subcategory: string]: number | string };

export async function ExpensesOverview({ walletIds }: ExpensesOverviewProps) {
  // Date for january first of current year
  const dateStart = new Date();
  dateStart.setMonth(0);
  dateStart.setDate(1);
  dateStart.setHours(0, 0, 0, 0);

  // Date for december 31 of current year
  const dateEnd = new Date();
  dateEnd.setMonth(11);
  dateEnd.setDate(31);
  dateEnd.setHours(23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: dateStart, lte: dateEnd }, type: "EXPENSE" },
    select: transactionSelect,
  });

  const categories = await prisma.category.findMany({
    where: { type: "EXPENSE" },
  });

  const data: DataEntry[] = [];

  // Separate data by month and subcategory
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(dateStart);
    monthStart.setMonth(i);
    const monthEnd = new Date(dateStart);
    monthEnd.setMonth(i + 1);
    monthEnd.setDate(0);

    const monthTransactions = transactions.filter(
      (transaction) =>
        transaction.date >= monthStart && transaction.date <= monthEnd
    );

    const monthData: DataEntry = {
      name: monthStart.toLocaleString("default", { month: "long" }),
    };

    for (const category of categories) {
      monthData[category.name] = 0;
      const categoryTransactions = monthTransactions.filter(
        (transaction) => transaction.category.id === category.id
      );
      let total = 0;
      for (const transaction of categoryTransactions) {
        const transfer = transaction.transfer;
        if (transfer) {
          const receiveTransaction = transfer.transactions.find(
            (t) => t.id !== transaction.id
          );
          // Transaction comes from same group, only charge Fee
          if (
            receiveTransaction &&
            walletIds.includes(receiveTransaction.walletId)
          ) {
            total -= Number(transfer.feeUSD);
          }
          continue;
        }

        total += Number(transaction.amountUSD);
      }

      // At this point total is a negative number, make it positive
      // And force it to only have 2 decimals
      monthData[category.name] = Math.abs(total).toFixed(2);
    }

    data.push(monthData);
  }

  return <ExOverview data={data} categories={categories} />;
}

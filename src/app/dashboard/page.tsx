import { ExpensesOverview } from "@/components/charts/expenses-overview";
import { Overview } from "@/components/charts/overview";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  const wallets = (
    await prisma.wallet.findMany({
      where: { userId: user.id },
    })
  ).map((wallet) => ({
    ...wallet,
    balance: Number(wallet.balance),
  }));

  const walletIds = wallets.map((wallet) => wallet.id);

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

  // Get transactions and split it by months for the chart
  const transactions = (
    await prisma.transaction.findMany({
      where: {
        walletId: { in: walletIds },
        type: $Enums.TransactionType.INCOME,
        date: {
          lte: dateEnd,
          gte: dateStart,
        },
      },
      include: {
        wallet: true,
      },
    })
  ).map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
    amountUSD: Number(transaction.amountUSD),
  }));

  const data: { name: string; total: number }[] = [];
  // Split transactions by months
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(dateStart);
    monthStart.setMonth(i);
    const monthEnd = new Date(dateStart);
    monthEnd.setMonth(i + 1);
    monthEnd.setDate(0);

    const monthTransactions = transactions.filter(
      (transaction) =>
        transaction.date >= monthStart &&
        transaction.date <= monthEnd &&
        transaction.transferId === null
    );

    const total = monthTransactions.reduce(
      (acc, transaction) => acc + transaction.amountUSD,
      0
    );

    data.push({
      name: monthStart.toLocaleString("default", { month: "long" }),
      total,
    });
  }

  return (
    <DashboardLayout title="Dashboard" views={views}>
      <ExpensesOverview walletIds={walletIds} />
    </DashboardLayout>
  );
}

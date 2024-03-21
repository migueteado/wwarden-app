"use server";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CreateTransactionForm from "@/components/transactions/create-transaction-form";
import {
  categorySelect,
  transactionSelect,
  walletSelect,
} from "@/components/transactions/custom-type";
import { TransactionList } from "@/components/transactions/transaction-list";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardTransactions({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await getUser();
  const amountPerPage = 50;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const skip = (page - 1) * amountPerPage;
  const take = amountPerPage;

  if (!user) {
    redirect("/auth/signin");
  }

  const walletIds = (
    await prisma.wallet.findMany({
      where: { userId: user.sub },
      select: { id: true },
    })
  ).map((wallet) => wallet.id);
  const transactionCount = await prisma.transaction.count({
    where: { walletId: { in: walletIds } },
  });

  const transactions = (
    await prisma.transaction.findMany({
      where: { walletId: { in: walletIds } },
      select: transactionSelect,
      skip,
      take,
      orderBy: {
        date: "desc",
      },
    })
  ).map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.sub },
    select: walletSelect,
  });
  const categories = await prisma.category.findMany({ select: categorySelect });

  const pages = Math.ceil(transactionCount / amountPerPage);

  return (
    <DashboardLayout title="Transactions" user={user}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <CreateTransactionForm wallets={wallets} categories={categories} />
      </div>
      <div className="py-2 flex justify-center items-center">
        <TransactionList
          transactions={transactions}
          wallets={wallets}
          categories={categories}
          page={page}
          pages={pages}
        />
      </div>
    </DashboardLayout>
  );
}

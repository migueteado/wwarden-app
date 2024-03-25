import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { walletSelect } from "@/components/transactions/custom-type";
import CreateTransferForm from "@/components/transfers/create-transfer-form";
import {
  CustomTransfer,
  transferSelect,
} from "@/components/transfers/custom-type";
import { TransferList } from "@/components/transfers/transfer-list";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Transfers({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");
  const amountPerPage = 50;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const skip = (page - 1) * amountPerPage;
  const take = amountPerPage;

  if (!user) {
    redirect("/auth/signin");
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    select: walletSelect,
  });

  const walletIds = wallets.map((wallet) => wallet.id);

  const transferCount = await prisma.transfer.count({
    where: { transactions: { some: { walletId: { in: walletIds } } } },
  });

  const transfers = (
    await prisma.transfer.findMany({
      where: { transactions: { some: { walletId: { in: walletIds } } } },
      select: transferSelect,
      orderBy: { date: "desc" },
      skip,
      take,
    })
  ).map((transfer) => ({
    ...transfer,
    fee: Number(transfer.fee),
    feeUSD: Number(transfer.feeUSD),
    transactions: transfer.transactions.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      amountUSD: Number(transaction.amountUSD),
    })),
  })) as CustomTransfer[];

  const pages = Math.ceil(transferCount / amountPerPage);

  return (
    <DashboardLayout title="Transfers" views={views}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <CreateTransferForm wallets={wallets} />
      </div>
      <div className="py-2 flex justify-center items-center">
        <TransferList
          transfers={transfers}
          wallets={wallets}
          page={page}
          pages={pages}
        />
      </div>
    </DashboardLayout>
  );
}

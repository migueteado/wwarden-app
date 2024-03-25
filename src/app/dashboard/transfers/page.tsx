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
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Transfers({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");
  const viewType = cookies().get("view_type")?.value ?? (user?.type as string);
  const viewId = cookies().get("view_id")?.value ?? (user?.id as string);
  const amountPerPage = 50;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const skip = (page - 1) * amountPerPage;
  const take = amountPerPage;

  if (!user) {
    redirect("/auth/signin");
  }

  if (viewType === "household") {
    const householdId = viewId;
    const [wallets, transferCount, transferResult] = await Promise.all([
      prisma.wallet.findMany({
        where: { householdWallets: { some: { householdId } } },
        select: walletSelect,
      }),
      prisma.transfer.count({
        where: {
          transactions: {
            some: {
              wallet: {
                householdWallets: { some: { householdId: householdId } },
              },
            },
          },
        },
      }),
      prisma.transfer.findMany({
        where: {
          transactions: {
            some: {
              wallet: {
                householdWallets: { some: { householdId: householdId } },
              },
            },
          },
        },
        select: transferSelect,
        orderBy: { date: "desc" },
        skip,
        take,
      }),
    ]);

    const transfers = transferResult.map((transfer) => ({
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
    transactions: transfer.transactions
      .map((transaction) => {
        if (transaction.wallet.user.id !== user.id) {
          return null;
        }

        return {
          ...transaction,
          amount: Number(transaction.amount),
          amountUSD: Number(transaction.amountUSD),
        };
      })
      .filter((t) => t !== null),
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

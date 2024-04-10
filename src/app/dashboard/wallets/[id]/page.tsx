import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { pocketSelect, walletSelect } from "@/components/pockets/custom-type";
import { PocketList } from "@/components/pockets/pocket-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DollarSign, WalletCardsIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function Pockets({ params }: { params: { id: string } }) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  const walletResult = await prisma.wallet.findUnique({
    where: { id: params.id },
    select: walletSelect,
  });

  if (!walletResult) {
    notFound();
  }

  const exchangeRate = (
    await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    })
  )?.data as Prisma.JsonObject;
  const rateToUSD = (exchangeRate[walletResult.currency] as number) || 1;

  const wallet = {
    ...walletResult,
    balance: walletResult.balance.toNumber(),
    balanceUSD: walletResult.balance.toNumber() / rateToUSD,
  };

  const pockets = (
    await prisma.pocket.findMany({
      where: { walletId: wallet.id },
      select: pocketSelect,
    })
  ).map((pocket) => ({
    ...pocket,
    balance: pocket.balance.toNumber(),
    balanceUSD: pocket.balance.toNumber() / rateToUSD,
  }));

  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(wallet.balance);
  const formattedBalanceUSD = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(wallet.balance / rateToUSD);
  const pocketsBalance = pockets
    .map((pocket) => pocket.balance)
    .reduce((acc, balance) => acc + balance, 0);
  const formattedPockets = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pocketsBalance);
  const formattedPocketsUSD = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pocketsBalance / rateToUSD);

  return (
    <DashboardLayout title={`Wallet ${wallet.name}`} views={views}>
      <div className="grid gap-4 grid-cols-1">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wallet.currency} {formattedBalance}
              </div>
              <p className="text-xs text-muted-foreground">
                USD {formattedBalanceUSD}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pockets</CardTitle>
              <WalletCardsIcon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wallet.currency} {formattedPockets}
              </div>
              <p className="text-xs text-muted-foreground">
                USD {formattedPocketsUSD}
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <PocketList pockets={pockets} wallets={[wallet]} page={1} pages={1} />
        </div>
      </div>
    </DashboardLayout>
  );
}

import AddWallet from "@/components/wallets/add-wallet";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WalletList } from "@/components/wallets/wallet-list";
import { getViews } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import CreateHouseholdWalletForm from "@/components/wallets/create-household-wallet-form";
import { cookies } from "next/headers";
import { CustomWallet, walletSelect } from "@/components/wallets/custom-types";
export default async function Wallets({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");
  const viewType = cookies().get("view_type")?.value ?? (user?.type as string);
  const viewId = cookies().get("view_id")?.value ?? (user?.id as string);
  const amountPerPage = 20;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const skip = (page - 1) * amountPerPage;
  const take = amountPerPage;

  if (!user) {
    redirect("/auth/signin");
  }

  const exchangeRate = (
    await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    })
  )?.data as Prisma.JsonObject;

  if (viewType === "household") {
    const householdId = viewId;
    const [users, walletCount, walletsResult] = await Promise.all([
      prisma.user.findMany({
        where: { households: { some: { household: { id: householdId } } } },
      }),
      prisma.wallet.count({
        where: { householdWallets: { some: { householdId } } },
      }),
      prisma.wallet.findMany({
        where: { householdWallets: { some: { householdId } } },
        select: walletSelect,
        skip,
        take,
        orderBy: {
          balance: "desc",
        },
      }),
    ]);

    const wallets: CustomWallet[] = walletsResult.map((wallet) => {
      const rateToUSD = (exchangeRate[wallet.currency] as number) || 1;
      return {
        ...wallet,
        balance: Number(wallet.balance),
        balanceUSD: Number(wallet.balance) / rateToUSD,
      };
    });

    const pages = Math.ceil(walletCount / amountPerPage);

    return (
      <DashboardLayout title="Wallets" views={views}>
        <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
          <CreateHouseholdWalletForm householdId={householdId} users={users} />
        </div>
        <div className="py-2 flex justify-center items-center">
          <WalletList wallets={wallets} page={page} pages={pages} />
        </div>
      </DashboardLayout>
    );
  }

  const [walletCount, walletsResult] = await Promise.all([
    prisma.wallet.count({
      where: { userId: user.id },
    }),
    prisma.wallet.findMany({
      where: { userId: user.id },
      select: walletSelect,
      skip,
      take,
      orderBy: {
        balance: "desc",
      },
    }),
  ]);
  const wallets: CustomWallet[] = walletsResult.map((wallet) => {
    const rateToUSD = (exchangeRate[wallet.currency] as number) || 1;
    return {
      ...wallet,
      balance: Number(wallet.balance),
      balanceUSD: Number(wallet.balance) / rateToUSD,
    };
  });

  const pages = Math.ceil(walletCount / amountPerPage);

  return (
    <DashboardLayout title="Wallets" views={views}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <AddWallet />
      </div>
      <div className="py-2 flex justify-center items-center">
        <WalletList wallets={wallets} page={page} pages={pages} />
      </div>
    </DashboardLayout>
  );
}

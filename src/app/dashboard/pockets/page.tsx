import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CreatePocketForm from "@/components/pockets/create-pocket-form";
import {
  CustomPocket,
  CustomWallet,
  pocketSelect,
  walletSelect,
} from "@/components/pockets/custom-type";
import { PocketList } from "@/components/pockets/pocket-list";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Pockets({
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

  const exchangeRate = (
    await prisma.exchangeRate.findFirst({
      orderBy: { createdAt: "desc" },
    })
  )?.data as Prisma.JsonObject;

  const wallets = (
    await prisma.wallet.findMany({
      where: { userId: user.id },
      select: walletSelect,
    })
  ).map((wallet) => ({
    ...wallet,
    balance: Number(wallet.balance),
  }));

  const walletIds = wallets.map((wallet) => wallet.id);

  const pocketCount = await prisma.pocket.count({
    where: { walletId: { in: walletIds } },
  });

  const pockets: CustomPocket[] = (
    await prisma.pocket.findMany({
      where: { walletId: { in: walletIds } },
      select: pocketSelect,
      skip,
      take,
    })
  ).map((pocket) => {
    const rateToUSD = (exchangeRate[pocket.wallet.currency] as number) || 1;

    return {
      ...pocket,
      balance: Number(pocket.balance),
      balanceUSD: Number(pocket.balance) / rateToUSD,
    };
  });

  const pages = Math.ceil(pocketCount / amountPerPage);

  return (
    <DashboardLayout title="Pockets" views={views}>
      <div className="py-2 flex justify-center items-center">
        <PocketList
          wallets={wallets}
          pockets={pockets}
          page={page}
          pages={pages}
        />
      </div>
    </DashboardLayout>
  );
}

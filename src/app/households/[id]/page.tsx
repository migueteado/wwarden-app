"use server";

import { householdSelect } from "@/components/households/custom-types";
import HouseholdView from "@/components/households/household-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Household({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  const id = params.id;

  if (!user) {
    redirect("/auth/signin");
  }

  const household = await prisma.household.findUnique({
    where: {
      id,
    },
    select: householdSelect,
  });

  if (!household) {
    redirect("/households");
  }

  const wallets = (
    await prisma.wallet.findMany({
      where: { userId: user.sub },
    })
  ).map((wallet) => ({ ...wallet, balance: Number(wallet.balance) }));

  return (
    <DashboardLayout title={`Household ${household.name}`} user={user}>
      <HouseholdView household={household} wallets={wallets} />
    </DashboardLayout>
  );
}

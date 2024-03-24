import { ExchangeRateList } from "@/components/exchange/exchange-rate-list";
import RefreshExchangeRate from "@/components/exchange/refresh-exchange-rate";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Exchange() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const exchangeRate = await prisma.exchangeRate.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout title="Exchange" user={user}>
      <div className="flex">
        <RefreshExchangeRate />
      </div>
      <div className="py-2 flex justify-center items-center">
        <ExchangeRateList exchangeRate={exchangeRate} />
      </div>
    </DashboardLayout>
  );
}

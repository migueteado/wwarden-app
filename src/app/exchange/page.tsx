import { ExchangeRateList } from "@/components/exchange/exchange-rate-list";
import RefreshExchangeRate from "@/components/exchange/refresh-exchange-rate";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Exchange() {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  const exchangeRate = await prisma.exchangeRate.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout title="Exchange" views={views}>
      <div className="flex">
        <RefreshExchangeRate />
      </div>
      <div className="py-2 flex justify-center items-center">
        <ExchangeRateList exchangeRate={exchangeRate} />
      </div>
    </DashboardLayout>
  );
}

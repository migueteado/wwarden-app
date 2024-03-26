import { DashboardLayout } from "@/components/layout/dashboard-layout";
import CreatePocketForm from "@/components/pockets/create-pocket-form";
import { CustomWallet, walletSelect } from "@/components/pockets/custom-type";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Pockets() {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  const wallets: CustomWallet[] = (
    await prisma.wallet.findMany({
      where: { userId: user.id },
      select: walletSelect,
    })
  ).map((wallet) => {
    return {
      ...wallet,
      balance: Number(wallet.balance),
    };
  });

  return (
    <DashboardLayout title="Pockets" views={views}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <CreatePocketForm wallets={wallets} />
      </div>
    </DashboardLayout>
  );
}

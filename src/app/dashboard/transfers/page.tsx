import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { walletSelect } from "@/components/transactions/custom-type";
import CreateTransferForm from "@/components/transfers/create-transfer-form";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Transfers() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.sub },
    select: walletSelect,
  });

  return (
    <DashboardLayout title="Transfers" user={user}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <CreateTransferForm wallets={wallets} />
      </div>
      <div className="py-2 flex justify-center items-center">
        {/* <WalletList wallets={wallets} page={page} pages={pages} /> */}
      </div>
    </DashboardLayout>
  );
}

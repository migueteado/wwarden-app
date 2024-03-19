import AddWallet from "@/components/add-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EmptyMessage } from "@/components/empty-message";
import { Separator } from "@/components/ui/separator";
import { WalletList } from "@/components/wallet-list";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardWallets() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const wallets = (
    await prisma.wallet.findMany({ where: { userId: user.sub } })
  ).map((wallet) => ({ ...wallet, balance: Number(wallet.balance) }));

  return (
    <DashboardLayout title="Wallets" user={user}>
      <div className="flex items-center justify-start pb-2">
        <AddWallet />
      </div>

      <Separator />
      <div className="py-2 flex justify-center items-center">
        {wallets.length > 0 ? (
          <WalletList wallets={wallets} />
        ) : (
          <EmptyMessage message="No wallets found" />
        )}
      </div>
    </DashboardLayout>
  );
}

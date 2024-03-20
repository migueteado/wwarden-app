import AddWallet from "@/components/wallets/add-wallet";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EmptyMessage } from "@/components/empty-message";
import { WalletList } from "@/components/wallets/wallet-list";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DashboardWallets({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await getUser();
  const amountPerPage = 20;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const skip = (page - 1) * amountPerPage;
  const take = amountPerPage;

  if (!user) {
    redirect("/auth/signin");
  }

  const walletCount = await prisma.wallet.count({
    where: { userId: user.sub },
  });
  const wallets = (
    await prisma.wallet.findMany({
      where: { userId: user.sub },
      skip,
      take,
      orderBy: {
        balance: "desc",
      },
    })
  ).map((wallet) => ({ ...wallet, balance: Number(wallet.balance) }));

  const pages = Math.ceil(walletCount / amountPerPage);

  return (
    <DashboardLayout title="Wallets" user={user}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <AddWallet />
      </div>
      <div className="py-2 flex justify-center items-center">
        <WalletList wallets={wallets} page={page} pages={pages} />
      </div>
    </DashboardLayout>
  );
}

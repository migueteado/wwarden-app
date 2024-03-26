import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function Pockets({ params }: { params: { id: string } }) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  const wallet = await prisma.wallet.findUnique({ where: { id: params.id } });

  if (!wallet) {
    notFound();
  }

  return (
    <DashboardLayout title={`Wallet ${wallet.name}`} views={views}>
      <></>
    </DashboardLayout>
  );
}

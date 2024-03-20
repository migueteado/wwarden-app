import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardTransactions() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout title="Transactions" user={user}>
      <></>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";

export default function DashboardTransactions() {
  const username = cookies().get("username")?.value ?? "";

  return (
    <DashboardLayout title="Transactions" username={username}>
      <></>
    </DashboardLayout>
  );
}

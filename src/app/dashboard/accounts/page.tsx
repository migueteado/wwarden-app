import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";

export default function DashboardAccounts() {
  const username = cookies().get("username")?.value ?? "";

  return (
    <DashboardLayout title="Accounts" username={username}>
      <></>
    </DashboardLayout>
  );
}

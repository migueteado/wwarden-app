import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";

export default function Dashboard() {
  const username = cookies().get("username")?.value ?? "";

  return (
    <DashboardLayout title="Dashboard" username={username}>
      <></>
    </DashboardLayout>
  );
}

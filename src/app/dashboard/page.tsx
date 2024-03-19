import { DashboardLayout } from "@/components/dashboard-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout title="Dashboard" user={user}>
      <></>
    </DashboardLayout>
  );
}

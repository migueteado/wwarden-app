import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout title="Profile" user={user}>
      <></>
    </DashboardLayout>
  );
}

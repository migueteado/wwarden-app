import { DashboardLayout } from "@/components/dashboard-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardProfile() {
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

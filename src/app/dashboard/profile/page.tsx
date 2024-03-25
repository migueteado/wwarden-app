import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getViews } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout title="Profile" views={views}>
      <></>
    </DashboardLayout>
  );
}

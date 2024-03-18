import { DashboardLayout } from "@/components/dashboard-layout";
import { cookies } from "next/headers";

export default function DashboardProfile() {
  const username = cookies().get("username")?.value ?? "";

  return (
    <DashboardLayout title="Profile" username={username}>
      <></>
    </DashboardLayout>
  );
}

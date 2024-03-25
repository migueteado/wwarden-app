import CreateHouseholdForm from "@/components/households/create-household-form";
import { householdSelect } from "@/components/households/custom-types";
import { HouseholdList } from "@/components/households/household-list";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getViews } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Households({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const views = await getViews();
  const user = views.find((view) => view.type === "user");
  const amountPerPage = 20;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  if (!user) {
    redirect("/auth/signin");
  }

  const householdCount = await prisma.household.count({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });
  const households = await prisma.household.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: householdSelect,
  });

  const pages = Math.ceil(householdCount / amountPerPage);

  return (
    <DashboardLayout title="Households" views={views}>
      <div className="fixed z-50 bottom-8 right-8 lg:bottom-12 lg:right-12">
        <CreateHouseholdForm />
      </div>
      <div className="py-2 flex justify-center items-center">
        <HouseholdList households={households} page={page} pages={pages} />
      </div>
    </DashboardLayout>
  );
}

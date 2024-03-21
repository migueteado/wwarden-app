"use server";

import { cookies } from "next/headers";
import { CreateHouseholdInput } from "./create-household-form";
import { verifyJWT } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { DeleteHouseholdInput } from "./delete-household-form";
import { UpdateHouseholdInput } from "./update-household-form";

export async function createHousehold(data: CreateHouseholdInput) {
  try {
    const token = cookies().get("token")?.value ?? "";

    if (!token) {
      throw new Error("Unauthorized");
    }

    const { sub } = await verifyJWT(token);
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      throw new Error("Unauthorized");
    }

    const subcategory = await prisma.subcategory.findFirst({
      where: { name: "Balance Inicial" },
    });

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    const { household } = await prisma.$transaction(async (tx) => {
      const household = await prisma.household.create({
        data: data,
      });

      await prisma.householdMember.create({
        data: {
          householdId: household.id,
          type: "OWNER",
          userId: user.id,
        },
      });

      return { household };
    });

    return {
      status: true,
      data: { household },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function updateHousehold(data: UpdateHouseholdInput) {
  try {
    const token = cookies().get("token")?.value ?? "";

    if (!token) {
      throw new Error("Unauthorized");
    }

    const { sub } = await verifyJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        households: { select: { household: { select: { id: true } } } },
      },
    });

    if (!user || !user.households.some((h) => h.household.id === data.id)) {
      throw new Error("Unauthorized");
    }

    const household = await prisma.household.update({
      where: { id: data.id },
      data: data,
    });

    return {
      status: true,
      data: {
        household,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function deleteHousehold(data: DeleteHouseholdInput) {
  try {
    const token = cookies().get("token")?.value ?? "";

    if (!token) {
      throw new Error("Unauthorized");
    }

    const { sub } = await verifyJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        households: { select: { household: { select: { id: true } } } },
      },
    });

    if (!user || !user.households.some((h) => h.household.id === data.id)) {
      throw new Error("Unauthorized");
    }

    const household = await prisma.household.delete({
      where: { id: data.id },
    });

    return {
      status: true,
      data: {
        household,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

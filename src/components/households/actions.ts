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

export async function addMember(data: {
  householdId: string;
  username: string;
}) {
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

    if (
      !user ||
      !user.households.some((h) => h.household.id === data.householdId)
    ) {
      throw new Error("Unauthorized");
    }

    const member = await prisma.user.findUnique({
      where: { username: data.username },
      select: { id: true },
    });

    if (!member) {
      throw new Error("User not found");
    }

    const householdMember = await prisma.householdMember.create({
      data: {
        householdId: data.householdId,
        userId: member.id,
        type: "MEMBER",
      },
    });

    return {
      status: true,
      data: {
        member: householdMember,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

export async function addWallet(data: {
  householdId: string;
  walletId: string;
}) {
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

    if (
      !user ||
      !user.households.some((h) => h.household.id === data.householdId)
    ) {
      throw new Error("Unauthorized");
    }

    const wallet = await prisma.wallet.findUnique({
      where: { id: data.walletId },
      select: { id: true },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const householdWallet = await prisma.householdWallet.create({
      data: {
        householdId: data.householdId,
        walletId: wallet.id,
      },
    });

    return {
      status: true,
      data: {
        member: householdWallet,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

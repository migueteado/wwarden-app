"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { DeleteWalletInput } from "../delete-wallet";

export async function deleteWallet(data: DeleteWalletInput) {
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

    const wallet = await prisma.wallet.delete({
      where: { id: data.id },
    });

    return {
      status: true,
      data: { wallet: { ...wallet, balance: Number(wallet.balance) } },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

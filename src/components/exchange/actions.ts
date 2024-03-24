"use server";

import { getCurrentExchangeRate } from "@/lib/exchangerate-api";
import prisma from "@/lib/prisma";

export async function createExchangeRates() {
  try {
    const exchangeRates = await getCurrentExchangeRate();

    const savedRates = await prisma.exchangeRate.create({
      data: {
        data: exchangeRates,
      },
    });

    return {
      status: true,
      rates: savedRates,
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: (err as Error).message,
    };
  }
}

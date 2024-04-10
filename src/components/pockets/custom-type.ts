import { Prisma } from "@prisma/client";

export const walletSelect = Prisma.validator<Prisma.WalletSelect>()({
  id: true,
  currency: true,
  name: true,
  balance: true,
  platform: true,
});

export type CustomWallet = Omit<
  Prisma.WalletGetPayload<{
    select: typeof walletSelect;
  }>,
  "balance"
> & { balance: number };

export const pocketSelect = Prisma.validator<Prisma.PocketSelect>()({
  id: true,
  name: true,
  balance: true,
  wallet: {
    select: {
      id: true,
      currency: true,
      name: true,
      user: { select: { id: true, username: true } },
    },
  },
});

export type CustomPocket = Omit<
  Prisma.PocketGetPayload<{
    select: typeof pocketSelect;
  }>,
  "balance"
> & { balance: number; balanceUSD: number };

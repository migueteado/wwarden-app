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

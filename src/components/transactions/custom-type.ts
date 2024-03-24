import { Prisma } from "@prisma/client";

export const transactionSelect = Prisma.validator<Prisma.TransactionSelect>()({
  id: true,
  entity: true,
  description: true,
  amount: true,
  amountUSD: true,
  type: true,
  date: true,
  transferId: true,
  category: {
    select: { id: true, name: true },
  },
  subcategory: {
    select: { id: true, name: true },
  },
  wallet: { select: { id: true, currency: true, name: true } },
});

export type CustomTransaction = Omit<
  Prisma.TransactionGetPayload<{
    select: typeof transactionSelect;
  }>,
  "amount" | "amountUSD"
> & { amount: number; amountUSD: number };

export const walletSelect = Prisma.validator<Prisma.WalletSelect>()({
  id: true,
  currency: true,
  name: true,
});

export type CustomWallet = Prisma.WalletGetPayload<{
  select: typeof walletSelect;
}>;

export const categorySelect = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  name: true,
  type: true,
  subcategories: {
    select: {
      id: true,
      name: true,
    },
  },
});

export type CustomCategory = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;

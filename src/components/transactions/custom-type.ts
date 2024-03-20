import { Prisma } from "@prisma/client";

export const transactionSelect = Prisma.validator<Prisma.TransactionSelect>()({
  id: true,
  entity: true,
  description: true,
  amount: true,
  type: true,
  date: true,
  category: {
    select: { name: true },
  },
  subcategory: {
    select: { name: true },
  },
  wallet: { select: { currency: true, name: true } },
});

export type CustomTransaction = Omit<
  Prisma.TransactionGetPayload<{
    select: typeof transactionSelect;
  }>,
  "amount"
> & { amount: number };

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

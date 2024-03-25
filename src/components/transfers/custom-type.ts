import { Prisma } from "@prisma/client";
import { CustomTransaction } from "../transactions/custom-type";

export const transferSelect = Prisma.validator<Prisma.TransferSelect>()({
  id: true,
  fee: true,
  feeUSD: true,
  transactions: {
    select: {
      id: true,
      entity: true,
      description: true,
      amount: true,
      amountUSD: true,
      type: true,
      date: true,
      category: {
        select: { id: true, name: true },
      },
      subcategory: {
        select: { id: true, name: true },
      },
      wallet: {
        select: {
          id: true,
          currency: true,
          name: true,
          user: { select: { id: true, username: true } },
        },
      },
    },
  },
});

export type CustomTransfer = Omit<
  Prisma.TransferGetPayload<{
    select: typeof transferSelect;
  }>,
  "fee" | "feeUSD" | "transactions"
> & { fee: number; feeUSD: number; transactions: CustomTransaction[] };

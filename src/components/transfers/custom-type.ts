import { Prisma } from "@prisma/client";
import { CustomTransaction } from "../transactions/custom-type";

export const transferSelect = Prisma.validator<Prisma.TransferSelect>()({
  id: true,
  fee: true,
  transactions: {
    select: {
      id: true,
      entity: true,
      description: true,
      amount: true,
      type: true,
      date: true,
      category: {
        select: { id: true, name: true },
      },
      subcategory: {
        select: { id: true, name: true },
      },
      wallet: { select: { id: true, currency: true, name: true } },
    },
  },
});

export type CustomTransfer = Omit<
  Prisma.TransferGetPayload<{
    select: typeof transferSelect;
  }>,
  "fee" | "transactions"
> & { fee: number; transactions: CustomTransaction[] };

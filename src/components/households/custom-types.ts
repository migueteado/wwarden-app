import { Prisma } from "@prisma/client";

export const householdSelect = Prisma.validator<Prisma.HouseholdSelect>()({
  id: true,
  name: true,
  members: {
    select: {
      id: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  },
  wallets: {
    select: {
      id: true,
      wallet: { select: { id: true, name: true, currency: true } },
    },
  },
});

export type CustomHousehold = Prisma.HouseholdGetPayload<{
  select: typeof householdSelect;
}>;

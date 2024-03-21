import { cookies } from "next/headers";
import { JWTPayload, verifyJWT } from "./jwt";
import prisma from "./prisma";

export const getUser = async (): Promise<JWTPayload | null> => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return null;
  }

  const user = await verifyJWT(token);

  return user;
};

export const getHouseholds = async (userId: string) => {
  const households = await prisma.household.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  return households;
};

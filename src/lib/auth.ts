import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import prisma from "./prisma";

export type View = {
  type: "user" | "household";
  id: string;
  name: string;
};

export const getViews = async (): Promise<View[] | []> => {
  const views: View[] = [];
  const token = cookies().get("token")?.value;

  if (!token) {
    return views;
  }

  const user = await verifyJWT(token);
  views.push({
    type: "user",
    id: user.sub,
    name: user.username,
  });

  const households = await prisma.household.findMany({
    where: {
      members: {
        some: {
          userId: user.sub,
        },
      },
    },
  });

  households.forEach((household) => {
    views.push({
      type: "household",
      id: household.id,
      name: household.name,
    });
  });

  return views;
};

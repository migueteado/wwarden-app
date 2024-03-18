import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import prisma from "./prisma";

export const getUser = async () => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return null;
  }

  const { sub } = await verifyJWT<{ sub: string }>(token);

  const user = prisma.user.findUnique({ where: { id: sub } });

  return user;
};

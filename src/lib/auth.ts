import { cookies } from "next/headers";
import { JWTPayload, verifyJWT } from "./jwt";

export const getUser = async (): Promise<JWTPayload | null> => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return null;
  }

  const user = await verifyJWT(token);

  return user;
};

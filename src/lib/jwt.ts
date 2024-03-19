import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";
import { User } from "@prisma/client";

export type JWTPayload = {
  sub: User["id"];
  username: User["username"];
  email: User["email"];
};

export const signJWT = async (
  payload: JWTPayload,
  options: { exp: string }
) => {
  try {
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const alg = "HS256";
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async (token: string): Promise<JWTPayload> => {
  try {
    return (await jwtVerify(token, new TextEncoder().encode(ENV.JWT_SECRET)))
      .payload as JWTPayload;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid Token.");
  }
};

"use server";

import { cookies } from "next/headers";

export async function signoutUser() {
  cookies().delete("token");
  cookies().delete("username");

  return {
    status: true,
    message: "User signed out",
  };
}

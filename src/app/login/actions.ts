"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(email: string, password: string): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw err;
  }
  // Return null = success. Client handles redirect so it can break out of iframe.
  return null;
}

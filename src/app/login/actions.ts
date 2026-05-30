"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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
    // If it's a NEXT_REDIRECT, let it propagate
    throw err;
  }
  redirect("/dashboard");
}

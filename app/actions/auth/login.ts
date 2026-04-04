"use server";

import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { loginSchema, LoginType } from "@/schemas/auth/login.schema";
import bcrypt from "bcryptjs";

type LoginActionResponse = {
  success?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function loginAction(data: LoginType): Promise<LoginActionResponse> {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        errors: {
          email: ["Email or password is wrong"],
          password: ["Email or password is wrong"],
        },
      };
    }

    await createSession(user.id);

    return {
      success: true,
    };
  } catch (error) {
    console.log("Login Error: ", error);

    // error instance of standard Error
    if (error instanceof Error) {
      return {
        errors: { _form: [error.message] },
      };
    }

    return {
      errors: {
        _form: ["Login failed, please try again"],
      },
    };
  }
}

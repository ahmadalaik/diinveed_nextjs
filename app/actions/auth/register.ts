"use server";

import bcrypt from "bcryptjs";
import { registerSchema, RegisterType } from "@/schemas/auth/register.schema";
import { prisma } from "@/lib/prisma";

type RegisterActionResponse = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function registerAction(data: RegisterType): Promise<RegisterActionResponse> {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        errors: { email: ["Email already registered"] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Registration Error:", error);

    // error instance of standard Error
    if (error instanceof Error) {
      return {
        // errors: { _form: [error.message] },
        errors: { _form: ["Something went wrong, please try again"] },
      };
    }

    return {
      errors: {
        _form: ["Registration failed, please try again"],
      },
    };
  }
}

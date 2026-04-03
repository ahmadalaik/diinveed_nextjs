"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginType } from "@/schemas/auth/login.schema";
import { GalleryVerticalEnd } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

export default function LoginForm() {
  const form = useForm<LoginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginType) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-linear-to-b from-muted/50 to-card px-8 py-8 shadow-lg/5 dark:from-transparent dark:shadow-xl">
        <div
          className="absolute inset-0 -top-px -left-px z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
      `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
      `,
            WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
      `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />

        <div className="relative isolate flex flex-col items-center">
          <GalleryVerticalEnd className="h-9 w-9" />
          <p className="mt-4 font-semibold text-xl tracking-tight">
            Log in to Shadcn UI Blocks
          </p>

          <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="johndoe@example.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>

          <div className="mt-5 space-y-5">
            <Link
              className="block text-center text-muted-foreground text-sm underline"
              href="#"
            >
              Forgot your password?
            </Link>
            <p className="text-center text-sm">
              Don&apos;t have an account?
              <Link className="ml-1 text-muted-foreground underline" href="#">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { coupleFormSchema, CoupleFormType } from "@/schemas/invitation/couple.schema";

type CoupleActionResponse = {
  success?: boolean;
  errors?: {
    brideName?: string[];
    brideNickname?: string[];
    fatherBrideName?: string[];
    motherBrideName?: string[];
    brideDescription?: string[];
    bridePhotoUrl?: string[];
    bridePhotoPublicId?: string[];
    groomName?: string[];
    groomNickname?: string[];
    fatherGroomName?: string[];
    motherGroomName?: string[];
    groomDescription?: string[];
    groomPhotoUrl?: string[];
    groomPhotoPublicId?: string[];
    _form?: string[];
  };
};

export async function upsertCoupleAction(
  payload: CoupleFormType,
): Promise<CoupleActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: { _form: ["Unauthorized. Please login first."] } };
  }

  const parsed = coupleFormSchema.safeParse({
    ...payload,
    brideDescription: payload.brideDescription || undefined,
    groomDescription: payload.groomDescription || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { data } = parsed;

  try {
    const slug = `${data.brideNickname.toLowerCase()}-and-${data.groomNickname.toLocaleLowerCase()}`;

    await prisma.invitation.upsert({
      where: { userId: user.id },
      update: { ...data, slug },
      create: {
        ...data,
        slug,
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Create or Update Invitation Error:", error);

    if (error instanceof Error) {
      return {
        errors: { _form: ["Something went wrong, please try again"] },
      };
    }

    return {
      errors: { _form: ["Failed to save couple information, please try again"] },
    };
  }
}

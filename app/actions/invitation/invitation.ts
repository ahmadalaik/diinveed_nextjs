"use server";

import { invitationSchema } from "@/schemas/invitation/invitation.schema";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

type UpsertInvitationActionResponse = {
  success?: boolean;
  errors?: {
    brideName?: string[];
    brideNickname?: string[];
    fatherBrideName?: string[];
    motherBrideName?: string[];
    groomName?: string[];
    groomNickname?: string[];
    fatherGroomName?: string[];
    motherGroomName?: string[];
    bridePhoto?: string[];
    brideDescription?: string[];
    groomPhoto?: string[];
    groomDescription?: string[];
    _form?: string[];
  };
};

type InvitationPayload = {
  brideName: string;
  brideNickname: string;
  fatherBrideName: string;
  motherBrideName: string;
  brideDescription?: string;
  bridePhotoUrl?: string;
  bridePhotoPublicId?: string;
  groomName: string;
  groomNickname: string;
  fatherGroomName: string;
  motherGroomName: string;
  groomDescription?: string;
  groomPhotoUrl?: string;
  groomPhotoPublicId?: string;
};

export async function upsertInvitationAction(
  payload: InvitationPayload,
): Promise<UpsertInvitationActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, errors: { _form: ["Unauthorized. Please login first."] } };
  }

  const parsed = invitationSchema.safeParse({
    brideName: payload.brideName,
    brideNickname: payload.brideNickname,
    fatherBrideName: payload.fatherBrideName,
    motherBrideName: payload.motherBrideName,
    brideDescription: payload.brideDescription ? payload.brideDescription : undefined,
    bridePhoto: payload.bridePhotoUrl
      ? { url: payload.bridePhotoUrl, publicId: payload.bridePhotoPublicId ?? "" }
      : undefined,
    groomName: payload.groomName,
    groomNickname: payload.groomNickname,
    fatherGroomName: payload.fatherGroomName,
    motherGroomName: payload.motherGroomName,
    groomDescription: payload.groomDescription ? payload.groomDescription : undefined,
    groomPhoto: payload.groomPhotoUrl
      ? { url: payload.groomPhotoUrl, publicId: payload.groomPhotoPublicId ?? "" }
      : undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { data } = parsed;

  try {
    const slug = `${data.brideNickname.toLowerCase()}-and-${data.groomNickname.toLocaleLowerCase()}`;

    await prisma.invitation.upsert({
      where: { userId: user.id },
      update: {
        slug,
        brideName: data.brideName,
        brideNickname: data.brideNickname,
        fatherBrideName: data.fatherBrideName,
        motherBrideName: data.motherBrideName,
        brideDescription: data.brideDescription,
        bridePhotoUrl: data.bridePhoto?.url,
        bridePhotoPublicId: data.bridePhoto?.publicId,
        groomName: data.groomName,
        groomNickname: data.groomNickname,
        fatherGroomName: data.fatherGroomName,
        motherGroomName: data.motherGroomName,
        groomDescription: data.groomDescription,
        groomPhotoUrl: data.groomPhoto?.url,
        groomPhotoPublicId: data.groomPhoto?.publicId,
      },
      create: {
        userId: user.id,
        slug,
        brideName: data.brideName,
        brideNickname: data.brideNickname,
        fatherBrideName: data.fatherBrideName,
        motherBrideName: data.motherBrideName,
        brideDescription: data.brideDescription,
        bridePhotoUrl: data.bridePhoto?.url,
        bridePhotoPublicId: data.bridePhoto?.publicId,
        groomName: data.groomName,
        groomNickname: data.groomNickname,
        fatherGroomName: data.fatherGroomName,
        motherGroomName: data.motherGroomName,
        groomDescription: data.groomDescription,
        groomPhotoUrl: data.groomPhoto?.url,
        groomPhotoPublicId: data.groomPhoto?.publicId,
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

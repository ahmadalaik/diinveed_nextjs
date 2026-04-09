"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhotoCropper from "./photo-cropper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { uploadToCloudinaryClient } from "@/lib/cloudinary/upload";
import { useState } from "react";
import { coupleFormSchema, CoupleFormType } from "@/schemas/invitation/couple.schema";
import { deleteFromCloudinaryClient } from "@/lib/cloudinary/delete";
import { upsertCoupleAction } from "@/app/actions/invitation/couple";
import ButtonForm from "./button-form";

const defaultCoupleValues = {
  brideName: "",
  brideNickname: "",
  fatherBrideName: "",
  motherBrideName: "",
  groomName: "",
  groomNickname: "",
  fatherGroomName: "",
  motherGroomName: "",
};

export default function CoupleCreateForm() {
  const router = useRouter();

  const [bridePhotoFile, setBridePhotoFile] = useState<File | null>(null);
  const [bridePhotoPreview, setBridePhotoPreview] = useState<string | undefined>(undefined);
  const [groomPhotoFile, setGroomPhotoFile] = useState<File | null>(null);
  const [groomPhotoPreview, setGroomPhotoPreview] = useState<string | undefined>(undefined);

  const form = useForm<CoupleFormType>({
    resolver: zodResolver(coupleFormSchema),
    defaultValues: defaultCoupleValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: CoupleFormType) => {
    const folderPath = `invitations_${new Date().getTime()}`;

    let bridePhotoUrl: string | undefined;
    let bridePhotoPublicId: string | undefined;
    let groomPhotoUrl: string | undefined;
    let groomPhotoPublicId: string | undefined;

    try {
      if (bridePhotoFile) {
        const result = await uploadToCloudinaryClient(bridePhotoFile, folderPath);
        bridePhotoUrl = result.secure_url;
        bridePhotoPublicId = result.public_id;
      }

      if (groomPhotoFile) {
        const result = await uploadToCloudinaryClient(groomPhotoFile, folderPath);
        groomPhotoUrl = result.secure_url;
        groomPhotoPublicId = result.public_id;
      }
    } catch {
      if (bridePhotoPublicId) await deleteFromCloudinaryClient(bridePhotoPublicId);
      if (groomPhotoPublicId) await deleteFromCloudinaryClient(groomPhotoPublicId);

      toast.error("Failed to upload photo. Please try again.");
      return;
    }

    const result = await upsertCoupleAction({
      ...data,
      bridePhotoUrl,
      bridePhotoPublicId,
      groomPhotoUrl,
      groomPhotoPublicId,
    });

    if (result.errors) {
      if (result.errors._form) {
        toast.error(result.errors._form[0]);
      }

      Object.keys(result.errors).forEach((key) => {
        const field = key as keyof CoupleFormType;
        if (result.errors?.[field]) {
          setError(field, {
            type: "server",
            message: result.errors[field]?.[0],
          });
        }
      });
      return;
    }

    if (result.success) {
      toast.success("Couple information created successfully!");
      router.push("/dashboard/invitation");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form id="form-inv-couple" className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Bride */}
        <Card className="rounded-2xl border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-500">Bride</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 sm:gap-6 place-items-center">
              <PhotoCropper
                imageUrl={bridePhotoPreview}
                onFileSelected={(file) => {
                  setBridePhotoFile(file);
                  setBridePhotoPreview(URL.createObjectURL(file));
                }}
                isDisabled={isSubmitting}
              />

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 sm:pt-0">
                <Controller
                  name="brideName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel className="text-sm">Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Jane Watson"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="brideNickname"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel>Nickname</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Jane"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="fatherBrideName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel>Father Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Joko"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="motherBrideName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel>Mother Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Sri"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name="brideDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-1 md:col-span-2">
                    <FieldLabel>About</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      rows={3}
                      placeholder="Second daughter of Mr.Joko and Mrs.Sri"
                      autoComplete="off"
                      disabled={isSubmitting}
                      className="text-sm"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Groom */}
        <Card className="rounded-2xl border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-500">Groom</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 sm:gap-6 place-items-center">
              <PhotoCropper
                imageUrl={groomPhotoPreview}
                onFileSelected={(file) => {
                  setGroomPhotoFile(file);
                  setGroomPhotoPreview(URL.createObjectURL(file));
                }}
                isDisabled={isSubmitting}
              />

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 pt-3 sm:pt-0">
                <Controller
                  name="groomName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="col-span-1">
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="John Doe"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="groomNickname"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Nickname</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="John"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="fatherGroomName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Father Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Widodo"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="motherGroomName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Mother Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Mulyani"
                        autoComplete="off"
                        disabled={isSubmitting}
                        className="text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Controller
                name="groomDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-1 md:col-span-2">
                    <FieldLabel>About</FieldLabel>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      rows={3}
                      placeholder="First son of Mr.Widodo and Mrs.Mulyani"
                      autoComplete="off"
                      disabled={isSubmitting}
                      className="text-sm"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </form>

      <ButtonForm isDisabled={isSubmitting} />
    </div>
  );
}

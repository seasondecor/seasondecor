"use client";

import React, { useCallback, useState } from "react";
import { Label } from "@/app/components/ui/Inputs/Label";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import Link from "next/link";
import Button2 from "@/app/components/ui/Buttons/Button2";
import LiquidChrome from "@/app/components/ui/animated/LiquidChrome";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateProviderProfile } from "@/app/queries/user/provider.query";
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { 
  Divider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  TextField,
  Box
} from "@mui/material";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import { useGetProviderOptions } from "@/app/queries/user/provider.query";
import { toast } from "sonner";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  bio: yup.string().required("Bio is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  yearOfExperience: yup.number()
    .required("Year of experience is required")
    .min(1, "Years of experience must be at least 1")
    .integer("Years of experience must be a whole number")
    .typeError("Please enter a valid number"),
  pastWorkPlaces: yup.string().required("Past work places is required"),
  pastProjects: yup.string().required("Past projects is required"),
  skillId: yup.number().required("Skill is required"),
  certificateImages: yup
    .array()
    .of(yup.string())
    .required("Certificate images are required"),
});

export default function RegistrationPage() {
  const { user } = useUser();
  const mutationCreate = useCreateProviderProfile();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);

  const { data: providerOptions, isLoading: isLoadingProviderOptions } =
    useGetProviderOptions();

  const skill = providerOptions?.skills;
  const style = providerOptions?.decorationStyles;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: user?.avatar || null,
      name: "",
      bio: "",
      phone: "",
      address: "",
      yearOfExperience: "",
      pastWorkPlaces: "",
      pastProjects: "",
      skillId: "",
      certificateImages: [],
    },
  });

  const handleImageUpload = (uploadedImages) => {
    // Store the actual file objects
    setCertificates(uploadedImages);

    // Check if we have file objects to work with
    if (uploadedImages && uploadedImages.length > 0) {
      console.log("Certificate files:", uploadedImages);

      // Create an array of URLs for validation purposes only
      // In actual submission we'll use the raw files
      const imageUrls = uploadedImages
        .map((img, index) => (img.name ? URL.createObjectURL(img) : null))
        .filter(Boolean);

      setValue("certificateImages", imageUrls);
      console.log("Certificate image URLs for validation:", imageUrls);
    } else {
      setValue("certificateImages", []);
      console.log("No certificate images uploaded");
    }
  };

  const onSubmit = useCallback(
    async (data) => {
      if (certificates.length === 0) {
        toast.error("Please upload at least one certificate image");
        return;
      }

      // Create FormData to properly handle file uploads
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Bio", data.bio);
      formData.append("Phone", data.phone);
      formData.append("Address", data.address);
      formData.append("YearsOfExperience", Number(data.yearOfExperience));
      formData.append("PastWorkPlaces", data.pastWorkPlaces);
      formData.append("PastProjects", data.pastProjects);
      formData.append("SkillId", Number(data.skillId));

      // Append each certificate image file to FormData
      certificates.forEach((file, index) => {
        formData.append("CertificateImages", file);
      });

      console.log(
        "Submitting provider profile with certificates:",
        certificates.length
      );

      mutationCreate.mutate(formData, {
        onSuccess: () => {
          reset();
          router.push("/");
        },
        onError: (error) => {
        },
      });
    },
    [mutationCreate, certificates, reset, router]
  );

  return (
    <div className="w-full min-h-screen relative">
      {/* LiquidChrome background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <LiquidChrome 
          baseColor={[0.1, 0.1, 0.1]} 
          speed={0.1} 
          amplitude={0.1} 
          interactive={false}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full min-h-screen flex justify-center items-center py-10">
        <div className="absolute right-4 top-4 bg-white rounded-full dark:bg-neutral-900">
          <ThemeSwitch />
        </div>
        
        <div className="bg-white dark:bg-neutral-900 max-w-7xl rounded-xl w-full p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <div className="logo-wrapper flex justify-center sm:justify-start items-center relative mb-2 sm:mb-0 sm:mr-6">
              <Logo outsideStyle="!m-0" insideStyle="!m-0" />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mb-6">
            <BodyTypo
              bodylabel="Provide more information"
              fontWeight="bold"
            />
            <FootTypo
              footlabel="Please fill out the form below to complete your registration"
            />
            <FootTypo
              footlabel="Required fields are marked with an asterisk (*)"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Box display="flex" sm="flex" justifyContent="start">
              <EditAvatar
                userImg={user?.avatar}
                className="justify-center sm:justify-start"
              />
            </Box>

            <div className="mb-2 sm:mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="providerName">Display name *</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="John Doe"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      className="dark:bg-neutral-800"
                    />
                  )}
                />
              </div>
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="providerPhone">Phone number *</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="tel"
                      placeholder="+84"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      className="dark:bg-neutral-800"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="providerBio">Bio *</Label>
              <div className="w-full">
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <TipTapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Introduce yourself..."
                      required={true}
                      error={!!errors.bio}
                      helperText={errors.bio?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="providerAddress">Current Address *</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="ward, district, city"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    className="dark:bg-neutral-800"
                  />
                )}
              />
            </div>

            <Divider
              textAlign="left"
              flexItem
              className="text-primary font-bold py-5"
            >
              Professional Background
            </Divider>

            <div className="mb-2 sm:mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="yearOfExperience">Years of experience *</Label>
                <Controller
                  name="yearOfExperience"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      placeholder="5"
                      error={!!errors.yearOfExperience}
                      helperText={errors.yearOfExperience?.message}
                      className="dark:bg-neutral-800"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0 || e.target.value === "") {
                          field.onChange(e);
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="pastWorkPlaces">Past Work Places *</Label>
                <Controller
                  name="pastWorkPlaces"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Previous employers"
                      error={!!errors.pastWorkPlaces}
                      helperText={errors.pastWorkPlaces?.message}
                      className="dark:bg-neutral-800"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="pastProjects">Past Projects *</Label>
              <Controller
                name="pastProjects"
                control={control}
                render={({ field }) => (
                  <TipTapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Past projects you've worked on"
                    required={true}
                    error={!!errors.pastProjects}
                    helperText={errors.pastProjects?.message}
                  />
                )}
              />
              {errors.pastProjects && (
                <p className="text-red text-sm">
                  {errors.pastProjects.message}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col space-y-1 sm:space-y-2">
              <Label htmlFor="certificateImages">
                Your degree certificate or any other professional
                certificate... *
              </Label>
              <ImageUpload
                onImageChange={handleImageUpload}
                className="w-full border-primary"
              />
            </div>

            <Divider
              textAlign="left"
              flexItem
              className="text-primary font-bold py-5"
            >
              Professional Skills & Style
            </Divider>

            <div className="space-y-4">
              <FormControl fullWidth error={!!errors.skillId}>
                <InputLabel
                  className="dark:text-white"
                  id="skill-select-label"
                >
                  Skill *
                </InputLabel>
                <Select
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  labelId="skill-select-label"
                  id="skillId"
                  value={watch("skillId") || ""}
                  label="Skill *"
                  onChange={(e) => setValue("skillId", e.target.value)}
                  disabled={isLoadingProviderOptions}
                  className="dark:bg-neutral-900"
                >
                  {skill?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.skillId && (
                  <FormHelperText>Please select a skill</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="flex justify-between gap-4 sm:gap-16 items-center">
              <p className="text-sm hover:text-red">
                <Link href="/#">Do you need help ?</Link>
              </p>
            </div>
            <Button2
              onClick={handleSubmit(onSubmit)}
              loading={mutationCreate.isPending}
              label="Continue"
              btnClass="w-full"
              labelClass="justify-center p-2 sm:p-3 z-0"
              disabled={mutationCreate.isPending}
              icon={<FaAngleRight size={15} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

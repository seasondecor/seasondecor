"use client";

import React, { useCallback, useState } from "react";
import { Label } from "@/app/components/ui/Inputs/Label";
import Input from "@/app/components/ui/Inputs/Input";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import Link from "next/link";
import Button2 from "@/app/components/ui/Buttons/Button2";
import LiquidChrome from "@/app/components/ui/animated/LiquidChrome";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateProviderProfile } from "@/app/queries/user/provider.query";
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { Divider } from "@mui/material";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import { useGetProviderOptions } from "@/app/queries/user/provider.query";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { toast } from "sonner";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  bio: yup.string().required("Bio is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  yearOfExperience: yup.number().required("Year of experience is required"),
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
    register,
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
          amplitude={0} 
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
            <div className="flex justify-center sm:justify-start">
              <EditAvatar
                userImg={user?.avatar}
                className="justify-center sm:justify-start"
              />
            </div>

            <div className="mb-2 sm:mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="providerName">Provider's name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  required
                  className="pl-3"
                  register={register}
                />
                {errors.name && (
                  <p className="text-red text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="providerPhone"> Phone number *</Label>
                <Input
                  id="phone"
                  placeholder="+84"
                  type="number"
                  required
                  className="pl-3"
                  register={register}
                />
                {errors.phone && (
                  <p className="text-red text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="providerBio">Bio *</Label>
              <div className="w-full">
                <TipTapEditor
                  id="bio"
                  //value={watch("bio") || ""}
                  onChange={(html) => setValue("bio", html)}
                  placeholder="Introduce yourself..."
                  register={register}
                  required={true}
                  errors={errors}
                />
                {errors.bio && (
                  <p className="text-red text-sm">{errors.bio.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="providerAddress">Current Address *</Label>
              <Input
                id="address"
                placeholder="ward, district, city"
                type="text"
                required
                className="pl-3"
                register={register}
              />
              {errors.address && (
                <p className="text-red text-sm">{errors.address.message}</p>
              )}
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
                <Label htmlFor="yearOfExperience">
                  Years of experience *
                </Label>
                <Input
                  id="yearOfExperience"
                  placeholder="5"
                  type="number"
                  required
                  className="pl-3"
                  register={register}
                />
                {errors.yearOfExperience && (
                  <p className="text-red text-sm">
                    {errors.yearOfExperience.message}
                  </p>
                )}
              </div>
              <div className="flex w-full flex-col space-y-1 sm:space-y-2">
                <Label htmlFor="pastWorkPlaces">Past Work Places *</Label>
                <Input
                  id="pastWorkPlaces"
                  placeholder="Previous employers"
                  type="text"
                  required
                  className="pl-3"
                  register={register}
                />
                {errors.pastWorkPlaces && (
                  <p className="text-red text-sm">
                    {errors.pastWorkPlaces.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="pastProjects">Past Projects *</Label>
              <TipTapEditor
                id="pastProjects"
                //value={watch("pastProjects") || ""}
                onChange={(html) => setValue("pastProjects", html)}
                placeholder="Past projects you've worked on"
                register={register}
                required={true}
                errors={errors}
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

"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../components/SellerWrapper";
import {
  FaUser,
  FaLock,
  FaCreditCard,
  FaBell,
  FaStore,
  FaUserEdit,
  FaSave,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaTools,
  FaBusinessTime,
  FaBriefcase,
} from "react-icons/fa";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { Typography, Divider, Box, TextField, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import { Label } from "@/app/components/ui/Inputs/Label";
import { useGetProviderBySlug } from "@/app/queries/user/provider.query";
import Grid from "@mui/material/Grid2";
import { useUpdateProviderProfile } from "@/app/queries/user/provider.query";
import WalletTab from "./components/WalletTab";

const SellerAccount = () => {
  const { user } = useUser();
  const {
    data: provider,
    isFetching,
    isLoading,
  } = useGetProviderBySlug(user?.slug);

  const { mutate: updateProviderProfile, isPending: isUpdating } =
    useUpdateProviderProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  const tabOptions = [
    { id: "profile", label: "My Profile", icon: <FaUser /> },
    { id: "wallet", label: "Wallet", icon: <FaCreditCard /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection editing={editing} setEditing={setEditing} />;
      case "wallet":
        return <WalletTab />;
      case "notifications":
        return <NotificationsSection />;
      default:
        return <ProfileSection editing={editing} setEditing={setEditing} />;
    }
  };

  return (
    <SellerWrapper>
      <div className="relative w-full min-h-screen">
        <div className="flex">
          <div className="w-16 md:w-64 flex-shrink-0 ">
            <div className="p-3 md:p-4 flex flex-col gap-1 items-center border-b">
              {isLoading || isFetching ? (
                <>
                  <Skeleton variant="circular" width={80} height={80} />
                  <Skeleton variant="text" width={120} height={24} />
                  <Skeleton
                    variant="text"
                    width={150}
                    height={20}
                    className="hidden md:block"
                  />
                </>
              ) : (
                <>
                  <EditAvatar userImg={provider?.avatar} />
                  <FootTypo
                    footlabel={provider?.businessName || "User Name"}
                    fontWeight="bold"
                  />
                  <FootTypo
                    footlabel={user?.email || "user@example.com"}
                    className="hidden md:block text-center"
                  />
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="py-4">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-center md:justify-start p-3 md:px-4 
                    ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="ml-3 hidden md:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Page Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="h5"
                  className="font-bold text-gray-900 dark:text-white"
                >
                  {tabOptions.find((tab) => tab.id === activeTab)?.label}
                </Typography>

                {activeTab === "profile" &&
                  !editing &&
                  !isLoading &&
                  !isFetching && (
                    <Button
                      label="Edit Profile"
                      icon={<FaUserEdit />}
                      className="bg-action text-white"
                      onClick={() => setEditing(true)}
                    />
                  )}
              </Box>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </SellerWrapper>
  );
};

const ProfileSection = ({ editing, setEditing }) => {
  const { user } = useUser();
  const {
    data: provider,
    isFetching,
    isLoading,
  } = useGetProviderBySlug(user?.slug);

  const { mutate: updateProviderProfile, isPending: isUpdating } =
    useUpdateProviderProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  // Update form values when provider data is loaded
  useEffect(() => {
    if (provider) {
      reset({
        name: provider.businessName || "",
        email: user?.email || "",
        phone: provider.phone || "",
        address: provider.address || "",
        bio: provider.bio || "",
      });
    }
  }, [provider, user, reset]);

  const onSubmit = async (data) => {
    updateProviderProfile({
      name: data.name,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
    });
    setEditing(false);
  };

  return (
    <div className="rounded-lg shadow-sm overflow-hidden">
      {editing && (
        <Box
          display="flex"
          justifyContent="space-between"
          p={2}
          alignItems="center"
        >
          <Typography variant="body2">Edit your profile information</Typography>
          <Box display="flex" gap={2}>
            <Button
              label="Cancel"
              btnClass="secondary"
              onClick={() => {
                setEditing(false);
                reset();
              }}
            />
            <Button
              label="Save Changes"
              onClick={handleSubmit(onSubmit)}
              className="bg-action text-white"
              icon={<FaSave />}
              disabled={isUpdating}
            />
          </Box>
        </Box>
      )}

      <div className="pt-6">
        <Grid container spacing={2}>
          {isLoading || isFetching ? (
            // Skeleton loading state
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="40%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="30%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="25%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="35%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="20%" />
                </Typography>
                <Skeleton variant="rectangular" height={120} />
              </Grid>
            </>
          ) : editing ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email")}
                  disabled
                  value={user?.email || ""}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Address"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <Label htmlFor="bio">Bio</Label>
                <TipTapEditor
                  id="bio"
                  onChange={(html) => setValue("bio", html)}
                  content={provider?.bio || ""}
                  placeholder="Tell us about your experience and expertise..."
                  register={register}
                  required
                  errors={errors}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem
                  label="Full Name"
                  value={provider?.businessName || "Not set"}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem label="Email" value={user?.email || "Not set"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem label="Phone" value={provider?.phone || "Not set"} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem
                  label="Address"
                  value={provider?.address || "Not set"}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <InfoItem
                  label="Bio"
                  value={provider?.bio || "No bio available"}
                  dangerousHtml={true}
                />
              </Grid>
            </>
          )}
        </Grid>
      </div>

      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "primary.main",
          },
          marginY: "20px",
        }}
      ></Divider>

      <Typography variant="h6" fontWeight="bold" mb={2}>
        Professional Information
      </Typography>
      <Grid container spacing={2}>
        {isLoading || isFetching ? (
          // Skeleton loading for professional info
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" className="mb-1">
                <Skeleton width="40%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" className="mb-1">
                <Skeleton width="50%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" className="mb-1">
                <Skeleton width="45%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" className="mb-1">
                <Skeleton width="35%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Grid>
          </>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem
                label="Skill"
                value={provider?.skillName || "Not set"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem
                label="Years of Experience"
                value={
                  `${provider?.yearsOfExperience} years` || "Not specified"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem
                label="Past Work Places"
                value={provider?.pastWorkPlaces || "Not specified"}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

const NotificationsSection = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <Typography>Notification preferences coming soon</Typography>
    </div>
  );
};

const InfoItem = ({ label, value, dangerousHtml = false }) => {
  const getIcon = () => {
    switch (label) {
      case "Full Name":
        return <FaUser />;
      case "Email":
        return <FaEnvelope />;
      case "Phone":
        return <FaPhone />;
      case "Address":
        return <FaMapMarkerAlt />;
      case "Bio":
        return <FaInfoCircle />;
      case "Skill":
        return <FaTools />;
      case "Years of Experience":
        return <FaBusinessTime />;
      case "Past Work Places":
        return <FaBriefcase />;
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="start" mb={2}>
      <Typography
        component="div"
        variant="body2"
        mb={1}
        className="text-gray-500 dark:text-gray-400 flex items-center gap-2"
      >
        {getIcon()}
        {label}
      </Typography>

      <Typography variant="body1" component="div">
        {dangerousHtml ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          value
        )}
      </Typography>
    </Box>
  );
};

export default SellerAccount;

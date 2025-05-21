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
} from "react-icons/fa";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { Typography, Divider, Box, TextField, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "@/app/components/ui/Inputs/Input";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import { Label } from "@/app/components/ui/Inputs/Label";
import { useGetProviderBySlug } from "@/app/queries/user/provider.query";

const SellerAccount = () => {
  const { user } = useUser();
  const {
    data: provider,
    isFetching,
    isLoading,
  } = useGetProviderBySlug(user?.slug);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  const tabOptions = [
    { id: "profile", label: "My Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "wallet", label: "Wallet", icon: <FaCreditCard /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "store", label: "Store Settings", icon: <FaStore /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection editing={editing} setEditing={setEditing} />;
      case "security":
        return <SecuritySection />;
      case "wallet":
        return <WalletSection />;
      case "notifications":
        return <NotificationsSection />;
      case "store":
        return <StoreSection />;
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
              <div className="flex justify-between items-center mb-6">
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
              </div>

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (data) => {
    // Here you would call an API to update the profile
    console.log("Form data to submit:", data);
    setEditing(false);
  };

  return (
    <div className="rounded-lg shadow-sm overflow-hidden">
      {editing && (
        <div className="p-4 flex justify-between">
          <Typography variant="body2">Edit your profile information</Typography>
          <div className="flex space-x-2">
            <Button
              label="Cancel"
              btnClass="secondary"
              onClick={() => {
                setEditing(false);
              }}
            />
            <Button
              label="Save Changes"
              onClick={handleSubmit(onSubmit)}
              className="bg-action text-white"
              icon={<FaSave />}
            />
          </div>
        </div>
      )}

      <div className="pt-6">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading || isFetching ? (
            // Skeleton loading state
            <>
              <Box className="col-span-1">
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="40%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Box>
              <Box className="col-span-1">
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="30%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Box>
              <Box className="col-span-1">
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="25%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Box>
              <Box className="col-span-1">
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="35%" />
                </Typography>
                <Skeleton variant="rectangular" height={40} />
              </Box>
              <Box className="col-span-1 md:col-span-2">
                <Typography variant="body2" className="mb-1">
                  <Skeleton width="20%" />
                </Typography>
                <Skeleton variant="rectangular" height={120} />
              </Box>
            </>
          ) : editing ? (
            <>
              <Box className="col-span-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  register={register}
                  required
                  errors={errors}
                  className="pl-3"
                />
              </Box>
              <Box className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  register={register}
                  required
                  errors={errors}
                  className="pl-3"
                  disabled
                />
              </Box>
              <Box className="col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  register={register}
                  required
                  errors={errors}
                  className="pl-3"
                />
              </Box>
              <Box className="col-span-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  register={register}
                  required
                  errors={errors}
                  className="pl-3"
                />
              </Box>
              <Box className="col-span-1 md:col-span-2">
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
              </Box>
            </>
          ) : (
            <>
              <Box className="col-span-1">
                <InfoItem
                  label="Full Name"
                  value={provider?.businessName || "Not set"}
                />
              </Box>
              <Box className="col-span-1">
                <InfoItem label="Email" value={user?.email || "Not set"} />
              </Box>
              <Box className="col-span-1">
                <InfoItem label="Phone" value={provider?.phone || "Not set"} />
              </Box>
              <Box className="col-span-1">
                <InfoItem
                  label="Address"
                  value={provider?.address || "Not set"}
                />
              </Box>
              <Box className="col-span-1 md:col-span-2">
                <InfoItem
                  label="Bio"
                  value={provider?.bio || "No bio available"}
                  dangerousHtml={true}
                />
              </Box>
            </>
          )}
        </Box>
      </div>

      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "primary.main",
          },
          marginY: "20px",
        }}
      ></Divider>

      <Typography
        variant="h6"
        className="font-semibold text-gray-900 dark:text-white mb-4"
      >
        Professional Information
      </Typography>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading || isFetching ? (
          // Skeleton loading for professional info
          <>
            <Box className="col-span-1">
              <Typography variant="body2" className="mb-1">
                <Skeleton width="40%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Box>
            <Box className="col-span-1">
              <Typography variant="body2" className="mb-1">
                <Skeleton width="50%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Box>
            <Box className="col-span-1">
              <Typography variant="body2" className="mb-1">
                <Skeleton width="45%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Box>
            <Box className="col-span-1">
              <Typography variant="body2" className="mb-1">
                <Skeleton width="35%" />
              </Typography>
              <Skeleton variant="text" height={24} />
            </Box>
          </>
        ) : (
          <>
            <Box className="col-span-1">
              <InfoItem
                label="Skill"
                value={provider?.skillName || "Not set"}
              />
            </Box>
            <Box className="col-span-1">
              <InfoItem
                label="Decoration Style"
                value={provider?.decorationStyle || "Not set"}
              />
            </Box>
            <Box className="col-span-1">
              <InfoItem
                label="Years of Experience"
                value={provider?.yearsOfExperience || "Not specified"}
              />
            </Box>
            <Box className="col-span-1">
              <InfoItem
                label="Past Work Places"
                value={provider?.pastWorkPlaces || "Not specified"}
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

// Placeholder for other sections - would implement similar to ProfileSection
const SecuritySection = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <Typography>Security settings coming soon</Typography>
    </div>
  );
};

const WalletSection = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <Typography>Wallet settings coming soon</Typography>
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

const StoreSection = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      <Typography>Store settings coming soon</Typography>
    </div>
  );
};

const InfoItem = ({ label, value, dangerousHtml = false }) => {
  return (
    <div className="mb-4">
      <Typography
        variant="body2"
        className="text-gray-500 dark:text-gray-400 mb-1"
      >
        {label}
      </Typography>
      <Typography variant="body1" className="text-gray-900 dark:text-white">
        {dangerousHtml ? (
          <span dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          value
        )}
      </Typography>
    </div>
  );
};

export default SellerAccount;

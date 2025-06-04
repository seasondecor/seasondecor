"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetListDecorService } from "@/app/queries/list/service.list.query";
import { useGetDecorServiceById } from "@/app/queries/service/service.query";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdLocationOn,
  MdCategory,
} from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { useAddFavoriteDecorService } from "@/app/queries/favorite/favorit.query";
import { useUser } from "@/app/providers/userprovider";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import { useQueryClient } from "@tanstack/react-query";
import { generateSlug, getSeasonConfig } from "@/app/helpers";
import ReviewSection from "@/app/components/ui/review/ReviewSection";
import OverallRating from "@/app/components/ui/review/OverallRating";
import ReviewCard from "@/app/components/ui/card/ReviewCard";
import Link from "next/link";
import HostSection from "@/app/(pages)/booking/components/HostSection";
import { Skeleton, Box, Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import useInfoModal from "@/app/hooks/useInfoModal";
import PickDate from "@/app/(pages)/booking/components/PickDate";
import { useBookService } from "@/app/queries/book/book.query";
import { useForm } from "react-hook-form";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import { useGetAllAddress } from "@/app/queries/user/address.query";
import { useRouter } from "next/navigation";
import { seasons } from "@/app/constant/season";
import { FcFolder } from "react-icons/fc";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { toast } from "sonner";
import ResultModal from "@/app/components/ui/Modals/ResultModal";
import { CiClock1 } from "react-icons/ci";
import { useGetListReviewByService } from "@/app/queries/list/review.list.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { RiErrorWarningFill } from "react-icons/ri";
import { Divider } from "@mui/material";
import AmenityOfferings from "@/app/(pages)/booking/components/AmenityOffering";
import ThemePalette from "@/app/components/ui/themePalette/ThemePalatte";
import DesignStyle from "@/app/components/ui/designStyle/DesignStyle";
import CustomizeModal from "@/app/(pages)/booking/components/CustomizeModal";

// Service Detail Skeleton Component
const ServiceDetailSkeleton = () => {
  return (
    <Container>
      <Box className="w-full">
        {/* Breadcrumbs skeleton */}
        <Skeleton variant="text" width={300} height={20} className="mb-6" />

        {/* Title skeleton */}
        <Skeleton variant="text" width={300} height={40} className="mb-4" />

        {/* Image Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
            <Skeleton
              variant="rectangular"
              height="100%"
              animation="wave"
              className="rounded-lg"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative h-[244px] overflow-hidden rounded-lg"
              >
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  animation="wave"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
          {/* Mobile skeleton images */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative h-[120px] overflow-hidden rounded-lg"
              >
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  animation="wave"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton
                variant="rectangular"
                width={100}
                height={28}
                className="rounded-md"
              />
            </div>

            {/* Seasons */}
            <div className="flex flex-wrap gap-2 items-center">
              <Skeleton variant="text" width={80} height={20} />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={80}
                    height={28}
                    className="rounded-xl"
                  />
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={200} height={20} />
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="90%" height={40} />
            </div>

            {/* Favorites */}
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton variant="text" width={120} height={25} />
              <Skeleton
                variant="rectangular"
                height={100}
                className="rounded-lg"
              />
              <Skeleton variant="text" width={80} height={20} />
            </div>

            {/* Notes textarea */}
            <div className="space-y-2">
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton
                variant="rectangular"
                height={150}
                className="rounded-lg"
              />
            </div>

            {/* Buttons */}
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton
                  variant="rectangular"
                  width={150}
                  height={45}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  width={150}
                  height={45}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Address selection */}
            <div>
              <Skeleton
                variant="text"
                width={150}
                height={25}
                className="mb-2"
              />
              <Skeleton
                variant="rectangular"
                height={56}
                className="rounded-lg w-full"
              />
            </div>

            {/* Date picker */}
            <div>
              <Skeleton
                variant="text"
                width={250}
                height={25}
                className="mb-2"
              />
              <Skeleton
                variant="rectangular"
                height={300}
                className="rounded-lg w-full"
              />
              <Skeleton
                variant="text"
                width={200}
                height={20}
                className="mx-auto mt-4"
              />
            </div>

            {/* Report link */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <Skeleton variant="circular" width={14} height={14} />
              <Skeleton variant="text" width={120} height={15} />
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-16 border-t pt-8 relative">
          {/* Title */}
          <div className="relative flex justify-center">
            <Skeleton
              variant="rectangular"
              width={280}
              height={40}
              className="rounded-xl absolute top-[-25px]"
            />
          </div>

          {/* Rating overview */}
          <div className="my-8 pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="text-center">
                <Skeleton
                  variant="circular"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                  className="mx-auto mt-2"
                />
              </div>
              <div className="flex flex-col gap-2 w-full max-w-md">
                {[5, 4, 3, 2, 1].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton variant="text" width={20} height={20} />
                    <Skeleton
                      variant="rectangular"
                      height={16}
                      width="70%"
                      className="rounded-full"
                    />
                    <Skeleton variant="text" width={30} height={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review form placeholder */}
          <div className="my-10">
            <Skeleton
              variant="rectangular"
              height={150}
              className="rounded-lg w-full"
            />
          </div>

          {/* Individual Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={16} />
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton
                      key={j}
                      variant="circular"
                      width={16}
                      height={16}
                    />
                  ))}
                </div>
                <Skeleton variant="text" width="100%" height={60} />
                <div className="flex gap-2">
                  {[1, 2].map((j) => (
                    <Skeleton
                      key={j}
                      variant="rectangular"
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Host Section */}
          <div className="mt-10 border-t pt-6">
            <Skeleton variant="text" width={200} height={25} className="mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={80} height={80} />
              <div className="space-y-2">
                <Skeleton variant="text" width={150} height={25} />
                <Skeleton variant="text" width={200} height={20} />
                <Skeleton variant="text" width={120} height={20} />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Container>
  );
};

const ServiceDetail = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [serviceId, setServiceId] = React.useState(null);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const infoModal = useInfoModal();
  const { mutate: bookService, isPending: isBookingPending } = useBookService();
  const [selectedBookingData, setSelectedBookingData] = React.useState(null);
  const { data: addressData, isLoading: addressLoading } = useGetAllAddress();
  const [customizationData, setCustomizationData] = React.useState({
    selectedDesign: null,
    selectedColors: [],
    propertyType: "",
    estimatedBudget: "",
    imageCount: 0,
    lastUpdated: "",
    primaryUser: "",
    selectedDesignName: "",
    serviceId: null,
    spaceArea: "",
    workScopes: [],
  });

  const [resultModalOpen, setResultModalOpen] = React.useState(false);
  const [resultModalData, setResultModalData] = React.useState({
    title: "",
    message: "",
    type: "success",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPrivacyChecked, setIsPrivacyChecked] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const { data: serviceDetail, isLoading: isServiceLoading } =
    useGetDecorServiceById(serviceId);
  const { data: favorites, isLoading: isLoadingFavorites } =
    useGetListFavorite();

  const { data: review, isLoading: isReviewsLoading } =
    useGetListReviewByService(serviceId, {
      enabled: !!serviceId,
    });

  const reviewData = review?.data || [];

  const { mutate: addFavoriteDecorService, isPending: isAddingFavorite } =
    useAddFavoriteDecorService();

  // Use pagination to prevent loading all services at once
  const { data: listDecorService, isLoading: isListLoading } =
    useGetListDecorService({
      pageIndex: 1,
      pageSize: 10,
      forcePagination: true,
    });

  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);

  useEffect(() => {
    setSelectedAddress(null);
    reset();

    if (listDecorService?.data) {
      const matchedService = listDecorService.data.find(
        (p) => generateSlug(p.style) === slug
      );
      if (matchedService) {
        setServiceId(matchedService.id);
      } else {
        // If not found in first page, fetch the service by slug directly
        // This should be implemented in a real API endpoint
        console.log("Service not found in first page");
      }
    }
  }, [listDecorService, slug]);

  // Check if the current user is the service provider
  const isServiceProvider = React.useMemo(() => {
    if (!user || !serviceDetail) return false;
    return user.id === serviceDetail.accountId;
  }, [user, serviceDetail]);

  // Check if the service is already in favorites
  const isInFavorites = React.useMemo(() => {
    if (!favorites || !serviceId) return false;
    return favorites.some((fav) => fav.decorServiceDetails.id === serviceId);
  }, [favorites, serviceId]);

  const handleAddToFavorites = () => {
    if (isInFavorites) return;

    addFavoriteDecorService(serviceId, {
      onSuccess: () => {
        // console.log("Added to favorite");
        queryClient.invalidateQueries({ queryKey: ["get_list_favorite"] });
      },
      onError: (error) => {
        console.log("Error adding to favorite:", error);
      },
    });
  };

  const formatAddress = (address) => {
    if (!address) return "No address available";

    const parts = [];
    // if (address.detail) parts.push(address.detail);
    if (address.street) parts.push(address.street);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.province) parts.push(address.province);

    return parts.join(", ");
  };

  const addressOptions =
    addressData?.map((address) => ({
      value: address.id,
      label: formatAddress(address),
      isDefault: address.isDefault,
    })) || [];

  const handleAddressChange = (selected) => {
    //console.log("Address selection changed:", selected);
    if (selected) {
      setSelectedAddress(selected);
      setValue("addressId", selected.value);
      //console.log("Selected Address ID:", selected.value);
    }
  };

  const onSubmit = (data) => {
    if (!selectedAddress || !selectedBookingData) {
      alert("Please select both an address and a date before booking");
      return;
    }
    setCustomizeModalOpen(true);
  };

  const handleDirectBooking = () => {
    // Skip customization and book directly
    const formData = new FormData();

    formData.append("DecorServiceId", serviceDetail.id);
    formData.append("AddressId", selectedAddress.value);
    formData.append("SurveyDate", selectedBookingData.date);

    bookService(formData, {
      onSuccess: () => {
        //console.log("Booking successful");
        setResultModalData({
          title: "Booking successful",
          message: `Your survey is scheduled for ${selectedBookingData.formattedDate}`,
          type: "success",
        });
        setResultModalOpen(true);
        queryClient.invalidateQueries({
          queryKey: ["get_decor_service_by_id"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.error("Error booking service:", error);
      },
    });

    setCustomizeModalOpen(false);
  };

  const handleCustomizedBooking = (customData) => {
    // Book with additional customization data
    const formData = new FormData();

    formData.append("DecorServiceId", serviceDetail.id);
    formData.append("AddressId", selectedAddress.value);
    formData.append("SurveyDate", selectedBookingData.date);
    formData.append("Note", customData.note || watch("note") || "");

    // Handle arrays
    if (customData.selectedColors && customData.selectedColors.length > 0) {
      customData.selectedColors.forEach((colorId) => {
        formData.append("ThemeColorIds", colorId);
      });
    }

    if (customData.propertyType)
      formData.append("SpaceStyle", customData.propertyType);
    if (customData.estimatedBudget)
      formData.append("EstimatedBudget", customData.estimatedBudget);
    if (customData.spaceArea) formData.append("RoomSize", customData.spaceArea);
    if (customData.selectedDesign)
      formData.append("DecorationStyleId", customData.selectedDesign);
    if (customData.primaryUser)
      formData.append("PrimaryUser", customData.primaryUser);

    // Handle scope of work array
    if (customData.workScopes && customData.workScopes.length > 0) {
      customData.workScopes.forEach((scope) => {
        formData.append("ScopeOfWorkId", scope.id);
      });
    }

    // Handle images
    if (customData.images && customData.images.length > 0) {
      customData.images.forEach((image, index) => {
        formData.append(`Images`, image);
      });
    }

    //console.log("Customized booking data being sent as FormData");

    bookService(formData, {
      onSuccess: () => {
        setResultModalData({
          title: "Booking successful",
          message: `Booking successful! Your survey is scheduled for ${selectedBookingData.formattedDate}`,
          type: "success",
        });
        setResultModalOpen(true);
        queryClient.invalidateQueries({
          queryKey: ["get_decor_service_by_id"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.error("Error booking service:", error);
      },
    });

    setCustomizeModalOpen(false);
  };

  // Show skeleton loading when data is loading
  const isLoading = isServiceLoading || (!serviceDetail && isListLoading);

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  if (!serviceDetail) {
    return <ServiceDetailSkeleton />;
  }

  return (
    <Container>
      <MuiBreadcrumbs />
      <div
        className={`mx-auto w-full min-w-0 md:px-0 mt-10 relative ${
          isServiceProvider ? "pointer-events-none" : ""
        }`}
      >
        {isServiceProvider && (
          <div className="absolute inset-[-20] bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 rounded-lg">
            <div className="flex flex-col items-center justify-center h-full">
              <BodyTypo
                bodylabel="You are the provider of this service"
                fontWeight="bold"
              />
            </div>
          </div>
        )}
        {/* Service Name */}
        <div className="mb-6">
          <BodyTypo
            bodylabel={serviceDetail.style || "Service Not Found"}
            fontWeight="bold"
          />
        </div>

        {/* Image Gallery - Airbnb Style */}
        {serviceDetail.images?.length > 0 ? (
          <Box className="relative mb-10 cursor-pointer">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                  <Image
                    src={serviceDetail.images[0]?.imageURL}
                    alt="Primary image"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    unoptimized
                  />
                </Box>
              </Grid>

              {/* Desktop Grid */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Grid container spacing={1}>
                  {serviceDetail.images.slice(1, 5).map((img, index) => (
                    <Grid item size={6} key={index}>
                      <Box className="relative h-[244px] overflow-hidden rounded-lg">
                        <Image
                          src={img.imageURL}
                          alt={`Room image ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                          sizes="25vw"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Mobile Grid */}
              <Grid size={12} sx={{ display: { xs: "block", md: "none" } }}>
                <Grid container spacing={1}>
                  {serviceDetail.images.slice(1, 4).map((img, index) => (
                    <Grid size={4} key={index}>
                      <Box className="relative h-[120px] overflow-hidden rounded-lg">
                        <Image
                          src={img.imageURL}
                          alt={`Room image ${index + 2}`}
                          fill
                          className="object-cover"
                          sizes="33vw"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <FootTypo footlabel="No images available" fontWeight="bold" />
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Box className="space-y-6">
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
                >
                  <MdCategory size={20} />
                  <FootTypo footlabel="This service is suitable for" />
                </Box>

                <div className="bg-gray-800 text-white px-3 rounded-lg py-1">
                  <FootTypo
                    footlabel={serviceDetail.categoryName || "Uncategorized"}
                    fontWeight="bold"
                  />
                </div>
              </Box>

              <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                <FootTypo footlabel="Suitable for:" />
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {serviceDetail.seasons && serviceDetail.seasons.length > 0 ? (
                    serviceDetail.seasons.map((season, index) => {
                      const { icon, bgColor } = getSeasonConfig(
                        season.seasonName,
                        seasons
                      );
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                        >
                          {icon}
                          {season.seasonName}
                        </div>
                      );
                    })
                  ) : (
                    <FootTypo footlabel="All seasons" fontWeight="bold" />
                  )}
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MdLocationOn size={20} />
                <span className="inline-flex items-center gap-2">
                  Fast support in
                  <FootTypo
                    footlabel={
                      serviceDetail.sublocation || "Location not specified"
                    }
                    fontWeight="bold"
                  />
                </span>
              </Box>

              <Box display="flex" alignItems="start" gap={1}>
                <RiErrorWarningFill
                  size={20}
                  className="text-warning mt-0.5 flex-shrink-0"
                />
                <div>
                  <FootTypo
                    footlabel="For customers located farther, we are still committed to
                    delivering quality service, but please note that response
                    times may be slightly longer due to travel or logistical
                    constraints."
                    fontWeight="bold"
                  />
                </div>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MdFavorite size={20} />
                <FootTypo footlabel="People liked : " />
                <FootTypo
                  footlabel={serviceDetail.favoriteCount || "No favorite yet"}
                  fontWeight="bold"
                />
              </Box>
              <div className="space-y-6">
                <div>
                  <FootTypo footlabel="Description" fontWeight="bold" />
                  <div className="mt-3 rounded-lg">
                    <div className="relative">
                      <div
                        className="whitespace-pre-line max-h-[300px] overflow-hidden relative"
                        dangerouslySetInnerHTML={{
                          __html: serviceDetail.description || "",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 z-30 h-80 bg-gradient-to-t from-white to-transparent dark:from-black opacity-90 rounded-br-2xl"></div>
                    </div>

                    <button
                      className="text-primary font-semibold underline"
                      onClick={() =>
                        infoModal.onOpen({
                          title: `${serviceDetail.style}`,
                          description:
                            serviceDetail.description ||
                            "No description available",
                          buttonLabel: "Done",
                          isDescription: true,
                        })
                      }
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </div>
              <section className="mt-16 relative">
                <Divider
                  sx={{
                    "&::before, &::after": {
                      borderColor: "primary.main",
                    },
                  }}
                />
                <section className="py-10">
                  <BodyTypo
                    bodylabel="Design Styles"
                    fontWeight="bold"
                    className="pb-6"
                  />
                  {serviceDetail.designs && serviceDetail.designs.length > 0 ? (
                    <DesignStyle
                      styles={serviceDetail.designs}
                      className="mt-2"
                    />
                  ) : (
                    <div className="py-2 text-gray-500">
                      No design styles specified
                    </div>
                  )}
                </section>
              </section>
              {/* What this service offers */}
              <section className="mt-16 relative">
                <Divider
                  sx={{
                    "&::before, &::after": {
                      borderColor: "primary.main",
                    },
                  }}
                />
                <section className="py-10">
                  <AmenityOfferings
                    offerings={serviceDetail.offerings}
                    title="What this service offers"
                  />
                </section>
              </section>
              {/* Theme Palette */}
              <section className="mt-16 relative">
                <Divider
                  sx={{
                    "&::before, &::after": {
                      borderColor: "primary.main",
                    },
                  }}
                />
                <section className="py-10">
                  {serviceDetail.themeColors &&
                    serviceDetail.themeColors.length > 0 && (
                      <ThemePalette
                        colors={serviceDetail.themeColors}
                        title="Design Color Palette"
                      />
                    )}
                </section>
              </section>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            <Box position="sticky" top={100}>
              <div className="space-y-5 my-5 w-full">
                {serviceDetail.isBooked ? (
                  <BorderBox className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 rounded-lg mb-4">
                      <FcFolder size={20} />
                      <FootTypo
                        footlabel="You have a pending booking for this service"
                        className="font-semibold"
                      />
                    </div>
                    <Link
                      href="/booking/request"
                      className="font-semibold underline"
                    >
                      View my booking
                    </Link>
                  </BorderBox>
                ) : (
                  <>
                    <FootTypo
                      footlabel="Where to survey"
                      className="font-bold text-lg"
                    />
                    {addressLoading ? (
                      <Skeleton height={56} animation="wave" />
                    ) : addressOptions.length > 0 ? (
                      <DropdownSelectReturnObj
                        options={addressOptions}
                        value={selectedAddress}
                        onChange={handleAddressChange}
                        labelKey="label"
                        valueKey="value"
                        returnObject={true}
                        lisboxClassName="mt-11"
                        placeholder="Select a shipping address"
                        isDisabled={serviceDetail.isBooked}
                      />
                    ) : (
                      <button
                        onClick={() => router.push("/user/account/address")}
                        className="py-2 text-gray-500 bg-primary text-white rounded-md px-4"
                        disabled={serviceDetail.isBooked}
                      >
                        Add new address
                      </button>
                    )}
                  </>
                )}
              </div>
              {!serviceDetail.isBooked && (
                <PickDate
                  title="Pick your desired date to survey"
                  description=""
                  footerLabel="Please select a date for your survey"
                  availableDates={serviceDetail.availableDates || []}
                  onDateSelect={(dateData) => {
                    //console.log("Selected date data:", dateData);
                    setSelectedBookingData(dateData);
                  }}
                />
              )}
              <div className="pt-6">
                {!serviceDetail.isBooked ? (
                  <Alert severity="info" className="mb-4">
                    Notice that before proceeding to book, you are welcome to
                    customize your booking preferences by filling out the form
                  </Alert>
                ) : (
                  <Alert severity="success" className="mb-4">
                    Your request has been sent to the provider and you will be
                    notified once the provider confirms the booking
                  </Alert>
                )}
                {!isServiceProvider ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      label={
                        serviceDetail.isBooked
                          ? "Waiting for confirmation"
                          : "Book now"
                      }
                      className={`${
                        serviceDetail.isBooked ? "bg-yellow" : "bg-primary"
                      }`}
                      icon={
                        serviceDetail.isBooked ? (
                          <CiClock1 size={20} />
                        ) : (
                          <IoCallOutline size={20} />
                        )
                      }
                      isLoading={isBookingPending}
                      disabled={
                        serviceDetail.isBooked ||
                        !selectedAddress ||
                        !selectedBookingData ||
                        (customizationData.isFilled && !isPrivacyChecked)
                      }
                      onClick={handleSubmit(onSubmit)}
                    />
                    <Button
                      label={
                        isInFavorites ? "In your wishlist" : "Add to Wishlist"
                      }
                      className={isInFavorites ? "bg-rose-600" : "bg-rose-500"}
                      icon={
                        isInFavorites ? (
                          <MdFavorite size={20} />
                        ) : (
                          <MdFavoriteBorder size={20} />
                        )
                      }
                      onClick={handleAddToFavorites}
                      disabled={isInFavorites || isAddingFavorite}
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-lg text-center">
                    <p className="text-gray-500 italic">
                      You are the provider of this service
                    </p>
                  </div>
                )}
              </div>
            </Box>
          </Grid>
        </Grid>

        {/* Ratings and Reviews Section */}
        <section className="mt-8 relative">
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "primary.main",
              },
            }}
          />
          <section className="py-10">
            <BodyTypo
              bodylabel="Ratings, reviews, and reliability"
              className="pb-6"
            />
            {/* Ratings Overview */}
            {isReviewsLoading ? (
              <Box className="w-full my-6 pb-6 text-sm border-b border-gray-200 dark:border-gray-700">
                <Skeleton
                  variant="rectangular"
                  height={180}
                  className="rounded-lg"
                />
              </Box>
            ) : (
              <OverallRating
                overallRating={review?.averageRate || 0}
                rateCount={
                  review?.rateCount || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
                totalReviews={review?.totalCount || 0}
              />
            )}
          </section>
        </section>

        {/* Full ReviewSection with form (can be kept or removed) */}
        <div className="mt-10">
          <ReviewSection
            averageRating={review?.averageRate || 0}
            totalReviews={review?.totalCount || 0}
          />
        </div>

        {/* Individual Reviews */}
        <Grid container spacing={3}>
          {isReviewsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box className="mb-6">
                    <Box className="flex items-center gap-3 mb-3">
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width={100} className="mb-2" />
                    <Skeleton
                      variant="rectangular"
                      height={80}
                      className="rounded-lg"
                    />
                  </Box>
                </Grid>
              ))}
            </>
          ) : (
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={3}>
                <DataMapper
                  data={reviewData}
                  Component={ReviewCard}
                  useGrid={false}
                  emptyStateComponent={<EmptyState title="No reviews yet" />}
                  getKey={(review) => review.id}
                  componentProps={(review) => ({
                    id: review.id,
                    comment: review.comment,
                    rate: review.rate,
                    createAt: review.createAt,
                    images: review.images?.map((img) => img) || [],
                    username: review.name || "User",
                    userAvatar: review.avatar || "",
                  })}
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Box mt={5}>
          <HostSection
            avatar={serviceDetail.provider.avatar}
            name={serviceDetail.provider.businessName}
            joinDate={serviceDetail.provider.joinedDate}
            followers={serviceDetail.provider.followersCount}
          />
        </Box>
      </div>

      {/* Add ResultModal component */}
      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={resultModalData.title}
        message={resultModalData.message}
        type={resultModalData.type}
      />

      {/* Add CustomizeModal component */}
      <CustomizeModal
        open={customizeModalOpen}
        onClose={() => setCustomizeModalOpen(false)}
        onSubmit={handleCustomizedBooking}
        onSkip={handleDirectBooking}
        serviceDetail={serviceDetail}
      />
    </Container>
  );
};

export default ServiceDetail;

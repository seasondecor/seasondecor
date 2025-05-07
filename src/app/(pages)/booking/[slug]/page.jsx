"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { FootTypo } from "@/app/components/ui/Typography";
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
import { FaFlag } from "react-icons/fa";
import Link from "next/link";
import HostSection from "@/app/(pages)/booking/components/HostSection";
import { Skeleton, Box } from "@mui/material";
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
import { Label } from "@/app/components/ui/Inputs/Label";
import { Field, Textarea } from "@headlessui/react";
import { CiClock1 } from "react-icons/ci";
import Spinner from "@/app/components/Spinner";
import { useGetListReviewByService } from "@/app/queries/list/review.list.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { RiErrorWarningFill } from "react-icons/ri";

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
            <Skeleton variant="rectangular" height="100%" animation="wave" className="rounded-lg" />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-[244px] overflow-hidden rounded-lg">
                <Skeleton variant="rectangular" height="100%" animation="wave" className="rounded-lg" />
              </div>
            ))}
          </div>
          {/* Mobile skeleton images */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative h-[120px] overflow-hidden rounded-lg">
                <Skeleton variant="rectangular" height="100%" animation="wave" className="rounded-lg" />
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
              <Skeleton variant="rectangular" width={100} height={28} className="rounded-md" />
            </div>

            {/* Seasons */}
            <div className="flex flex-wrap gap-2 items-center">
              <Skeleton variant="text" width={80} height={20} />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={80} height={28} className="rounded-xl" />
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
              <Skeleton variant="rectangular" height={100} className="rounded-lg" />
              <Skeleton variant="text" width={80} height={20} />
            </div>

            {/* Notes textarea */}
            <div className="space-y-2">
              <Skeleton variant="text" width={200} height={20} />
              <Skeleton variant="rectangular" height={150} className="rounded-lg" />
            </div>

            {/* Buttons */}
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton variant="rectangular" width={150} height={45} className="rounded-lg" />
                <Skeleton variant="rectangular" width={150} height={45} className="rounded-lg" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Address selection */}
            <div>
              <Skeleton variant="text" width={150} height={25} className="mb-2" />
              <Skeleton variant="rectangular" height={56} className="rounded-lg w-full" />
            </div>

            {/* Date picker */}
            <div>
              <Skeleton variant="text" width={250} height={25} className="mb-2" />
              <Skeleton variant="rectangular" height={300} className="rounded-lg w-full" />
              <Skeleton variant="text" width={200} height={20} className="mx-auto mt-4" />
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
            <Skeleton variant="rectangular" width={280} height={40} className="rounded-xl absolute top-[-25px]" />
          </div>

          {/* Rating overview */}
          <div className="my-8 pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="text-center">
                <Skeleton variant="circular" width={120} height={120} className="mx-auto" />
                <Skeleton variant="text" width={100} height={24} className="mx-auto mt-2" />
              </div>
              <div className="flex flex-col gap-2 w-full max-w-md">
                {[5, 4, 3, 2, 1].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton variant="text" width={20} height={20} />
                    <Skeleton variant="rectangular" height={16} width="70%" className="rounded-full" />
                    <Skeleton variant="text" width={30} height={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review form placeholder */}
          <div className="my-10">
            <Skeleton variant="rectangular" height={150} className="rounded-lg w-full" />
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
                    <Skeleton key={j} variant="circular" width={16} height={16} />
                  ))}
                </div>
                <Skeleton variant="text" width="100%" height={60} />
                <div className="flex gap-2">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} variant="rectangular" width={60} height={60} className="rounded-lg" />
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
  const pagination = {
    pageIndex: 1,
    pageSize: 10,
  };
  const router = useRouter();
  const { slug } = useParams();
  const [serviceId, setServiceId] = React.useState(null);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const infoModal = useInfoModal();
  const { mutate: bookService, isPending: isBookingPending } = useBookService();
  const [selectedBookingData, setSelectedBookingData] = React.useState(null);
  const { data: addressData, isLoading: addressLoading } = useGetAllAddress();
  //const { data: bookings, isLoading: isBookingsLoading } =
  //  useGetPaginatedBookingsForCustomer(pagination);

  const [resultModalOpen, setResultModalOpen] = React.useState(false);
  const [resultModalData, setResultModalData] = React.useState({
    title: "",
    message: "",
    type: "success",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      note: "",
    },
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

  const { mutate: addFavoriteDecorService, isPending } =
    useAddFavoriteDecorService();

  // Use pagination to prevent loading all services at once
  const { data: listDecorService, isLoading: isListLoading } =
    useGetListDecorService({
      pageIndex: 1,
      pageSize: 10,
      forcePagination: true,
    });

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
        console.log("Added to favorite");
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
    console.log("Address selection changed:", selected);
    if (selected) {
      setSelectedAddress(selected);
      setValue("addressId", selected.value);
      console.log("Selected Address ID:", selected.value);
    }
  };

  const onSubmit = (data) => {
    if (!selectedAddress || !selectedBookingData) {
      alert("Please select both an address and a date before booking");
      return;
    }

    console.log("Selected booking data:", selectedBookingData);

    const bookingData = {
      decorServiceId: serviceDetail.id,
      addressId: selectedAddress.value,
      surveyDate: selectedBookingData.date,
      note: data.note,
    };

    console.log("Booking data being sent:", bookingData);

    bookService(bookingData, {
      onSuccess: () => {
        //console.log("Booking successful");
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
  };

  // Show skeleton loading when data is loading
  const isLoading = isServiceLoading || (!serviceDetail && isListLoading);

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  if (!serviceDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
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
              <FootTypo
                footlabel="You are the provider of this service"
                className="font-bold text-2xl bg-primary text-white rounded-lg p-2"
              />
            </div>
          </div>
        )}
        {/* Service Name */}
        <div className="mb-6">
          <FootTypo
            footlabel={serviceDetail.style || "Service Not Found"}
            className="text-3xl font-bold text-black dark:text-white mb-2"
          />
        </div>

        {/* Image Gallery - Airbnb Style */}
        {serviceDetail.images?.length > 0 ? (
          <div className="relative mb-10 cursor-pointer">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                <Image
                  src={serviceDetail.images[0]?.imageURL}
                  alt="Primary image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              </div>

              {/* Grid of smaller images */}
              <div className="hidden md:grid grid-cols-2 gap-2">
                {serviceDetail.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-[244px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile only: Small images row */}
              <div className="grid grid-cols-3 gap-2 md:hidden">
                {serviceDetail.images.slice(1, 4).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-[120px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 p-12 border rounded-lg mb-10">
            <p>No images available</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex flex-row items-center gap-2">
                <MdCategory size={20} />
                <FootTypo
                  footlabel="This service is suitable for"
                  className="!m-0 font-bold text-sm"
                />
              </span>

              <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
                {serviceDetail.categoryName || "Uncategorized"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <FootTypo
                footlabel="Suitable for:"
                className="!m-0 font-bold text-sm"
              />
              <div className="flex flex-wrap gap-2">
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
                  <span className="text-gray-500 text-sm">All seasons</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MdLocationOn size={20} />
              <span className="text-sm font-medium">
                Fast support in{" "}
                <FootTypo
                  footlabel={
                    serviceDetail.sublocation || "Location not specified"
                  }
                  className="font-bold"
                />
              </span>
            </div>

            <div className="flex items-start gap-3">
              <RiErrorWarningFill
                size={20}
                className="text-warning mt-0.5 flex-shrink-0"
              />
              <div>
                <span className="text-sm font-medium">
                  For customers located farther, we are still committed to
                  delivering quality service, but please note that response
                  times may be slightly longer due to travel or logistical
                  constraints.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MdFavorite size={20} />
              <FootTypo
                footlabel="People liked : "
                className="!m-0 font-bold text-sm"
              />
              <span className="text-sm font-medium">
                {serviceDetail.favoriteCount || "No favorite yet"}
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <FootTypo
                  footlabel="Description"
                  className="!m-0 font-bold text-lg"
                />
                <div className="mt-3 rounded-lg">
                  <div 
                    className="whitespace-pre-line line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: serviceDetail.description || "" }}
                  />
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
              {!serviceDetail.isBooked && (
                <div className="space-y-4">
                  <Label htmlFor="note">
                    Your requirements for this service
                  </Label>
                  <div className="w-full">
                    <Field>
                      <Textarea
                        id="note"
                        name="note"
                        {...register("note")}
                        placeholder="Type something..."
                        className={`
      mt-3 block w-full resize-none rounded-lg border-[1px] 
      border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
      bg-white dark:bg-gray-800 text-black dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-200
    `}
                        rows={7}
                      />
                    </Field>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t mt-8">
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
                      disabled={
                        serviceDetail.isBooked ||
                        !selectedAddress ||
                        !selectedBookingData
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
                      disabled={isInFavorites || isPending}
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
            </div>
          </div>
          <div>
            <div className="space-y-5 mb-5 w-full">
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
                description="This schedule is the latest updated from the provider"
                footerLabel="Please select a date for your survey"
                availableDates={serviceDetail.availableDates || []}
                onDateSelect={(dateData) => {
                  console.log("Selected date data:", dateData);
                  setSelectedBookingData(dateData);
                }}
              />
            )}

            <Link
              href="/report"
              className="flex items-center justify-center gap-2 mt-10"
            >
              <FaFlag size={14} />
              <FootTypo
                footlabel="Report this service"
                className="!m-0 font-bold text-sm underline"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Add ResultModal component */}
      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={resultModalData.title}
        message={resultModalData.message}
        type={resultModalData.type}
      />

      {/* Ratings and Reviews Section */}
      <section className="mt-16 border-t pt-8 relative">
        <FootTypo
          footlabel="Ratings, reviews, and reliability"
          className="!m-0 text-2xl font-bold mb-8 absolute top-[-25px] left-1/2 -translate-x-1/2 bg-gray-100 dark:bg-black p-2 rounded-xl"
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
            rateCount={review?.rateCount || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }}
            totalReviews={review?.totalCount || 0}
          />
        )}
      </section>

      {/* Full ReviewSection with form (can be kept or removed) */}
      <div className="mt-10">
        <ReviewSection
          averageRating={review?.averageRate || 0}
          totalReviews={review?.totalCount || 0}
        />
      </div>

      {/* Individual Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
        {isReviewsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} className="mb-6">
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
            ))}
          </>
        ) : (
          <DataMapper
            data={reviewData}
            Component={ReviewCard}
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
        )}
      </div>

      <div className="mt-10">
        <HostSection
          //href={`/provider/${serviceDetail.provider.slug}`}
          avatar={serviceDetail.provider.avatar}
          name={serviceDetail.provider.businessName}
          joinDate={serviceDetail.provider.joinedDate}
          followers={serviceDetail.provider.followersCount}
        />
      </div>
    </Container>
  );
};

export default ServiceDetail;

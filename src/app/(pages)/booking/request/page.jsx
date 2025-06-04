"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { useGetPaginatedBookingsForCustomer } from "@/app/queries/list/booking.list.query";
import BookingCard from "@/app/components/ui/card/BookingCard";
import useInfoModal from "@/app/hooks/useInfoModal";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { BodyTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import PopoverComponent from "@/app/components/ui/popover/Popover";
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation.list.query.js";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";
import { generateSlug } from "@/app/helpers";
import { toast } from "sonner";
import { FaStar } from "react-icons/fa";
import {
  MdClose,
  MdUploadFile,
  MdCalendarToday,
  MdFilterListOff,
} from "react-icons/md";
import Image from "next/image";
import { useReviewService } from "@/app/queries/review/review.query";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { usePayCommitDeposit } from "@/app/queries/book/book.query";
import { useCreateMeetingRequest } from "@/app/queries/meeting/meeting.query";
import PickDate from "../components/PickDate";
import { SiZoom } from "react-icons/si";
import { FiClock } from "react-icons/fi";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const BookingRequestPage = () => {
  const router = useRouter();
  const { onOpen, onClose } = useInfoModal();
  const deleteConfirmModal = useDeleteConfirmModal();
  const { mutate: reviewService, isPending: isReviewing } = useReviewService();
  const { data: walletData } = useGetWallet();

  const { mutate: payCommitDeposit, isPending: isPayingDeposit } =
    usePayCommitDeposit();

  const { mutate: createMeetingRequest, isPending: isCreatingMeeting } =
    useCreateMeetingRequest();

  // Review Modal State
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentReviewBooking, setCurrentReviewBooking] = useState(null);

  // Meeting Dialog State
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [currentBookingForMeeting, setCurrentBookingForMeeting] =
    useState(null);
  const [selectedMeetingDate, setSelectedMeetingDate] = useState(null);
  const [selectedMeetingTime, setSelectedMeetingTime] = useState("12:00");

  // Deposit Dialog State
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [currentBookingForDeposit, setCurrentBookingForDeposit] =
    useState(null);
  const DEPOSIT_AMOUNT = 500000; // 500,000 VND fixed deposit amount

  const [filters, setFilters] = useState({
    status: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Meeting Dialog Handlers
  const handleOpenMeetingDialog = (booking) => {
    setCurrentBookingForMeeting(booking);
    setMeetingDialogOpen(true);
    setSelectedMeetingDate(null);
    setSelectedMeetingTime("12:00");
  };

  const handleCloseMeetingDialog = () => {
    setMeetingDialogOpen(false);
    setCurrentBookingForMeeting(null);
    setSelectedMeetingDate(null);
    setSelectedMeetingTime("12:00");
  };

  // Handle date selection
  const handleDateSelect = (dateInfo) => {
    setSelectedMeetingDate(dateInfo);
    // Default time remains at 12:00
  };

  // Handle time change from the time picker
  const handleTimeChange = (value) => {
    if (!value) {
      // If user clears the time, set default time
      setSelectedMeetingTime("12:00");
      return;
    }

    setSelectedMeetingTime(value);
  };

  // Handle time period selection (Morning, Noon, etc.)
  const selectTimePeriod = (period) => {
    switch (period) {
      case "morning":
        setSelectedMeetingTime("09:00");
        break;
      case "noon":
        setSelectedMeetingTime("12:00");
        break;
      case "afternoon":
        setSelectedMeetingTime("15:00");
        break;
      case "evening":
        setSelectedMeetingTime("18:00");
        break;
      default:
        setSelectedMeetingTime("12:00");
    }
  };

  const handleMeetingRequest = () => {
    if (
      !selectedMeetingDate ||
      !selectedMeetingTime ||
      !currentBookingForMeeting
    ) {
      toast.error("Please select both a date and time for your meeting");
      return;
    }

    // Format the date and time for the API - format should match "2023-05-05T14:48:51.447Z"
    const startTime = `${selectedMeetingDate.date}T${selectedMeetingTime}:00.000Z`;

    // Extract the bookingCode from the current booking
    const { bookingCode } = currentBookingForMeeting;

    // Call the mutation with the formatted data
    createMeetingRequest(
      {
        bookingCode: bookingCode,
        startTime: startTime,
      },
      {
        onSuccess: () => {
          handleCloseMeetingDialog();
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to request meeting. Please try again."
          );
        },
      }
    );
  };

  // Review Dialog Handlers
  const handleOpenReviewDialog = (booking) => {
    setCurrentReviewBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    // Reset form state
    setRating(0);
    setComment("");
    setSelectedImages([]);
    setPreviewImages([]);
    setCurrentReviewBooking(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedImages([...selectedImages, ...files]);

    // Create previews for the images
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index].url);

    // Remove the image from state
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newSelected = [...selectedImages];
    newSelected.splice(index, 1);
    setSelectedImages(newSelected);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Planning" },
    { id: "2", name: "Quoting" },
    { id: "3", name: "Contracting" },
    { id: "4", name: "Confirmed" },
    { id: "5", name: "Deposit Paid" },
    { id: "6", name: "Preparing" },
    { id: "7", name: "In Transit" },
    { id: "8", name: "Progressing" },
    { id: "9", name: "All Done" },
    { id: "10", name: "Final Paid" },
    { id: "11", name: "Completed" },
    { id: "12", name: "Pending Cancel" },
    { id: "13", name: "Cancelled" },
    { id: "14", name: "Rejected" },
  ];

  const {
    data: bookingsData,
    isLoading: isInitialLoading,
    refetch: refetchInitialList,
  } = useGetPaginatedBookingsForCustomer(pagination);

  const {
    data: quotationsData,
    isLoading: isQuotationsLoading,
    refetch: refetchQuotations,
  } = useGetListQuotationForCustomer({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    status: 0,
  });

  const bookings = bookingsData?.data || [];
  const quotations = quotationsData?.data || [];

  const quotationItemCount = quotationsData?.totalCount || 0;
  const totalCount = bookingsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[250px] dark:text-white"
      >
        <InputLabel id="status-label" className="dark:text-white">
          Status
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="status-label"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          label="Status"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filter"
        onClick={() =>
          setFilters({
            status: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  const handleSubmitReview = () => {
    if (!currentReviewBooking) return;

    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add required fields
    formData.append("Rate", rating);
    formData.append("Comment", comment);
    formData.append("BookingId", currentReviewBooking.bookingId);

    // Add optional images if present
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("Images", image);
      });
    }

    // Use the reviewService hook for creating a new review
    reviewService(formData, {
      onSuccess: () => {
        //toast.success("Thank you for your review!");
        refetchInitialList();
        handleCloseReviewDialog();
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to submit review. Please try again."
        );
      },
    });
  };

  // Add this function to generate booking card skeletons
  const BookingCardSkeleton = () => (
    <Card className="mb-4 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <Skeleton
              variant="rounded"
              width={64}
              height={64}
              animation="wave"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between mb-2">
              <Skeleton
                variant="text"
                width={140}
                height={24}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                width={100}
                height={30}
                animation="wave"
              />
            </div>
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton
                variant="rounded"
                width={80}
                height={32}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                width={80}
                height={32}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                width={80}
                height={32}
                animation="wave"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Open deposit dialog
  const handleOpenDepositDialog = (booking) => {
    setCurrentBookingForDeposit(booking);
    setDepositDialogOpen(true);
  };

  // Close deposit dialog
  const handleCloseDepositDialog = () => {
    setDepositDialogOpen(false);
    setCurrentBookingForDeposit(null);
  };

  // Handle deposit payment
  const handleDepositPayment = () => {
    payCommitDeposit(currentBookingForDeposit.bookingCode, {
      onSuccess: () => {
        handleCloseDepositDialog();
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to pay deposit. Please try again."
        );
      },
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Container>
      <MuiBreadcrumbs />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        my={2}
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <BodyTypo bodylabel="Booking Request" />
          <RefreshButton
            onRefresh={() => {
              refetchInitialList();
              refetchQuotations();
            }}
            isLoading={isInitialLoading || isQuotationsLoading}
            tooltip="Refresh booking request list"
          />
        </Box>

        <Box className="flex flex-row gap-4">
          <PopoverComponent
            buttonLabel="Pending Quotations"
            itemCount={quotationItemCount}
          >
            <DataMapper
              data={quotations}
              Component={QuotationCard}
              emptyStateComponent={<EmptyState title="No quotations found" />}
              loading={isQuotationsLoading}
              getKey={(item) => item.quotationCode}
              componentProps={(item) => ({
                quotationCode: item.quotationCode,
                createdDate: item.createdAt,
                status: item.status,
                serviceName: item.style,
                onClick: () => {
                  router.push(`/quotation/${item.quotationCode}`);
                },
              })}
            />
          </PopoverComponent>
          <button
            onClick={() => router.push("/quotation")}
            className="flex items-center gap-2 px-4 py-2 hover:translate-x-3 transition-all duration-300"
          >
            <IoIosArrowForward size={20} />
            All Quotations
          </button>
        </Box>
      </Box>

      <FilterSelectors />

      {isInitialLoading && bookings.length === 0 ? (
        <Stack spacing={2}>
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </Stack>
      ) : bookings.length === 0 && !isInitialLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">
            No Booking Requests Found
          </h2>
          <span>
            {filters.status
              ? "No booking requests match your filter criteria. Try adjusting your filters."
              : "You don't have any booking requests at the moment."}
          </span>
        </div>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={2}>
            <DataMapper
              data={bookings}
              Component={BookingCard}
              emptyStateComponent={
                <EmptyState title="No booking requests found" />
              }
              loading={isInitialLoading}
              getKey={(item) => item.bookingId}
              useGrid={false}
              componentProps={(booking) => ({
                bookingCode: booking.bookingCode,
                status: booking.status,
                surveyDate: booking.surveyDate,
                createdDate: booking.createdAt,
                isPending: booking.status === 0,
                isPlanning: booking.status === 1,
                isContracting: booking.status === 3,
                isCancelled: booking.status === 13,
                isDepositPaid: booking.status === 5,
                isInTransit: booking.status === 7,
                isProgressing: booking.status === 8,
                isAllDone: booking.status === 9,
                isFinalPaid: booking.status === 10,
                isQuoteExist: booking.isQuoteExisted,
                isCompleted: booking.status === 11,
                isPendingCancel: booking.status === 12,
                isTracked: booking.isTracked,
                isSigned: booking.isContractSigned,
                address: booking.address,
                hasTerminated: booking.hasTerminated,
                completeDate: booking.completeDate,
                isReviewed: booking.isReviewed,
                providerAvatar: booking.provider.avatar,
                providerName: booking.provider.businessName,
                serviceName: booking.decorService.style,
                serviceId: booking.decorService.id,
                isCommitDepositPaid: booking.isCommitDepositPaid,
                commitDepositClick: () => handleOpenDepositDialog(booking),
                handleReview: () => handleOpenReviewDialog(booking),
                meetingClick: () => handleOpenMeetingDialog(booking),
                trackingNavigate: () =>
                  router.push(
                    `progress/${booking.bookingCode}?is-tracked=${booking.isTracked}&status=${booking.status}&quotation-code=${booking.quotationCode}&provider=${booking.provider.businessName}&avatar=${booking.provider.avatar}&is-reviewed=${booking.isReviewed}`
                  ),
                detailClick: () =>
                  onOpen({
                    isBooking: true,
                    viewService: () =>
                      router.push(
                        `/booking/${generateSlug(booking.decorService.style)}`
                      ),
                    buttonLabel: "Done",
                    title: "Booking Details",
                    bookingCode: booking.bookingCode,
                    status: booking.status,
                    serviceStyle: booking.decorService.style,
                    serviceImage: booking.decorService.images.map(
                      (img) => img.imageURL
                    ),
                    serviceName: booking.decorService.style,
                    serviceSeason: booking.decorService.seasons,
                    serviceThemeColors: booking.themeColors,
                    providerImage: booking.provider.avatar,
                    serviceDesignStyle: booking.designs,
                    providerName: booking.provider.businessName,
                    surveyDate: booking.surveyDate,
                    bookingFormInfo: {
                      spaceStyle: booking.bookingForm.spaceStyle,
                      roomSize: booking.bookingForm.roomSize,
                      primaryUser: booking.bookingForm.primaryUser,
                      estimatedBudget: booking.bookingForm.estimatedBudget,
                      images:
                        booking.bookingForm.images?.map(
                          (img) => img.imageUrl
                        ) || [],
                    },
                    designStyle: {
                      id: booking.design?.id,
                      name: booking.design?.name,
                    },
                    profileClick: () => {
                      router.push(`/provider/${booking.provider.slug}`);
                      onClose();
                    },
                  }),
                cancelClick: () =>
                  deleteConfirmModal.onOpen(
                    booking.bookingCode,
                    booking.bookingCode,
                    "request"
                  ),
              })}
            />
          </Box>

          {totalCount > 0 && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              my={3}
              gap={2}
            >
              <button
                onClick={() =>
                  pagination.pageIndex > 1 &&
                  handlePaginationChange(pagination.pageIndex - 1)
                }
                disabled={pagination.pageIndex <= 1}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowBack size={20} />
              </button>
              <span className="flex items-center">
                Page {pagination.pageIndex} of {totalPages}
              </span>
              <button
                onClick={() =>
                  pagination.pageIndex < totalPages &&
                  handlePaginationChange(pagination.pageIndex + 1)
                }
                disabled={pagination.pageIndex >= totalPages}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowForward size={20} />
              </button>
            </Box>
          )}
        </>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6" component="div">
              Rate Your Experience with{" "}
              <span className="font-bold">
                {currentReviewBooking?.provider?.businessName}
              </span>
            </Typography>
            <IconButton onClick={handleCloseReviewDialog}>
              <MdClose />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <Typography component="legend" className="mb-2 text-center">
                How would you rate your experience?
              </Typography>
              <Rating
                name="service-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={1}
                className="space-x-2"
                icon={<FaStar className="text-amber-400" fontSize="inherit" />}
                emptyIcon={
                  <FaStar className="text-gray-300" fontSize="inherit" />
                }
                size="large"
              />
            </div>

            <div>
              <Typography component="legend" className="mb-2">
                Share your thoughts about the service
                <span className="font-bold ml-2">
                  {currentReviewBooking?.decorService?.style}
                </span>
              </Typography>
              <TextField
                autoFocus
                id="comment"
                multiline
                rows={4}
                fullWidth
                placeholder="Tell provider what you liked or didn't like about this service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
              />
            </div>

            <div>
              <Typography component="legend" className="mb-2">
                Add Photos
              </Typography>
              <div className="flex flex-wrap gap-2 my-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 w-24 relative overflow-hidden rounded-lg">
                      <Image
                        src={image.url}
                        alt={`Preview ${index}`}
                        className="object-cover"
                        fill
                        sizes="96px"
                        unoptimized={false}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Box
                  component="label"
                  htmlFor="upload-image"
                  className="h-24 w-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <MdUploadFile size={24} />
                  <Typography variant="caption">Add Photo</Typography>
                  <input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" onClick={handleCloseReviewDialog} />

          <Button
            label={isReviewing ? "Submitting..." : "Submit Review"}
            isLoading={isReviewing}
            onClick={handleSubmitReview}
            disabled={!comment.trim() || rating === 0}
            className={`${
              !comment.trim() || rating === 0 ? "bg-gray-400" : "bg-primary"
            } text-white`}
          />
        </DialogActions>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog
        open={depositDialogOpen}
        onClose={handleCloseDepositDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6" component="div">
              Deposit Commitment
            </Typography>
            <IconButton onClick={handleCloseDepositDialog}>
              <MdClose />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-6 py-2">
            <div className="text-center mb-4">
              <Typography variant="h6" gutterBottom>
                Booking: {currentBookingForDeposit?.bookingCode}
              </Typography>
              <Typography variant="body1" color="text.primary">
                Your service: {currentBookingForDeposit?.decorService?.style}
              </Typography>
            </div>

            <div className="p-4 rounded-lg">
              <Typography variant="subtitle1" gutterBottom>
                Deposit Amount
              </Typography>
              <Typography variant="h5" className="font-bold text-primary">
                {formatCurrency(DEPOSIT_AMOUNT)}
              </Typography>
            </div>
            <Divider flexItem />
            <div className=" p-4 rounded-lg">
              <Typography variant="subtitle1" gutterBottom>
                Current Wallet Balance
              </Typography>
              <Typography
                variant="h5"
                className={`font-bold ${
                  walletData?.balance >= DEPOSIT_AMOUNT
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {walletData ? formatCurrency(walletData.balance) : "Loading..."}
              </Typography>
            </div>

            {walletData && walletData.balance < DEPOSIT_AMOUNT && (
              <div className="p-4 rounded-lg border border-red">
                <Typography variant="body2" color="error" component="div">
                  Your wallet balance is insufficient for this deposit. Please
                  top up your wallet with at least{" "}
                  {formatCurrency(DEPOSIT_AMOUNT - walletData.balance)} more.
                </Typography>
              </div>
            )}

            {/* Deposit Regulation Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <Typography
                variant="subtitle2"
                className="font-semibold mb-2 text-blue-700 dark:text-blue-300"
                component="div"
              >
                Deposit Regulation:
              </Typography>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  The deposit of {formatCurrency(DEPOSIT_AMOUNT)} confirms your
                  commitment to this booking.
                </li>
                <li>
                  This amount is non-refundable if cancelled before the
                  scheduled service date.
                </li>
                <li>
                  The deposit will be deducted from the final payment upon
                  service completion.
                </li>
                <li>
                  By paying this deposit, you agree to the terms and conditions
                  of Season Decor platform.
                </li>
                <li>
                  The provider will be notified and will begin preparations once
                  your deposit is received.
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" onClick={handleCloseDepositDialog} />

          {walletData && walletData.balance >= DEPOSIT_AMOUNT ? (
            <Button
              label="Pay Deposit"
              onClick={handleDepositPayment}
              className="bg-action text-white"
              isLoading={isPayingDeposit}
            />
          ) : (
            <Button
              label="Top Up Wallet"
              onClick={() => {
                handleCloseDepositDialog();
                router.push("/user/account/wallet");
              }}
              className="bg-action text-white"
            />
          )}
        </DialogActions>
      </Dialog>

      {/* Meeting Dialog */}
      <Dialog
        open={meetingDialogOpen}
        onClose={handleCloseMeetingDialog}
        maxWidth="md"
        fullWidth
        disableScrollLock
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <SiZoom className="text-blue-500 mr-2" size={22} />
              <Typography variant="h6" component="div">
                Schedule a Zoom Meeting
              </Typography>
            </div>
            <IconButton onClick={handleCloseMeetingDialog}>
              <MdClose />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="py-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
              <Typography
                variant="h6"
                className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1"
              >
                <span>
                  Booking Code : {currentBookingForMeeting?.bookingCode}
                </span>
              </Typography>
              <Typography
                variant="body1"
                className="text-blue-600 dark:text-blue-400"
              >
                Service: {currentBookingForMeeting?.decorService?.style}
              </Typography>
              <Typography
                variant="body2"
                className="mt-2 text-gray-600 dark:text-gray-300"
              >
                This meeting will be held via Zoom with{" "}
                <span className="font-bold">
                  {currentBookingForMeeting?.provider?.businessName}
                </span>
                . Select your preferred date and time below.
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography
                  variant="subtitle1"
                  className="font-semibold mb-2 flex items-center gap-2"
                >
                  <MdCalendarToday className="text-indigo-600" size={20} />
                  Select Date
                </Typography>
                <PickDate
                  onDateSelect={handleDateSelect}
                  title="Select Date"
                  description="Select your preferred date for the meeting"
                />
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  className="font-semibold mb-4 flex items-center gap-2"
                >
                  <FiClock className="text-indigo-600" size={20} />
                  Select Time
                </Typography>

                {selectedMeetingDate ? (
                  <>
                    <div className="flex flex-col items-center space-y-6">
                      {/* Time Period Quick Select */}
                      <div className="flex justify-center gap-2 my-5 w-full">
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                            transition-all duration-200 hover:shadow-sm focus:outline-none
                            ${
                              selectedMeetingTime === "09:00"
                                ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                            }`}
                          onClick={() => selectTimePeriod("morning")}
                        >
                          Morning (9:00)
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                            transition-all duration-200 hover:shadow-sm focus:outline-none
                            ${
                              selectedMeetingTime === "12:00"
                                ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                            }`}
                          onClick={() => selectTimePeriod("noon")}
                        >
                          Noon (12:00)
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                            transition-all duration-200 hover:shadow-sm focus:outline-none
                            ${
                              selectedMeetingTime === "15:00"
                                ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                            }`}
                          onClick={() => selectTimePeriod("afternoon")}
                        >
                          Afternoon (15:00)
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border 
                            transition-all duration-200 hover:shadow-sm focus:outline-none
                            ${
                              selectedMeetingTime === "18:00"
                                ? "bg-indigo-100 border-indigo-300 text-indigo-700 shadow-sm"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                            }`}
                          onClick={() => selectTimePeriod("evening")}
                        >
                          Evening (18:00)
                        </button>
                      </div>

                      {/* Time Picker */}
                      <div className="rounded-lg p-6 border shadow-sm w-full max-w-xs">
                        <div className="flex flex-col items-center">
                          <div className="mb-3 flex items-center justify-center">
                            <TimePicker
                              onChange={handleTimeChange}
                              value={selectedMeetingTime}
                              format="HH:mm"
                              clearIcon={null}
                              clockIcon={
                                <FiClock className="text-indigo-500" />
                              }
                              disableClock={false}
                              className="react-time-picker"
                              amPmAriaLabel="Select AM/PM"
                              hourAriaLabel="Hour"
                              minuteAriaLabel="Minute"
                              locale="en-US"
                            />
                          </div>
                          <Typography
                            variant="caption"
                            className="text-center block"
                          >
                            Select a time for your meeting
                          </Typography>
                        </div>
                      </div>
                    </div>
                    {selectedMeetingDate && selectedMeetingTime && (
                      <div className="mt-6 p-4 rounded-lg">
                        <Typography
                          variant="subtitle1"
                          align="center"
                          className="font-medium bg-primary rounded-lg p-2 self-center"
                        >
                          Meeting Summary
                        </Typography>
                        <Typography variant="body1" className="pt-3">
                          You are requesting a Zoom meeting with
                          <span className="font-bold mx-1">
                            {currentBookingForMeeting?.provider?.businessName}
                          </span>
                          on
                          <span className="font-bold mx-1">
                            {selectedMeetingDate.formattedDate}
                          </span>
                          at
                          <span className="font-bold mx-1">
                            {selectedMeetingTime}
                          </span>
                        </Typography>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center rounded-lg p-8">
                    <div className="text-center">
                      <MdCalendarToday
                        className="mx-auto text-gray-400 mb-3"
                        size={30}
                      />
                      <Typography variant="body1" className="text-gray-500">
                        Please select a date first
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-gray-400 mt-1 block"
                      >
                        You'll be able to choose a time after selecting a date
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            label="Cancel"
            onClick={handleCloseMeetingDialog}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          />

          <Button
            label="Request Meeting"
            onClick={handleMeetingRequest}
            className="bg-action text-white"
            isLoading={isCreatingMeeting}
            disabled={
              !selectedMeetingDate || !selectedMeetingTime || isCreatingMeeting
            }
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingRequestPage;

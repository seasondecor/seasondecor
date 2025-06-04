"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../../components/SellerWrapper";
import {
  TbArrowLeft,
  TbLayoutList,
  TbCalendarTime,
  TbSortDescending,
  TbSortAscending,
} from "react-icons/tb";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useParams } from "next/navigation";
import {
  useGetBookingDetailForProvider,
  useApproveCancelRequest,
  useRevokeCancelRequest,
} from "@/app/queries/book/book.query";
import { BorderBox } from "@/app/components/ui/BorderBox";
import {
  Skeleton,
  Paper,
  Typography,
  Divider,
  Box,
  Collapse,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge,
  Button as MuiButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatDate } from "@/app/helpers";
import { FaBarcode } from "react-icons/fa";
import { CgCalendarDates } from "react-icons/cg";
import { RiMailLine, RiMessage2Line } from "react-icons/ri";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import Button from "@/app/components/ui/Buttons/Button";
import { PiSealWarning } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { formatCurrency } from "@/app/helpers";
import { useGetPendingCancelByBookingCode } from "@/app/queries/book/book.query";
import { Textarea } from "@headlessui/react";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { useAddContact } from "@/app/queries/contact/contact.query";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetMeetingListForProvider } from "@/app/queries/meeting/meeting.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import MeetingCard from "@/app/components/ui/card/MeetingCard";
import {
  useAcceptMeetingRequest,
  useRejectMeetingRequest,
} from "@/app/queries/meeting/meeting.query";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import ThemePalette from "@/app/components/ui/themePalette/ThemePalatte";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Image from "next/image";
import { useGetTrackingByBookingCode } from "@/app/queries/tracking/tracking.query";
import ShinyText from "@/app/components/ui/animated/ShinyText";
import TrackingDialog from "../components/TrackingDialog";
import { motion } from "framer-motion";

const RequestDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [acceptingMeetings, setAcceptingMeetings] = useState({});
  const [isRejectMeetingRequest, setIsRejectMeetingRequestPending] = useState(
    {}
  );
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [isDescending, setIsDescending] = useState(true);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pendingMeetingsCount, setPendingMeetingsCount] = useState(0);

  const addContactMutation = useAddContact();

  const { onOpen } = useChatBox();
  const { setSelectedReceiver } = useChat();

  const { data: bookingsData, isLoading: isBookingLoading } =
    useGetBookingDetailForProvider(id);

  const { data: trackingData, isLoading: isTrackingLoading } =
    useGetTrackingByBookingCode(id);

  const {
    data: meetingList,
    isLoading: isMeetingListLoading,
    refetch: refetchMeetingList,
  } = useGetMeetingListForProvider(id, {
    descending: isDescending,
    status: selectedStatus,
  });

  const { mutate: acceptMeetingRequest } = useAcceptMeetingRequest();

  const { mutate: rejectMeetingRequest } = useRejectMeetingRequest();

  const meetings = meetingList?.data || [];
  const totalCount = meetingList?.totalCount || 0;
  //const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  useEffect(() => {
    if (bookingsData?.status === 12) {
      setShouldFetch(true);
    }
  }, [bookingsData]);

  useEffect(() => {
    if (meetings) {
      const pendingCount = meetings.filter(
        (meeting) => meeting.status === 0
      ).length;
      setPendingMeetingsCount(pendingCount);
    }
  }, [meetings]);

  const { data: cancelDetails, isLoading: isCancelDetailsLoading } =
    useGetPendingCancelByBookingCode(id, shouldFetch);

  const {
    mutate: approveCancelRequest,
    isPending: isApproveCancelRequestPending,
  } = useApproveCancelRequest();
  const {
    mutate: revokeCancelRequest,
    isPending: isRevokeCancelRequestPending,
  } = useRevokeCancelRequest();

  if (isBookingLoading || isCancelDetailsLoading) {
    return (
      <SellerWrapper>
        <div className="flex items-center gap-1 mb-5">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width={60} />
        </div>

        <div className="flex items-center my-6">
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="text" width={150} sx={{ ml: 1 }} />
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="flex w-full mb-10">
          <Skeleton variant="rounded" width="50%" height={40} sx={{ mr: 1 }} />
          <Skeleton variant="rounded" width="50%" height={40} sx={{ ml: 1 }} />
        </div>

        {/* Information Grid Skeleton */}
        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Skeleton variant="text" width={120} sx={{ mb: 2 }} />
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={200} />
                  </div>
                ))}
              </div>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Skeleton variant="text" width={160} sx={{ mb: 2 }} />
              <div className="flex items-center gap-2 mb-3">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={150} />
              </div>
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={180} />
                </div>
              ))}
              <Skeleton
                variant="rounded"
                width={120}
                height={36}
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Service Details Skeleton */}
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <Skeleton variant="text" width={140} sx={{ mb: 2 }} />
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between items-center">
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={100} />
              </div>
              <Skeleton variant="rounded" height={60} />
            </div>
          ))}

          <Divider sx={{ my: 3 }} />

          {/* Theme Colors Skeleton */}
          <Skeleton variant="text" width={160} sx={{ mb: 2 }} />
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="circular" width={40} height={40} />
            ))}
          </div>

          {/* Booking Details Skeleton */}
          <Skeleton variant="rounded" height={50} sx={{ mb: 2 }} />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rounded" height={80} />
            ))}
          </div>
        </Paper>
      </SellerWrapper>
    );
  }

  const handleApproveCancelRequest = () => {
    approveCancelRequest(id);
  };

  const handleRevokeCancelRequest = () => {
    revokeCancelRequest(id);
  };

  const handleChatClick = (receiver) => {
    const receiverData = {
      contactId: receiver.id,
      contactName: receiver.businessName,
      avatar: receiver.avatar,
    };
    addContactMutation.mutate(receiver.id, {
      onSuccess: () => {
        setSelectedReceiver(receiverData);
        onOpen();
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

  const handleAcceptMeetingRequest = (meetingId) => {
    setAcceptingMeetings((prev) => ({ ...prev, [meetingId]: true }));
    acceptMeetingRequest(
      {
        bookingCode: id,
        id: meetingId,
      },
      {
        onError: (error) => {
          console.error("Error accepting meeting request:", error);
        },
      }
    );
  };

  const handleRejectMeetingRequest = (meetingId) => {
    setIsRejectMeetingRequestPending((prev) => ({
      ...prev,
      [meetingId]: true,
    }));
    rejectMeetingRequest(
      {
        bookingCode: id,
        id: meetingId,
      },
      {
        onError: (error) => {
          console.error("Error rejecting meeting request:", error);
        },
      }
    );
  };

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5 w-fit"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <TbLayoutList size={28} className="mr-2" />
          <BodyTypo bodylabel="Request Details" className="text-xl" />
          <RefreshButton
            onRefresh={refetchMeetingList}
            isLoading={isMeetingListLoading}
            tooltip="Refresh meeting list"
          />
        </Box>

        {trackingData && trackingData.length > 0 && (
          <motion.button
            onClick={() => setIsTrackingOpen(true)}
            className="px-2 py-2 h-fit rounded-full border border-primary shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShinyText text="Service Tracking Detail" className="text-sm " />
          </motion.button>
        )}
      </Box>
      {pendingMeetingsCount > 0 && (
        <Box my={2}>
          <Alert
            severity="warning"
            variant="outlined"
            action={
              <MuiButton
                size="small"
                variant="contained"
                onClick={() => {
                  const tabList = document.querySelectorAll('[role="tab"]');
                  tabList[1]?.click();
                }}
              >
                View Requests
              </MuiButton>
            }
          >
            <FootTypo
              footlabel={`You have ${pendingMeetingsCount} pending meeting request${
                pendingMeetingsCount > 1 ? "s" : ""
              }`}
              fontWeight="bold"
            />
          </Alert>
        </Box>
      )}

      <TrackingDialog
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        trackingData={trackingData}
      />

      {/* Tab Navigation - Keeping Headless UI */}
      <TabGroup className="w-full">
        <TabList className="flex">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <TbLayoutList size={18} />
              <FootTypo footlabel="Request Details" />
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
            }
          >
            <div className="flex items-center justify-center gap-2">
              <Badge badgeContent={pendingMeetingsCount} color="error" max={99}>
                <TbCalendarTime size={18} />
              </Badge>
              <FootTypo footlabel="Meeting Request" />
            </div>
          </Tab>
        </TabList>

        <TabPanels className="mt-3 relative overflow-hidden p-5">
          <TabPanel className="animate-tab-fade-in">
            {/* Request Details Panel */}

            <Grid container spacing={3} mb={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BorderBox className="flex flex-col gap-2 border shadow-xl h-full">
                  <FootTypo footlabel="Information" fontWeight="bold" />
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaBarcode size={20} />
                    <FootTypo footlabel="Booking Code" />
                    <FootTypo footlabel={id} className=" underline" />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CgCalendarDates size={20} />
                    <FootTypo footlabel="Requested survey date" />
                    <FootTypo
                      footlabel={formatDate(bookingsData.surveyDate)}
                      className="underline"
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    className="text-rose-500"
                  >
                    <PiSealWarning size={20} />
                    <FootTypo footlabel="Please be aware that the survey date can't exceed than requested date!" />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <HiOutlineStatusOnline size={20} />
                    <FootTypo footlabel="Status" />
                    <StatusChip status={bookingsData.status} isBooking={true} />
                  </Box>
                </BorderBox>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BorderBox className="flex flex-col gap-2 border shadow-xl h-full">
                  <FootTypo
                    footlabel="Customer Information"
                    fontWeight="bold"
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      userImg={bookingsData.customer.avatar}
                      alt={bookingsData.customer.fullName}
                      w={40}
                      h={40}
                    />
                    <FootTypo footlabel={bookingsData.customer.fullName} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <RiMailLine size={20} />
                    <FootTypo footlabel="Contact" />
                    <FootTypo
                      footlabel={bookingsData.customer.email}
                      className="underline"
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IoLocationOutline size={20} />
                    <FootTypo footlabel="Location" />
                    <FootTypo
                      footlabel={bookingsData.address}
                      className="underline"
                    />
                  </Box>
                  <Button
                    onClick={() => handleChatClick(bookingsData.customer)}
                    icon={<RiMessage2Line size={20} />}
                    label="Send Message"
                    className="w-fit bg-primary"
                  />
                </BorderBox>
              </Grid>
            </Grid>

            {bookingsData.status === 12 ? (
              <BorderBox className="flex flex-col gap-2 border shadow-xl w-full col-span-2 font-semibold">
                <FootTypo footlabel="Cancellation Request" fontWeight="bold" />
                <Box display="flex" alignItems="center" gap={1}>
                  <FootTypo footlabel="Requested on:" />
                  <FootTypo footlabel={formatDate(cancelDetails?.createdAt)} />
                </Box>
                <div className="flex justify-between mt-2 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-red font-semibold">
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PiSealWarning size={24} />
                      <FootTypo footlabel="Reason for Cancellation" />
                      <FootTypo
                        footlabel={
                          cancelDetails?.cancelTypeName ||
                          "No specific reason provided by the customer."
                        }
                      />
                    </Box>
                    <div className="ml-9 py-2 border-t">
                      <FootTypo footlabel="Customer's Explanation" />
                      <Textarea
                        as="textarea"
                        name="note"
                        value={cancelDetails?.cancelReason}
                        className="block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
              border border-transparent py-3 px-4  text-gray-800 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
              transition duration-300 whitespace-pre-wrap shadow-sm"
                        placeholder="No explanation provided."
                        rows={5}
                        disabled
                        readOnly
                      />
                    </div>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      label="Approve"
                      onClick={handleApproveCancelRequest}
                      isLoading={isApproveCancelRequestPending}
                    />
                    <Button
                      label="Reject"
                      className="bg-red text-white"
                      onClick={handleRevokeCancelRequest}
                      isLoading={isRevokeCancelRequestPending}
                    />
                  </Box>
                </div>
              </BorderBox>
            ) : bookingsData.status === 13 ? (
              <div className="flex flex-col gap-2 border border-red rounded-xl p-4 shadow-xl w-full col-span-2 font-semibold">
                <FootTypo
                  footlabel="The request is closed"
                  className="text-center"
                  fontWeight="bold"
                />
              </div>
            ) : (
              <BorderBox className="flex flex-col gap-2 border shadow-xl w-full col-span-2 font-semibold">
                <FootTypo footlabel="Service Details" fontWeight="bold" />
                <Box display="flex" alignItems="center" gap={1}>
                  <FootTypo footlabel="Service name" />
                  <FootTypo
                    footlabel={bookingsData.decorService.style}
                    className="underline"
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <FootTypo footlabel="Service Start Date" />
                  <FootTypo
                    footlabel={formatDate(bookingsData.decorService.startDate)}
                    className="underline"
                  />
                </Box>

                {bookingsData.bookingDetails.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={4}>
                    {bookingsData.bookingDetails.map((detail, index) => (
                      <Box
                        key={detail.id}
                        display="flex"
                        flexDirection="column"
                        gap={2}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <FootTypo
                            footlabel={detail.serviceItem}
                            fontWeight="bold"
                          />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <FootTypo footlabel="Total:" />
                          <FootTypo footlabel={formatCurrency(detail.cost)} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <div className="bg-white/50 w-full h-full z-30 flex gap-2 items-center justify-start animate-pulse overflow-hidden">
                    <FootTypo footlabel="Waiting for proceeding of the quotation" />
                    <BsThreeDots size={30} />
                  </div>
                )}

                <Divider sx={{ my: 2 }} textAlign="center">
                  Customer Preferences Options
                </Divider>

                {/* Design Styles Section */}
                {bookingsData.designName &&
                bookingsData.designName.length > 0 ? (
                  <Box sx={{ display: "inline-flex", gap: 1 }}>
                    <FootTypo footlabel="Selected Design Styles" />
                    <FootTypo
                      footlabel={bookingsData.designName}
                      fontWeight="bold"
                      className="underline"
                    />
                  </Box>
                ) : (
                  <div className="mt-6">
                    <Divider sx={{ my: 2 }} />
                    <FootTypo footlabel="No design styles selected" />
                  </div>
                )}

                {/* Theme Colors Section */}
                {bookingsData.themeColors &&
                bookingsData.themeColors.length > 0 ? (
                  <>
                    <FootTypo footlabel="Selected Theme Colors" />
                    <ThemePalette title="" colors={bookingsData.themeColors} />
                  </>
                ) : (
                  <div className="mt-6">
                    <Divider sx={{ my: 2 }} />
                    <FootTypo footlabel="No theme colors selected" />
                  </div>
                )}
                {/* Booking Details Collapse */}
                <Paper elevation={1} sx={{ mt: 2, overflow: "hidden" }}>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      cursor: "pointer",
                    }}
                    onClick={() => setBookingDetailsOpen(!bookingDetailsOpen)}
                  >
                    <Typography fontWeight="bold">
                      Booking Form Details
                    </Typography>
                    <IconButton size="small" sx={{ color: "inherit" }}>
                      {bookingDetailsOpen ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </IconButton>
                  </Box>

                  <Collapse in={bookingDetailsOpen}>
                    <Box sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        {bookingsData.bookingForm?.spaceStyle && (
                          <Grid size={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: "background.paper",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Space Style
                              </Typography>
                              <Typography fontWeight="medium">
                                {bookingsData.bookingForm.spaceStyle}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}

                        {bookingsData.bookingForm?.roomSize && (
                          <Grid size={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: "background.paper",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Room Size
                              </Typography>
                              {bookingsData.bookingForm.roomSize ? (
                                <Typography fontWeight="medium">
                                  {`${bookingsData.bookingForm.roomSize} m²`}
                                </Typography>
                              ) : (
                                <Typography fontWeight="medium">
                                  No room size provided
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        )}

                        {bookingsData.bookingForm?.primaryUser && (
                          <Grid size={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: "background.paper",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Primary User
                              </Typography>
                              <Typography fontWeight="medium">
                                {bookingsData.bookingForm.primaryUser}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}

                        {bookingsData.bookingForm?.style && (
                          <Grid size={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: "background.paper",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Style
                              </Typography>
                              <Typography fontWeight="medium">
                                {bookingsData.bookingForm.style}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}

                        {bookingsData.bookingForm?.estimatedBudget !==
                          undefined && (
                          <Grid size={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: "background.paper",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                Estimated Budget
                              </Typography>
                              <Typography fontWeight="medium">
                                {formatCurrency(
                                  bookingsData.bookingForm.estimatedBudget
                                )}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>

                      {/* Scope of Work section */}
                      {bookingsData.bookingForm?.scopeOfWorks &&
                        bookingsData.bookingForm.scopeOfWorks.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              gutterBottom
                            >
                              Scope of Work
                            </Typography>
                            <Grid container spacing={1}>
                              {bookingsData.bookingForm.scopeOfWorks.map(
                                (scope, index) => (
                                  <Grid size={4} key={index}>
                                    <Paper
                                      elevation={2}
                                      sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Typography variant="body2">
                                        {scope.workType || scope}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Box>
                        )}

                      {/* Images section */}
                      {bookingsData.bookingForm?.images &&
                        bookingsData.bookingForm.images.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              gutterBottom
                            >
                              Customer Uploaded Images (
                              {bookingsData.bookingForm.images.length})
                            </Typography>
                            <Grid container spacing={1}>
                              {bookingsData.bookingForm.images.map(
                                (image, index) => (
                                  <Grid size={3} key={index}>
                                    <Paper
                                      elevation={1}
                                      sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    >
                                      <Image
                                        src={image.imageUrl || image}
                                        alt={`Uploaded image ${index + 1}`}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover rounded-lg"
                                        priority={index < 4}
                                      />
                                    </Paper>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Box>
                        )}

                      {/* Customer Notes */}
                      {bookingsData.note && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Customer Notes
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "info.light",
                              color: "info.contrastText",
                            }}
                          >
                            <Typography sx={{ whiteSpace: "pre-wrap" }}>
                              {bookingsData.note}
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Paper>

                <Divider sx={{ my: 2 }} textAlign="center">
                  Products Add-Ons
                </Divider>

                {/* Products Add-Ons Section */}
                {bookingsData.productDetails &&
                bookingsData.productDetails.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ mb: 3 }}
                    >
                      Customer Selected Products (
                      {bookingsData.productDetails.length})
                    </Typography>
                    <Grid container spacing={3}>
                      {bookingsData.productDetails.map((product) => (
                        <Grid size={3} key={product.id}>
                          <Card
                            elevation={2}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 8,
                              },
                            }}
                          >
                            <div className="relative w-full h-48">
                              <Image
                                src={product.image}
                                alt={product.productName}
                                fill
                                objectFit="cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  fontSize: "1.1rem",
                                  fontWeight: "600",
                                  mb: 2,
                                  height: "2.8em",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {product.productName}
                              </Typography>

                              <Stack spacing={1.5}>
                                <Box className="flex justify-between items-center">
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Quantity
                                  </Typography>
                                  <Chip
                                    label={product.quantity}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Box>

                                <Box className="flex justify-between items-center">
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Price
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    color="primary"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {formatCurrency(product.unitPrice)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                            <CardActions
                              sx={{
                                bgcolor: "grey.50",
                                borderTop: 1,
                                borderColor: "grey.200",
                                p: 2,
                              }}
                            >
                              <Box className="flex justify-between items-center w-full">
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 500 }}
                                >
                                  Total
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="primary.main"
                                  sx={{ fontWeight: 700 }}
                                >
                                  {formatCurrency(
                                    product.quantity * product.unitPrice
                                  )}
                                </Typography>
                              </Box>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Card
                      elevation={2}
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                      }}
                    >
                      <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                        <Box className="flex justify-between items-center">
                          <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            Total Products Cost
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {formatCurrency(
                              bookingsData.productDetails.reduce(
                                (total, product) =>
                                  total + product.quantity * product.unitPrice,
                                0
                              )
                            )}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      px: 2,
                      bgcolor: "grey.50",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      No products have been added yet.
                    </Typography>
                  </Box>
                )}
              </BorderBox>
            )}
          </TabPanel>

          <TabPanel className="animate-tab-slide-right">
            {/* Meeting Request Panel */}
            <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              gap={2}
              mb={3}
            >
              <FootTypo footlabel="Filter by" />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white dark:bg-gray-700"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Scheduled</MenuItem>
                  <MenuItem value="4">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => setIsDescending(!isDescending)}
                icon={
                  isDescending ? (
                    <TbSortDescending size={20} />
                  ) : (
                    <TbSortAscending size={20} />
                  )
                }
                label={isDescending ? "Newest" : "Oldest"}
              />
            </Box>
            <Grid container spacing={6}>
              <DataMapper
                data={meetings}
                Component={MeetingCard}
                emptyStateComponent={
                  <EmptyState title="No meetings request found" />
                }
                loading={isMeetingListLoading}
                getKey={(item) => item.id}
                componentProps={(meeting) => ({
                  isProvider: true,
                  id: meeting.id,
                  topic: meeting.topic,
                  startTime: meeting.startTime,
                  zoomUrl: meeting.zoomUrl,
                  createAt: meeting.createAt,
                  meetingNumber: meeting.meetingNumber,
                  handleAcceptMeetingRequest: () =>
                    handleAcceptMeetingRequest(meeting.id),
                  handleRejectMeetingRequest: () =>
                    handleRejectMeetingRequest(meeting.id),
                  isAccepting: acceptingMeetings[meeting.id],
                  joinMeeting: () => {
                    window.open(meeting.zoomUrl, "_blank");
                  },
                  isRejecting: isRejectMeetingRequest[meeting.id],
                })}
              />
            </Grid>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </SellerWrapper>
  );
};

export default RequestDetail;

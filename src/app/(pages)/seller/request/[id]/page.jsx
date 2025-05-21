"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../../components/SellerWrapper";
import { TbArrowLeft, TbLayoutList, TbCalendarTime } from "react-icons/tb";
import { FootTypo } from "@/app/components/ui/Typography";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatDate } from "@/app/helpers";
import { FaBarcode } from "react-icons/fa";
import { CgCalendarDates } from "react-icons/cg";
import { RiMailLine, RiMessage2Line } from "react-icons/ri";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { BodyTypo } from "@/app/components/ui/Typography";
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

const RequestDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [acceptingMeetings, setAcceptingMeetings] = useState({});
  const [isRejectMeetingRequest, setIsRejectMeetingRequestPending] = useState(
    {}
  );
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);

  const addContactMutation = useAddContact();

  const { onOpen } = useChatBox();
  const { setSelectedReceiver } = useChat();

  const { data: bookingsData, isLoading: isBookingLoading } =
    useGetBookingDetailForProvider(id);

  const {
    data: meetingList,
    isLoading: isMeetingListLoading,
    refetch: refetchMeetingList,
  } = useGetMeetingListForProvider(id);

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
        <Skeleton variant="rectangular" height={600} />
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
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>

      <div className="flex items-center my-6">
        <TbLayoutList size={28} className="mr-2" />
        <BodyTypo bodylabel="Request Details" className="text-xl" />
        <RefreshButton
          onRefresh={refetchMeetingList}
          isLoading={isMeetingListLoading}
          tooltip="Refresh meeting list"
        />
      </div>

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
            <div className="flex items-center justify-center gap-2 ">
              <TbCalendarTime size={18} />
              <FootTypo footlabel="Meeting Request" />
            </div>
          </Tab>
        </TabList>

        <TabPanels className="mt-10 relative overflow-hidden">
          <TabPanel className="animate-tab-fade-in">
            {/* Request Details Panel */}

            <Grid container spacing={3} mb={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BorderBox className="flex flex-col gap-2 border shadow-xl h-full">
                  <FootTypo footlabel="Information" fontWeight="bold" />
                  <div className="flex flex-row gap-3 items-center">
                    <FaBarcode size={20} />
                    <FootTypo footlabel="Booking Code" />
                    <FootTypo footlabel={id} className=" underline" />
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <CgCalendarDates size={20} />
                    <FootTypo footlabel="Requested survey date" />
                    <FootTypo
                      footlabel={formatDate(bookingsData.surveyDate)}
                      className="underline"
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center text-rose-500">
                    <PiSealWarning size={20} />
                    <FootTypo footlabel="Please be aware that the survey date can't exceed than requested date!" />
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <HiOutlineStatusOnline size={20} />
                    <FootTypo footlabel="Status" />
                    <StatusChip status={bookingsData.status} isBooking={true} />
                  </div>
                </BorderBox>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BorderBox className="flex flex-col gap-2 border shadow-xl h-full">
                  <FootTypo
                    footlabel="Customer Information"
                    fontWeight="bold"
                  />
                  <div className="flex flex-row gap-3 items-center">
                    <Avatar
                      userImg={bookingsData.customer.avatar}
                      alt={bookingsData.customer.fullName}
                      w={40}
                      h={40}
                    />
                    <FootTypo footlabel={bookingsData.customer.fullName} />
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <RiMailLine size={20} />
                    <FootTypo footlabel="Contact" />
                    <FootTypo
                      footlabel={bookingsData.customer.email}
                      className="underline"
                    />
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <IoLocationOutline size={20} />
                    <FootTypo footlabel="Location" />
                    <FootTypo
                      footlabel={bookingsData.address}
                      className="underline"
                    />
                  </div>
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
                <div className="flex flex-row gap-3 items-center">
                  <FootTypo footlabel="Requested on:" />
                  <FootTypo footlabel={formatDate(cancelDetails?.createdAt)} />
                </div>
                <div className="flex justify-between mt-2 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-red font-semibold">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <PiSealWarning size={24} />
                      <FootTypo footlabel="Reason for Cancellation" />
                      <FootTypo
                        footlabel={
                          cancelDetails?.cancelTypeName ||
                          "No specific reason provided by the customer."
                        }
                      />
                    </div>
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
                  </div>

                  <div className="flex flex-row gap-3 items-center">
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
                  </div>
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
                <div className="flex flex-row gap-3 items-center">
                  <FootTypo footlabel="Service name" />
                  <FootTypo
                    footlabel={bookingsData.decorService.style}
                    className="underline"
                  />
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <FootTypo footlabel="Service Start Date" />
                  <FootTypo
                    footlabel={formatDate(bookingsData.decorService.startDate)}
                    className="underline"
                  />
                </div>

                {bookingsData.bookingDetails.length > 0 ? (
                  <div className="flex flex-col gap-4 ">
                    {bookingsData.bookingDetails.map((detail, index) => (
                      <div
                        key={detail.id}
                        className="flex flex-col gap-2 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <FootTypo footlabel={detail.serviceItem} />
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                          <FootTypo footlabel="Cost:" />
                          <FootTypo footlabel={formatCurrency(detail.cost)} />
                        </div>
                      </div>
                    ))}
                  </div>
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
                              <Typography fontWeight="medium">
                                {bookingsData.bookingForm.roomSize}
                              </Typography>
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

                        {bookingsData.bookingForm?.accountId !== undefined && (
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
                                {bookingsData.bookingForm.accountId}
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
                              Uploaded Images (
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
                                        width={1000}
                                        height={1000}
                                        className="object-contain"
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
              </BorderBox>
            )}
          </TabPanel>

          <TabPanel className="animate-tab-slide-right">
            {/* Meeting Request Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
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
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </SellerWrapper>
  );
};

export default RequestDetail;

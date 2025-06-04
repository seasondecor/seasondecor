"use client";

import React, { useState } from "react";
import Container from "@/app/components/layouts/Container";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Button from "@/app/components/ui/Buttons/Button";
import { TbMessageReportFilled, TbTicket } from "react-icons/tb";
import { PiWarningCircleFill } from "react-icons/pi";
import { useGetPaginatedBookingsForCustomer } from "@/app/queries/list/booking.list.query";
import { formatDateTime, formatDateVN } from "@/app/helpers";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Alert,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { useGetListTicketType } from "@/app/queries/list/ticket.list.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import OpenedTab from "./components/OpenedTab";
import { useCreateTicket } from "@/app/queries/support/support.query";
import ScrollToTop from "@/app/components/ScrollToTop";
import { IoIosCheckmarkCircle, IoIosSend } from "react-icons/io";
import { useUser } from "@/app/providers/userprovider";
import { motion } from "framer-motion";

const SupportPage = () => {
  const { user } = useUser();
  const [selectedBooking, setSelectedBooking] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      description: "",
      ticketTypeId: "",
      bookingCode: "",
      attachments: [],
    },
  });

  const { data: bookingsData, isLoading } = useGetPaginatedBookingsForCustomer({
    status: "11",
    pageSize: 100,
  });

  const { data: ticketTypesData, isLoading: isTicketTypesLoading } =
    useGetListTicketType();

  const createTicketMutation = useCreateTicket();

  const completedBookings = bookingsData?.data || [];

  const onSubmit = (data) => {
    // Prevent submitting if already processing or max tickets reached
    if (submitting || createTicketMutation.isPending) return;

    try {
      setSubmitting(true);

      // Prepare form data for multipart/form-data submission
      const formData = new FormData();

      // Add text fields
      formData.append("Subject", data.subject || "");
      formData.append("Description", reportMessage || "");
      formData.append("TicketTypeId", selectedTicketType || "");

      if (selectedBooking) {
        const bookingDetails = completedBookings.find(
          (b) => b.bookingId === selectedBooking
        );
        if (bookingDetails) {
          formData.append("BookingCode", bookingDetails.bookingCode || "");
        }
      }

      // Add attachments if any
      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          if (file && file instanceof File) {
            formData.append("Attachments", file);
          }
        });
      }

      // Log the form data for debugging
      console.log("Submitting ticket with:", {
        Subject: data.subject,
        Description: reportMessage,
        TicketTypeId: selectedTicketType,
        BookingCode: selectedBooking
          ? completedBookings.find((b) => b.bookingId === selectedBooking)
              ?.bookingCode
          : "",
        Attachments: attachments.map((a) => a.name),
      });

      createTicketMutation.mutate(formData, {
        onSuccess: (response) => {
          console.log("Ticket created successfully:", response);
          setSubmitting(false);
          setSubmitted(true);
          // Reset form
          reset();
          setSelectedBooking("");
          setReportMessage("");
          setSelectedTicketType("");
          setAttachments([]);

          setTimeout(() => {
            setSubmitted(false);
          }, 5000);
        },
        onError: (error) => {
          console.error("Error creating ticket:", error);
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmitting(false);
    }
  };

  // Find the selected booking details
  const selectedBookingDetails = completedBookings.find(
    (b) => b.bookingId === selectedBooking
  );

  const handleFileChange = (uploadedImages) => {
    setAttachments(uploadedImages);
    setValue(
      "attachments",
      uploadedImages.map((img) => img.url)
    );
    //console.log("Uploaded Images:", uploadedImages);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `
            linear-gradient(132deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0) 100%),
            linear-gradient(217deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 100%),
            linear-gradient(271deg, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0) 100%),
            linear-gradient(336deg, rgba(129, 140, 248, 0.1) 0%, rgba(129, 140, 248, 0) 100%)
          `,
        }}
      />

      {/* Subtle Pattern Overlay */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />

      <Container>
        <div className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="relative">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
                Support Center
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                We are here to help with any questions or issues you might have.
                Choose from the options below or contact us directly.
              </p>
            </div>

            {/* Support Features */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                {
                  icon: "🔒",
                  title: "Secure Support",
                  desc: "Your data is protected",
                },
                {
                  icon: "⚡",
                  title: "Fast Response",
                  desc: "Quick resolution time",
                },
                {
                  icon: "👥",
                  title: "Expert Team",
                  desc: "Professional assistance",
                },
                {
                  icon: "🌟",
                  title: "Quality Service",
                  desc: "Satisfaction guaranteed",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Support Form/Login */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!user ? (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-blue-500 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Sign In Required
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Please sign in to submit support tickets and view your
                    existing tickets.
                  </p>
                  <Button
                    label="Sign In / Register"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
                    onClick={() => (window.location.href = "/login")}
                  />
                </div>
              </div>
            ) : (
              <BorderBox className="overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-xl">
                <TabGroup>
                  <TabList className="flex space-x-1 p-1">
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 animate-tab-slide-right
                        ${
                          selected
                            ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                            : "hover:bg-white/[0.12] hover:text-primary"
                        }`
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <PiWarningCircleFill size={18} />
                        <FootTypo footlabel="Problem" />
                      </div>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 animate-tab-slide-left
                        ${
                          selected
                            ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                            : "hover:bg-white/[0.12] hover:text-primary"
                        }`
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <TbMessageReportFilled size={18} />
                        <FootTypo footlabel="Your Tickets" />
                      </div>
                    </Tab>
                  </TabList>

                  <TabPanels className="py-6">
                    <TabPanel>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {submitted ? (
                          <div className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto bg-green rounded-full flex items-center justify-center mb-4">
                              <IoIosCheckmarkCircle size={40} color="white" />
                            </div>
                            <BodyTypo
                              bodylabel="Ticket Submitted"
                              fontWeight="bold"
                            />
                            <FootTypo
                              footlabel="Thank you for your report. Our provider will review your issue and respond shortly."
                              className="text-gray-600 dark:text-gray-300"
                            />
                          </div>
                        ) : (
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" flexDirection="column" gap={2}>
                              <FootTypo footlabel="Subject" fontWeight="bold" />
                              <TextField
                                fullWidth
                                variant="outlined"
                                {...register("subject", {
                                  required: "Subject is required",
                                })}
                                className="bg-white rounded-md"
                                placeholder="Enter a subject for your ticket"
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                              />
                            </Box>

                            <Box display="flex" flexDirection="column" gap={2}>
                              {isLoading ? (
                                <div className="flex justify-center items-center h-12">
                                  <CircularProgress size={24} />
                                </div>
                              ) : completedBookings.length === 0 ? (
                                <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                                  <FootTypo
                                    footlabel="You don't have any completed services to report."
                                    className="text-gray-500 dark:text-gray-400"
                                  />
                                </div>
                              ) : (
                                <FormControl
                                  fullWidth
                                  variant="outlined"
                                  className="bg-white rounded-md"
                                >
                                  <InputLabel
                                    id="booking-select-label"
                                    className="p-2 rounded-md"
                                  >
                                    Select Service
                                  </InputLabel>
                                  <Select
                                    labelId="booking-select-label"
                                    label="Select Service"
                                    id="booking-select"
                                    value={selectedBooking}
                                    onChange={(e) =>
                                      setSelectedBooking(e.target.value)
                                    }
                                    MenuProps={{
                                      disableScrollLock: true,
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>None (General Inquiry)</em>
                                    </MenuItem>
                                    {completedBookings.map((booking) => (
                                      <MenuItem
                                        key={booking.bookingId}
                                        value={booking.bookingId}
                                      >
                                        {booking.decorService.style} -{" "}
                                        {booking.bookingCode} (
                                        {formatDateVN(booking.createdAt)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            </Box>

                            {selectedBookingDetails && (
                              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={2}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Service"
                                      fontWeight="bold"
                                    />
                                    <FootTypo
                                      footlabel={
                                        selectedBookingDetails.decorService
                                          .style
                                      }
                                    />
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Status"
                                      fontWeight="bold"
                                    />
                                    <StatusChip
                                      status={selectedBookingDetails.status}
                                      isBooking
                                    />
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Provider"
                                      fontWeight="bold"
                                    />
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <Avatar
                                        userImg={
                                          selectedBookingDetails.provider.avatar
                                        }
                                        w={20}
                                        h={20}
                                      />

                                      <FootTypo
                                        footlabel={
                                          selectedBookingDetails.provider
                                            .businessName
                                        }
                                      />
                                    </Box>
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Booking Code"
                                      fontWeight="bold"
                                    />
                                    <FootTypo
                                      footlabel={
                                        selectedBookingDetails.bookingCode
                                      }
                                    />
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Requested On"
                                      fontWeight="bold"
                                    />
                                    <FootTypo
                                      footlabel={formatDateVN(
                                        selectedBookingDetails.createdAt
                                      )}
                                    />
                                  </Box>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <FootTypo
                                      footlabel="Service Completed On"
                                      fontWeight="bold"
                                    />
                                    <Alert severity="success" color="success">
                                      {
                                        formatDateTime(
                                          selectedBookingDetails.completeDate
                                        ).date
                                      }{" "}
                                      at{" "}
                                      {
                                        formatDateTime(
                                          selectedBookingDetails.completeDate
                                        ).time
                                      }
                                    </Alert>
                                  </Box>
                                </Box>
                              </div>
                            )}

                            <Box display="flex" flexDirection="column" gap={2}>
                              {isTicketTypesLoading ? (
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  height="120px"
                                >
                                  <CircularProgress size={24} />
                                </Box>
                              ) : !ticketTypesData ||
                                ticketTypesData.length === 0 ? (
                                <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
                                  <FootTypo footlabel="No issue types available." />
                                </div>
                              ) : (
                                <>
                                  <Alert variant="outlined" severity="info">
                                    Select the issue type that best describes
                                    your problem.
                                  </Alert>
                                  <FormControl
                                    fullWidth
                                    variant="outlined"
                                    className="bg-white rounded-md"
                                    error={!!errors.ticketTypeId}
                                  >
                                    <InputLabel
                                      id="ticket-type-label"
                                      className="p-2 rounded-md"
                                    >
                                      Issue Type
                                    </InputLabel>
                                    <Controller
                                      name="ticketTypeId"
                                      control={control}
                                      rules={{
                                        required: "Issue type is required",
                                      }}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          labelId="ticket-type-label"
                                          id="ticket-type-select"
                                          value={selectedTicketType}
                                          label="Issue Type"
                                          onChange={(e) => {
                                            setSelectedTicketType(
                                              e.target.value
                                            );
                                            field.onChange(e.target.value);
                                          }}
                                          MenuProps={{
                                            disableScrollLock: true,
                                          }}
                                          required
                                        >
                                          {ticketTypesData.map((type) => (
                                            <MenuItem
                                              key={type.id}
                                              value={type.id}
                                            >
                                              <div className="flex items-center gap-2">
                                                <TbTicket
                                                  size={18}
                                                  className="text-primary"
                                                />
                                                {type.type}
                                              </div>
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      )}
                                    />
                                    {errors.ticketTypeId && (
                                      <div className="text-red text-sm mt-1">
                                        {errors.ticketTypeId.message}
                                      </div>
                                    )}
                                  </FormControl>
                                </>
                              )}
                            </Box>

                            <Box display="flex" flexDirection="column" gap={2}>
                              <FootTypo
                                footlabel="Describe more about your issue"
                                fontWeight="bold"
                              />
                              <TextField
                                fullWidth
                                variant="outlined"
                                value={reportMessage}
                                onChange={(e) => {
                                  setReportMessage(e.target.value);
                                }}
                                className="bg-white rounded-md"
                                placeholder="Please describe the issue you're experiencing..."
                                multiline
                                rows={5}
                                required
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                {...register("description", {
                                  required: "Description is required",
                                  onChange: (e) =>
                                    setReportMessage(e.target.value),
                                })}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: "rgb(209 213 219)",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "rgb(156 163 175)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "var(--color-primary)",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "rgb(17 24 39)",
                                  },
                                  "& .MuiInputBase-input:focus": {
                                    boxShadow: "none",
                                  },
                                  borderRadius: "0.375rem",
                                }}
                              />
                            </Box>

                            <Box display="flex" flexDirection="column" gap={2}>
                              <FootTypo
                                footlabel="Attachments (optional)"
                                fontWeight="bold"
                              />

                              <ImageUpload
                                onImageChange={handleFileChange}
                                multiple={true}
                                accept="image/*,.pdf,.doc,.docx"
                                maxNumber={5}
                                dontSubmitForm={true}
                              />
                              <div className="text-xs text-gray-500 mt-2">
                                Max 5 files, 5MB each
                              </div>
                            </Box>

                            <Button
                              icon={<IoIosSend size={18} />}
                              onClick={handleSubmit(onSubmit)}
                              label={
                                createTicketMutation.isPending || submitting
                                  ? "Submitting..."
                                  : "Submit Ticket"
                              }
                              className="w-fit self-end bg-action text-white"
                              isLoading={
                                createTicketMutation.isPending || submitting
                              }
                              disabled={
                                createTicketMutation.isPending ||
                                submitting ||
                                !selectedTicketType
                              }
                              type="button"
                            />
                          </Box>
                        )}
                      </Box>
                    </TabPanel>

                    <TabPanel>
                      <OpenedTab />
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </BorderBox>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
};

export default SupportPage;

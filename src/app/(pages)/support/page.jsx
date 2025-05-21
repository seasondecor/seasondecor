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
import { formatDateVN } from "@/app/helpers";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { useGetListTicketType } from "@/app/queries/list/ticket.list.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import OpenedTab from "./components/OpenedTab";
import { useCreateTicket } from "@/app/queries/support/support.query";
import ScrollToTop from "@/app/components/ScrollToTop";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useUser } from "@/app/providers/userprovider";

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
    <div className="min-h-screen">
      <ScrollToTop />
      <Container>
        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 justify-start">
            <BodyTypo
              bodylabel="Support Center"
              fontWeight="bold"
            />
            <FootTypo
              footlabel="We are here to help with any questions or issues you might have. Choose from the options below or contact us directly."
              className="max-w-md"
            />
          </div>

          {!user ? (
            <div className="flex flex-col items-center justify-center p-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
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
              <BodyTypo
                bodylabel="Sign In Required"
                className="text-xl font-semibold mb-3"
              />
              <FootTypo
                footlabel="Please sign in to submit support tickets and view your existing tickets."
                className="text-center text-gray-600 dark:text-gray-400 mb-6"
              />
              <Button
                label="Sign In / Register"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2"
                onClick={() => (window.location.href = "/login")}
              />
            </div>
          ) : (
            <BorderBox className="p-0 overflow-hidden">
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
                      <FootTypo
                        footlabel="Problem"
                        className="!m-0 dark:text-white"
                      />
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
                      <FootTypo
                        footlabel="Your Tickets"
                        className="!m-0 dark:text-white"
                      />
                    </div>
                  </Tab>
                </TabList>

                <TabPanels className="py-6">
                  <TabPanel>
                    <div className="flex flex-col gap-6 px-6">
                      {submitted ? (
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mb-4">
                            <IoIosCheckmarkCircle
                              size={40}
                              className="text-green"
                            />
                          </div>
                          <BodyTypo
                            bodylabel="Ticket Submitted"
                            className="text-xl font-semibold mb-2"
                          />
                          <FootTypo
                            footlabel="Thank you for your report. Our provider will review your issue and respond shortly."
                            className="text-gray-600 dark:text-gray-300"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-2 ">
                            <label className="font-medium">Subject</label>
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
                          </div>

                          <div className="flex flex-col gap-2">
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
                          </div>

                          {selectedBookingDetails && (
                            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <FootTypo
                                    footlabel="Service"
                                    className="font-medium"
                                  />
                                  <FootTypo
                                    footlabel={
                                      selectedBookingDetails.decorService.style
                                    }
                                  />
                                </div>
                                <div className="flex justify-between">
                                  <FootTypo
                                    footlabel="Status"
                                    className="font-medium"
                                  />
                                  <StatusChip
                                    status={selectedBookingDetails.status}
                                    isBooking
                                  />
                                </div>
                                <div className="flex justify-between">
                                  <FootTypo
                                    footlabel="Provider"
                                    className="font-medium"
                                  />
                                  <span className="flex flex-row gap-2 items-center">
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
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <FootTypo
                                    footlabel="Booking Code"
                                    className="font-medium"
                                  />
                                  <FootTypo
                                    footlabel={
                                      selectedBookingDetails.bookingCode
                                    }
                                  />
                                </div>
                                <div className="flex justify-between">
                                  <FootTypo
                                    footlabel="Completed On"
                                    className="font-medium"
                                  />
                                  <FootTypo
                                    footlabel={formatDateVN(
                                      selectedBookingDetails.updatedAt ||
                                        selectedBookingDetails.createdAt
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            <label className="font-medium">Issue Type</label>
                            {isTicketTypesLoading ? (
                              <div className="flex justify-center items-center h-12">
                                <CircularProgress size={24} />
                              </div>
                            ) : !ticketTypesData ||
                              ticketTypesData.length === 0 ? (
                              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
                                <FootTypo footlabel="No issue types available." />
                              </div>
                            ) : (
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
                                  rules={{ required: "Issue type is required" }}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      labelId="ticket-type-label"
                                      id="ticket-type-select"
                                      value={selectedTicketType}
                                      onChange={(e) => {
                                        setSelectedTicketType(e.target.value);
                                        field.onChange(e.target.value);
                                      }}
                                      label="Issue Type"
                                      MenuProps={{
                                        disableScrollLock: true,
                                      }}
                                      required
                                    >
                                      {ticketTypesData.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
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
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors.ticketTypeId.message}
                                  </div>
                                )}
                              </FormControl>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-medium">
                              Describe Your Issue
                            </label>
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={reportMessage}
                              onChange={(e) => {
                                setReportMessage(e.target.value);
                                // Also update the form's internal state
                                register("description").onChange(e);
                              }}
                              className="bg-white rounded-md"
                              placeholder="Please describe the issue you're experiencing..."
                              multiline
                              rows={5}
                              required
                              error={!!errors.description}
                              helperText={errors.description?.message}
                              inputProps={{
                                ...register("description", {
                                  required: "Description is required",
                                  onChange: (e) =>
                                    setReportMessage(e.target.value),
                                }),
                              }}
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
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-medium">
                              Attachments (optional)
                            </label>
                            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
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
                            </div>
                          </div>

                          <Button
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
                        </div>
                      )}
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <OpenedTab />
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </BorderBox>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SupportPage;

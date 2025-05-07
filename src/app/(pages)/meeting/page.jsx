"use client";

import React, { useState } from "react";
import Container from "@/app/components/layouts/Container";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaVideo, FaArrowRight } from "react-icons/fa";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { CiBarcode } from "react-icons/ci";
import { useGetMeetingListForCustomer } from "@/app/queries/meeting/meeting.query";
import { toast } from "sonner";
import MeetingCard from "@/app/components/ui/card/MeetingCard";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";

const MeetingPage = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetings, setMeetings] = useState(null);
  const [verifiedBookingCode, setVerifiedBookingCode] = useState("");
  const router = useRouter();

  // Get the mutation hook for verifying the booking code
  const { mutate: verifyBookingCode, isPending } = useGetMeetingListForCustomer(
    {
      pageIndex: 1,
      pageSize: 10,
    }
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    setIsSubmitting(true);
    setMeetings(null); // Reset meetings when submitting a new code

    // Call the mutation with the booking code
    verifyBookingCode(
      { bookingCode: bookingCode.trim() },
      {
        onSuccess: (data) => {
          if (
            data &&
            (data.data?.length > 0 || (Array.isArray(data) && data.length > 0))
          ) {
            // Store meetings data and booking code
            const meetingsData = data.data || data;
            setMeetings(meetingsData);
            setVerifiedBookingCode(bookingCode.trim());

            // Store in session storage for potential future use
            sessionStorage.setItem("meeting_verification", bookingCode.trim());

            // Success message
            toast.success(
              `Found ${meetingsData.length} meetings for this booking code`
            );
          } else {
            // No meetings found for this booking code
            toast.error("No meetings found for this booking code");
          }
          setIsSubmitting(false);
        },
        onError: (error) => {
          // Show error toast
          toast.error(error?.message || "Failed to verify booking code");
          setIsSubmitting(false);
        },
      }
    );
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Animation for list items
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <Container>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="inline-block bg-blue-500 p-6 rounded-full mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaVideo className="text-white text-5xl" />
          </motion.div>
          <BodyTypo
            bodylabel="Meeting Request Portal"
            className="text-3xl font-bold mb-3"
          />
          <FootTypo
            footlabel={
              meetings
                ? `Viewing meetings for booking code: ${verifiedBookingCode}`
                : "Enter your booking code to view your meetings"
            }
            className="text-gray-600 dark:text-gray-300 max-w-md mx-auto"
          />
        </motion.div>

        {!meetings && (
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md"
            variants={itemVariants}
          >
            <div className="relative mb-8">
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CiBarcode />
              </motion.div>
              <motion.input
                type="text"
                placeholder="Enter your booking code (e.g., BKG123)"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors duration-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                initial={{ width: "70%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                required
              />
            </div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                label="View Meetings"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-transform duration-300 flex items-center justify-center gap-2"
                icon={<FaArrowRight />}
                isLoading={isSubmitting || isPending}
              />
            </motion.div>
          </motion.form>
        )}

        <AnimatePresence>
          {meetings && (
            <>
              <motion.div
                className="w-full mb-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Meetings</h2>
                  <Button
                    label="New Search"
                    onClick={() => {
                      setMeetings(null);
                      setBookingCode("");
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  />
                </div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <DataMapper
                    data={meetings}
                    Component={MeetingCard}
                    emptyStateComponent={
                      <EmptyState title="No meetings found" />
                    }
                    loading={isPending}
                    getKey={(item) => item.id}
                    componentProps={(meeting) => ({
                      id: meeting.id,
                      topic: meeting.topic || "Meeting",
                      startTime: meeting.startTime,
                      zoomUrl: meeting.zoomUrl,
                      createAt: meeting.createAt,
                      meetingNumber: meeting.meetingNumber,
                      status: meeting.status,
                      isCustomer: true,
                      joinMeeting: () => {
                        window.open(meeting.zoomUrl, "_blank");
                      },
                    })}
                  />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {!meetings && (
          <motion.div
            className="mt-12 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md w-full"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
              Why use the Meeting Portal?
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>
                  Schedule virtual meetings with your service provider
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>View and manage all your upcoming meetings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>Join Zoom meetings directly from our platform</span>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default MeetingPage;

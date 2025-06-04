"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency, formatDateTime } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateVN } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { TbCancel } from "react-icons/tb";
import {
  MdErrorOutline,
  MdCalendarToday,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import Avatar from "../Avatar/Avatar";
import ReviewButton from "../Buttons/ReviewButton";
import FlipButton from "../Buttons/FlipButton";
import { Divider, Box, Alert } from "@mui/material";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { RiArrowDropRightLine, RiSurveyLine } from "react-icons/ri";
import { SiZoom } from "react-icons/si";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BookingCard = ({
  providerAvatar,
  providerName,
  serviceName,
  surveyDate,
  bookingCode,
  status,
  address,
  totalPrice = 0,
  createdDate,
  isPending,
  isPlanning,
  isContracting,
  detailClick,
  cancelClick,
  isCancelled,
  isQuoteExist,
  isDepositPaid,
  isInTransit,
  isProgressing,
  isAllDone,
  isFinalPaid,
  isCommitDepositPaid,
  isPendingCancel,
  isTracked,
  trackingNavigate,
  isCompleted,
  isReviewed,
  hasTerminated,
  handleReview,
  completeDate,
  isSigned,
  commitDepositClick,
  meetingClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(bookingCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const getStatusMessage = () => {
    // Cancelled states (highest priority)
    if (hasTerminated) {
      return (
        <FootTypo
          footlabel="The request has been cancelled due to contract termination"
          className="text-red"
        />
      );
    }
    if (isCancelled) {
      return (
        <FootTypo
          footlabel="The request has been canceled"
          className="text-red"
        />
      );
    }

    if (isPendingCancel) {
      return "Your cancellation request is pending";
    }

    // Completed states
    if (isCompleted) {
      if (isReviewed) {
        return (
          <FlipButton
            onClick={trackingNavigate}
            first="View Booking"
            second="View Booking"
          />
        );
      }
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <ReviewButton onClick={handleReview} />
          <Divider orientation="vertical" flexItem />
          <FlipButton
            onClick={trackingNavigate}
            first="View Booking"
            second="View Booking"
          />
        </Box>
      );
    }

    // Tracking state
    if (isTracked) {
      return (
        <FlipButton
          onClick={trackingNavigate}
          first="Your tracking is ready!"
          second="View now"
        />
      );
    }

    // Contract & Payment states
    if (isSigned) {
      return (
        <FootTypo
          footlabel="The contract has been signed"
          className="text-green"
        />
      );
    }

    if (isDepositPaid) {
      return "Your deposit has been paid";
    }

    if (isContracting && isQuoteExist) {
      return "The contract is being processed";
    }

    // Quotation states
    if (isQuoteExist && !isDepositPaid) {
      return "The quotation has been created";
    }

    // Pending & Processing states
    if (!isPending && !isContracting && !isCancelled && !isQuoteExist) {
      return "";
    }

    // Default state (no specific message to show)
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-md transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl ring-1 ring-gray-200/50 dark:text-black`}
    >
      {/* Background gradient effect */}
      <span className="absolute top-[-10px] left-[-20px] z-[1] h-32 w-32 rounded-full bg-gradient-to-r from-primary to-primary-light opacity-75 transition-all duration-500 transform group-hover:scale-[20]" />

      {/* Deposit overlay when isCommitDepositPaid is false */}
      {isCommitDepositPaid === false && status === 1 && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 rounded-2xl">
          <div className="bg-white py-3 px-6 rounded-lg shadow-lg flex flex-col gap-2 items-center max-w-[80%]">
            <FaMoneyCheckDollar size={28} className="text-primary mb-2" />
            <FootTypo
              footlabel="You need to deposit first to continue"
              fontWeight="bold"
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                icon={<RiArrowDropRightLine size={20} />}
                onClick={commitDepositClick}
                label="Procced"
                className="bg-action text-white"
              />
              <Button
                icon={<TbCancel size={20} />}
                onClick={cancelClick}
                label="Cancel"
                className="bg-red text-white"
              />
            </Box>
          </div>
        </div>
      )}

      {/* Card content with relative positioning to stay above the gradient effect */}
      <div
        className={`relative p-4 flex justify-between items-start ${
          isCommitDepositPaid === false && status === 1 ? "opacity-30" : ""
        }`}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <FootTypo
                footlabel={`Booking Request for [${serviceName}]`}
                fontSize="20px"
                fontWeight="bold"
              />
              {completeDate && (
                <Alert severity="success" sx={{ borderRadius: "20px" }}>
                  Service completed on {formatDateTime(completeDate).date} at{" "}
                  {formatDateTime(completeDate).time}
                </Alert>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <FootTypo footlabel="Created at" />
              <MdCalendarToday size={18} />
              <FootTypo footlabel={formatDateVN(createdDate)} />
            </Box>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <FootTypo footlabel="Survey Date" />
              <RiSurveyLine size={18} />
              <FootTypo footlabel={formatDateVN(surveyDate)} />
            </Box>
          </Box>

          <FootTypo footlabel={address} />

          <Box display="flex" alignItems="center" gap={1}>
            <FootTypo footlabel="Provider" fontWeight="bold" />

            <Avatar
              userImg={providerAvatar}
              alt="Provider Avatar"
              w={32}
              h={32}
            />

            <FootTypo footlabel={providerName} fontWeight="bold" />
          </Box>
          <Box display="flex" alignItems="center" gap={3}>
            <button
              onClick={detailClick}
              className="text-primary text-sm font-medium underline mt-1 self-start transition-all duration-500 z-[1]"
            >
              View Details
            </button>
            {!isPending &&
            !isInTransit &&
            !isProgressing &&
            !isAllDone &&
            !isFinalPaid &&
            !isCompleted &&
            !isCancelled ? (
              <button
                onClick={meetingClick}
                className="flex bg-action text-white px-2 py-1 rounded-md hover:bg-primary items-center gap-1 text-sm font-medium self-start transition-all duration-500 z-[1]"
              >
                <SiZoom size={25} />
                Request Meeting
              </button>
            ) : (
              <div></div>
            )}
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2} alignItems="end">
          <Box display="flex" alignItems="center">
            <FootTypo
              footlabel={bookingCode}
              className="bg-primary px-3 py-1 rounded-l-full font-medium transition-all duration-500"
              fontSize="14px"
            />
            <button
              onClick={copyToClipboard}
              className="bg-action px-3 py-1 rounded-r-full text-white transition-all duration-300 relative z-[1]"
              aria-label="Copy booking code"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MdCheck size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MdContentCopy size={20} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50"
                  >
                    Copied to clipboard!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="end"
            gap={2}
            mt={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <FootTypo footlabel="Total Price" />
              {totalPrice > 0 ? (
                <FootTypo
                  footlabel={`${formatCurrency(totalPrice)}`}
                  fontWeight="bold"
                />
              ) : (
                <FootTypo footlabel="Processing..." fontStyle="italic" />
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <FootTypo footlabel="Status" />
              <div className="transition-all duration-500">
                <StatusChip status={status} isBooking={true} />
              </div>
            </Box>

            {statusMessage && (
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                {!isTracked && !isReviewed && !isCancelled ? (
                  <MdErrorOutline
                    size={16}
                    className="transition-all duration-500"
                  />
                ) : null}
                <FootTypo footlabel={statusMessage} component="span" />
              </Box>
            )}
          </Box>

          {(isPending || isPlanning) && (
            <Button
              label="Cancel request"
              onClick={cancelClick}
              className="bg-red text-white z-[2] w-fit"
              icon={<TbCancel size={16} />}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default BookingCard;

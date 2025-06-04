"use client";

import React from "react";
import { formatDateTime } from "@/app/helpers";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";
import Button from "../Buttons/Button";
import { BiTimeFive } from "react-icons/bi";
import { Alert, Box } from "@mui/material";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";

const MeetingCard = ({
  id,
  topic,
  startTime,
  zoomUrl,
  createAt,
  meetingNumber,
  status,
  handleAcceptMeetingRequest,
  handleRejectMeetingRequest,
  isAccepting,
  isRejecting,
  isProvider = false,
  joinMeeting,
}) => {
  const formattedStartTime = startTime
    ? formatDateTime(startTime)
    : { date: "No date", time: "No time" };
  const formattedCreateAt = createAt
    ? formatDateTime(createAt)
    : { date: "Unknown", time: "" };

  const getStatusBadge = () => {
    switch (status) {
      case 0:
        return {
          text: `${isProvider ? "Pending" : "Requested"}`,
          bgColor: "bg-yellow",
          hoverBg: "hover:bg-warning",
          hoverText: "hover:text-white",
        };
      case 1:
        return {
          text: "Scheduled",
          bgColor: "bg-blue-500",
          hoverBg: "hover:bg-blue-700",
          hoverText: "hover:text-yellow-300",
        };
      case 2:
        return {
          text: "Started",
          bgColor: "bg-green",
          hoverBg: "hover:bg-success",
          hoverText: "hover:text-white",
        };
      case 3:
        return {
          text: "Ended",
          bgColor: "bg-gray-500",
          hoverBg: "hover:bg-gray-700",
          hoverText: "hover:text-white",
        };
      case 4:
        return {
          text: "Rejected",
          bgColor: "bg-red",
          hoverBg: "hover:bg-rose-700",
          hoverText: "hover:text-white",
        };
      default:
        return {
          text: "Unknown",
          bgColor: "bg-gray-400",
          hoverBg: "hover:bg-gray-600",
          hoverText: "hover:text-white",
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="w-fit h-full flex flex-col border-4 border-black bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#000] duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white transition-shadow hover:shadow-[12px_12px_0_0_#000]">
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        className="text-xs"
      >
        <span className="relative z-10 border-2 border-black bg-blue-500 px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out hover:bg-blue-700 hover:text-yellow-300">
          Meeting #{id}
        </span>
        <span
          className={`relative z-10 border-2 border-black ${statusBadge.bgColor} px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out ${statusBadge.hoverBg} ${statusBadge.hoverText}`}
        >
          {statusBadge.text}
        </span>
      </Box>

      {/* Content Section */}
      <Box flex={1}>
        {/* Title */}
        <h3 className="text-2xl font-black uppercase leading-6 text-black mb-4 line-clamp-2 min-h-[48px] group-hover:text-red-500 transition-all duration-500 ease-in-out hover:text-blue-800">
          {topic || "Meeting Topic"}
        </h3>

        {/* Date & Time Info */}
        <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500 flex flex-col gap-2 mb-4">
          <Box display="flex" alignItems="center" gap={1}>
            <FaCalendarAlt className="text-black" />
            <span className="font-bold text-gray-800">
              {formattedStartTime.date}
            </span>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <BiTimeFive className="text-blue-500" />
            <span className="font-bold text-gray-800">
              {formattedStartTime.time}
            </span>
          </Box>
        </div>

        {/* Meeting Link */}
        <div className="border-l-4 border-red-500 pl-4 mb-4">
          {zoomUrl ? (
            <button
              onClick={joinMeeting}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaVideo />
              Join Meeting
            </button>
          ) : (
            <span className="flex items-center gap-2 text-gray-500">
              <FaVideo />
              No meeting link available
            </span>
          )}
        </div>

        {/* Creation Info */}
        <div className="text-sm text-gray-600 mb-2">
          <Box display="flex" alignItems="center" gap={1}>
            <FaClock className="text-gray-500" />
            <span>
              Created: {formattedCreateAt.date} at {formattedCreateAt.time}
            </span>
          </Box>
          <div className="mt-1">
            Meeting Number: {meetingNumber || "Not available"}
          </div>
        </div>
      </Box>

      {/* Action Buttons */}
      {status === 0 && isProvider && (
        <Box display="flex" gap={2} mt={2}>
          <Button
            icon={<IoIosCheckmark size={20} />}
            label="Accept"
            onClick={handleAcceptMeetingRequest}
            isLoading={isAccepting}
            disabled={isAccepting}
            className="flex-1 bg-action text-white"
          />
          <Button
            icon={<IoIosClose size={20} />}
            label="Reject"
            onClick={handleRejectMeetingRequest}
            isLoading={isRejecting}
            disabled={isRejecting}
            className="flex-1 bg-red text-white"
          />
        </Box>
      )}

      {status === 4 && isProvider && (
        <Alert severity="info" color="error">
          Meeting Request Rejected
        </Alert>
      )}
    </div>
  );
};

export default MeetingCard;

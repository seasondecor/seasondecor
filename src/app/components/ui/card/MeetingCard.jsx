"use client";

import React from "react";
import { formatDateTime } from "@/app/helpers";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";
import Button from "../Buttons/Button";
import { BiTimeFive } from "react-icons/bi";

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
  // Use formatDateTime to get formatted date and time separately
  const formattedStartTime = startTime
    ? formatDateTime(startTime)
    : { date: "No date", time: "No time" };
  const formattedCreateAt = createAt
    ? formatDateTime(createAt)
    : { date: "Unknown", time: "" };

  // Function to determine badge style and text based on status
  const getStatusBadge = () => {
    switch (status) {
      case 0:
        return {
          text: `${isProvider ? "Pending" : "Requested"}`,
          bgColor: "bg-yellow",
          hoverBg: "hover:bg-yellow-600",
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
          hoverBg: "hover:bg-green-700",
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
          hoverBg: "hover:bg-red-700",
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
    <div className="flex w-[350px] flex-col items-start justify-between border-4 border-black bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#000] duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white transition-shadow hover:shadow-[12px_12px_0_0_#000]">
      <div className="mb-2 flex items-center gap-x-2 text-xs">
        <span className="relative z-10 border-2 border-black bg-blue-500 px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out hover:bg-blue-700 hover:text-yellow-300">
          Meeting #{id}
        </span>
        <span
          className={`relative z-10 border-2 border-black ${statusBadge.bgColor} px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out ${statusBadge.hoverBg} ${statusBadge.hoverText}`}
        >
          {statusBadge.text}
        </span>
      </div>
      <div className="group relative w-full">
        <h3 className="group-hover:text-red-500 mt-3 text-2xl font-black uppercase leading-6 text-black transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-blue-800">
          <a href="#">
            <span className="absolute inset-0 max-w-xs" />
            {topic || "Meeting Topic"}
          </a>
        </h3>

        {/* Meeting Date and Time Section */}
        <div className="mt-4 bg-gray-100 p-3 rounded-lg border-l-4 border-blue-500 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaCalendarAlt color="black" />
            <span className="font-bold text-gray-800">
              {formattedStartTime.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BiTimeFive className="text-blue-500" />
            <span className="font-bold text-gray-800">
              {formattedStartTime.time}
            </span>
          </div>
        </div>

        <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
          {zoomUrl ? (
            <button
              onClick={joinMeeting}
              className="flex items-center gap-2"
            >
              <FaVideo className="text-blue-500" />
              Join Meeting
            </button>
          ) : (
            <span className="flex items-center gap-2">
              <FaVideo className="text-gray-400" />
              No meeting link available
            </span>
          )}
        </p>
      </div>
      <div className="relative  w-full border-t pt-4">
        <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
          <FaClock className="text-gray-500" />
          Created: {formattedCreateAt.date} {formattedCreateAt.time}
        </div>
        <span className="text-sm leading-6 py-1 text-black">{`Meeting Number: ${
          meetingNumber || "Not available"
        }`}</span>
        {/* Only show accept/reject buttons for requested meetings */}
        {status === 0 && isProvider && (
          <div className="text-sm leading-6 flex items-center gap-x-2">
            <Button
              label="Accept"
              onClick={handleAcceptMeetingRequest}
              isLoading={isAccepting}
              disabled={isAccepting}
              className=" bg-action text-white "
            />
            <Button
              label="Reject"
              onClick={handleRejectMeetingRequest}
              isLoading={isRejecting}
              disabled={isRejecting}
              className=" bg-red text-white "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;

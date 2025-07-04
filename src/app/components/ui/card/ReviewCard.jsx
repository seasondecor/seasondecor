"use client";

import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import { FootTypo } from "@/app/components/ui/Typography";
import { Rating } from "@mui/material";
import { formatDate, formatTimeAgo } from "@/app/helpers";
import Image from "next/image";
import { Box } from "@mui/material";
import { LuDot } from "react-icons/lu";

const ReviewCard = ({
  comment,
  rate,
  createAt,
  images = [],
  username = "User",
  userAvatar = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box className="ReviewCard mb-10">
      <Box className="flex flex-col max-w-[400px]">
        {/* User Info and Date */}
        <Box className="flex items-center gap-3 mb-3">
          <Avatar w={48} h={48} userImg={userAvatar} />
          <div className="flex flex-col">
            <FootTypo footlabel={username || "Anonymous"} fontWeight="bold" />
            <span className="text-sm text-gray-500">
              {formatDate(createAt)}
            </span>
          </div>
        </Box>

        {/* Rating and Date */}
        <Box display="flex" justifyContent="start" alignItems="center">
          <Rating value={rate || 0} readOnly precision={0.5} size="small" />
          <LuDot />
          <FootTypo footlabel={formatTimeAgo(createAt)} fontWeight="bold" />
        </Box>
        <div className="text-sm">
          <p
            className={`whitespace-pre-line break-words ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {comment || "No comment provided."}
          </p>

          {comment && comment.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-bold underline mt-1"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Review Images Grid */}
        {images && images.length > 0 && (
          <Box className="mt-4">
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              {images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 30vw, 120px"
                  />
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReviewCard;

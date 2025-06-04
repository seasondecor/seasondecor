"use client";

import React from "react";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { getOfferingIcon } from "@/app/constant/offering";

/**
 * AmenityOfferings component displays a list of amenities in a 2-column grid
 * with icons, similar to what you'd see in a property listing
 *
 * @param {Object} props
 * @param {Array} props.offerings - Array of offering names
 * @param {String} props.title - Optional title for the offerings section
 */
const AmenityOfferings = ({
  offerings = [],
  title = "What this place offers",
  description = "",
}) => {
  if (!offerings || offerings.length === 0) return null;

  return (
    <div className="w-full">
      <BodyTypo bodylabel={title} fontWeight="bold" className="pb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        {offerings.map((offer, index) => {
          const OfferingIcon = getOfferingIcon(
            typeof offer === "string" ? offer : offer.name
          );
          const offeringName = typeof offer === "string" ? offer : offer.name;
          const isStrikethrough = offeringName === "Carbon monoxide alarm";
          const description = offer.description || "";

          return (
            <div key={index} className="flex flex-col items-start gap-3">
              <div className="flex flex-row items-center gap-3">
                <OfferingIcon size={24} />

                <FootTypo
                  footlabel={offeringName}
                  className={
                    isStrikethrough ? "line-through text-gray-500" : ""
                  }
                />
              </div>
              {description && <FootTypo footlabel={description} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenityOfferings;

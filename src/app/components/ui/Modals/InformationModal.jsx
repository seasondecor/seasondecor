"use client";

import React, { useState } from "react";
import { Checkbox, FormControlLabel, Divider } from "@mui/material";

import Modal from "../Modal";
import Heading from "./components/Heading";
import useInfoModal from "@/app/hooks/useInfoModal";
import { formatDateVN, formatCurrency } from "@/app/helpers";
import { FootTypo } from "../Typography";
import StatusChip from "../statusChip/StatusChip";
import Image from "next/image";
import { getSeasonConfig } from "@/app/helpers";
import { seasons } from "@/app/constant/season";
import Avatar from "../Avatar/Avatar";
import Button from "../Buttons/Button";
import { RiProfileLine } from "react-icons/ri";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";

const InformationModal = () => {
  const [isChecked, setIsChecked] = useState(false);
  const infoModal = useInfoModal();
  const {
    isOrder,
    isBooking,
    isDescription,
    isTerms,
    isContract,
    description,
    title,
    orderCode,
    phoneNumber,
    address,
    orderDate,
    totalPrice,
    status,
    items,
    bookingCode,
    serviceStyle,
    serviceImage,
    serviceName,
    serviceSeason,
    providerImage,
    providerName,
    profileClick,
    chatClick,
    buttonLabel,
    onSubmit,
    viewService,
    contractFilePath,
  } = infoModal.data || {};

  const handleSubmit = () => {
    if (isChecked && onSubmit) {
      onSubmit();
    }
    infoModal.onClose();
  };

  const bodyContent = (
    <div className="flex flex-col gap-6 max-h-[70vh] py-3 overflow-x-hidden">
      <div className="flex items-center">
        <Heading title={title} subtitle="" center={false} />
      </div>

      {isTerms && (
        <div className="mt-2">
          {description && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
              <div className="space-y-5">
                {description.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-medium leading-relaxed text-gray-700 dark:text-gray-200"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      color="primary"
                      sx={{
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                  }
                  label={
                    <span className="text-sm font-medium">
                      I have read and agree to the terms and conditions
                    </span>
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {isOrder && (
        <div className="flex flex-col gap-4 font-semibold">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Order Code"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={orderCode}
                    className="!m-0 text-lg bg-primary text-white px-3 py-1 rounded-lg font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Status"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <StatusChip status={status} />
                </div>

                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Order Date"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={formatDateVN(orderDate)}
                    className="!m-0 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Phone Number"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={phoneNumber}
                    className="!m-0 text-base"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Address"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={address}
                    className="!m-0 text-base max-w-[250px] truncate"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Total Price"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={formatCurrency(totalPrice)}
                    className="!m-0 text-lg font-bold text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-1" />

          <div>
            <FootTypo
              footlabel="Items"
              className="!m-0 text-base font-medium mb-3"
            />

            {/* Order Items List */}
            <div className="space-y-3">
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                        <Image
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.productName || "Product"}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-col flex-grow gap-1">
                        <h3 className="text-base font-semibold line-clamp-2">
                          {item.productName}
                        </h3>
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Quantity:
                            </span>
                            <FootTypo
                              footlabel={item.quantity}
                              className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
                            />
                          </div>
                          <FootTypo
                            footlabel={formatCurrency(item.unitPrice)}
                            className="text-right text-primary font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 italic">
                    No items found in this order
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isBooking && (
        <div className="flex flex-col gap-5 font-semibold">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FootTypo
                    footlabel="Booking Code"
                    className="!m-0 text-sm text-gray-500 dark:text-gray-400"
                  />
                  <FootTypo
                    footlabel={bookingCode}
                    className="!m-0 text-lg bg-primary px-3 py-1 rounded-lg font-medium"
                  />
                </div>
                <StatusChip status={status} isBooking={true} />
              </div>

              <Divider className="my-1" />

              <div className="flex flex-col items-start gap-3">
                <FootTypo
                  footlabel="About the service"
                  className="!m-0 text-base font-medium"
                />
                <FootTypo
                  footlabel={serviceStyle}
                  className="!m-0 text-lg font-bold text-primary bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg self-center"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mt-2">
                  {Array.isArray(serviceImage) ? (
                    serviceImage.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <Image
                          src={image}
                          alt={`${serviceName || "Service"} image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))
                  ) : serviceImage ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={serviceImage}
                        alt={serviceName || "Service image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FootTypo
                footlabel="Suitable for"
                className="!m-0 text-base font-medium"
              />
              <div className="flex flex-wrap gap-2">
                {Array.isArray(serviceSeason) && serviceSeason.length > 0 ? (
                  serviceSeason.map((season, index) => {
                    if (!season || !season.seasonName) return null;
                    const { icon, bgColor } = getSeasonConfig(
                      season.seasonName,
                      seasons
                    );
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium shadow-sm`}
                      >
                        {icon}
                        {season.seasonName}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                    All seasons
                  </span>
                )}
              </div>
            </div>

            <button
              className="text-primary text-left mb-3 flex items-center gap-2 hover:translate-x-3 transition-all duration-300 w-fit font-medium bg-indigo-50 dark:bg-indigo-900/30 rounded-full px-4 py-1.5"
              onClick={viewService}
            >
              <IoIosArrowForward />
              Go to service
            </button>
          </div>

          <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 shadow-sm relative">
            <span className="absolute top-[-10px] left-4 bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
              A service from
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 px-2">
                <Avatar
                  userImg={providerImage}
                  alt={providerName}
                  w={48}
                  h={48}
                />
                <FootTypo
                  footlabel={providerName}
                  className="text-base font-bold"
                />
              </div>

              <Divider
                orientation="vertical"
                flexItem
                className="hidden sm:block"
              />
              <Divider className="sm:hidden my-2" />

              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                <Button
                  label="View Profile"
                  onClick={profileClick}
                  icon={<RiProfileLine size={18} />}
                />
                <Button
                  label="Chat now"
                  onClick={chatClick}
                  icon={<IoChatboxEllipsesOutline size={18} />}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDescription && (
        <div className="mt-2">
          <div
            className="whitespace-pre-line prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-primary"
            dangerouslySetInnerHTML={{ __html: description || "" }}
          />
        </div>
      )}

      {isContract && (
        <div className="h-[800px] flex flex-col rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
          <iframe
            src={contractFilePath}
            className="w-full h-full rounded-md border-0"
            title="Contract PDF"
          />
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={infoModal.isOpen}
      title={title || "Description"}
      secondaryAction={infoModal.onClose}
      onClose={infoModal.onClose}
      actionLabel={buttonLabel}
      onSubmit={handleSubmit}
      body={bodyContent}
      disabled={isTerms && !isChecked}
    />
  );
};

export default InformationModal;

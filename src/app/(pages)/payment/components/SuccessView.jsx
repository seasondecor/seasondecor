"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { TbArrowBack, TbArrowNarrowRight, TbCheck } from "react-icons/tb";
import { formatCurrency } from "@/app/helpers";
import { Box } from "@mui/material";
import { FootTypo } from "@/app/components/ui/Typography";
import { formatDateTime } from "@/app/helpers";
import { LuDot } from "react-icons/lu";

const SuccessView = ({
  paymentType = "order",
  amount = 0,
  orderCode,
  bookingCode,
  providerName,
  providerEmail,
  providerPhone,
  paymentDate,
  paymentStatus = "Completed",
  redirectPath,
  actionLabel = "Go Home",
  handleRedirect,
}) => {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Debug log the received props
  React.useEffect(() => {
    console.log("SuccessView mounted with props:", {
      paymentType,
      amount,
      orderCode,
      bookingCode,
      providerName,
      providerEmail,
      providerPhone,
      paymentDate,
      paymentStatus,
      redirectPath,
      actionLabel,
    });
  }, [
    paymentType,
    amount,
    orderCode,
    bookingCode,
    providerName,
    providerEmail,
    providerPhone,
    paymentDate,
    paymentStatus,
    redirectPath,
    actionLabel,
  ]);

  // Helper functions to dynamically generate content based on payment type
  const getTitle = () => {
    switch (paymentType) {
      case "deposit":
        return "Deposit Payment Successful !";
      case "final":
        return "Final Payment Successful !";
      case "order":
      default:
        return "Order Payment Successful !";
    }
  };

  const getMessage = () => {
    switch (paymentType) {
      case "deposit":
        return "Your deposit has been received. We've notified the property owner about your booking.";
      case "final":
        return "Your final payment has been completed. Your booking is now fully confirmed.";
      case "order":
      default:
        return "Your payment has been processed successfully. We've notified the seller about your order.";
    }
  };

  const getRedirectOptions = () => {
    switch (paymentType) {
      case "deposit":
        return {
          primary: {
            label: "View Booking",
            path: redirectPath || "/booking/request",
            action: () => router.push(redirectPath || "/booking/request"),
          },
          secondary: {
            label: actionLabel || "Go Home",
            action:
              handleRedirect ||
              (() => router.push(redirectPath || "/booking/request")),
          },
        };
      case "final":
        return {
          primary: {
            label: "View Bookings",
            path: redirectPath || "/booking/request",
            action: () => router.push(redirectPath || "/booking/request"),
          },
          secondary: {
            label: actionLabel || "Go Home",
            action:
              handleRedirect ||
              (() => router.push(redirectPath || "/booking/request")),
          },
        };
      case "order":
      default:
        return {
          primary: {
            label: "View Orders",
            path: redirectPath || "/user/orders/completed",
            action: () => router.push(redirectPath || "/user/orders/completed"),
          },
          secondary: {
            label: actionLabel || "Go Home",
            action: handleRedirect || (() => router.push("/")),
          },
        };
    }
  };

  const redirectOptions = getRedirectOptions();

  return (
    <div className="min-h-screen flex justify-center items-center overflow-x-hidden">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={true}
          numberOfPieces={200}
          className="overflow-x-hidden"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
      >
        <div className="p-6 bg-green-50 dark:bg-green-900/30">
          <Box display="flex" justifyContent="center">
            <div className="w-16 h-16 flex items-center justify-center bg-green dark:bg-green rounded-full">
              <TbCheck color="white" size={32} />
            </div>
          </Box>
          <h1 className="text-2xl font-bold text-center mt-4 text-green dark:text-green">
            {getTitle()}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
            {getMessage()}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Payment Information */}
            <Box className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-3">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FootTypo
                  footlabel="Amount Paid"
                  className="text-gray-600 dark:text-gray-300"
                />
                <FootTypo
                  footlabel={formatCurrency(amount || 0)}
                  fontWeight="bold"
                  fontSize="20px"
                  className="text-green-600 dark:text-green-400"
                />
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FootTypo
                  footlabel="Status"
                  className="text-gray-600 dark:text-gray-300"
                />
                <Box
                  sx={{
                    bgcolor: "success.light",
                    px: 2,
                    py: 0.5,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TbCheck size={16} className="text-green-600" />
                  <FootTypo
                    footlabel={paymentStatus || "Completed"}
                    className="text-green-600"
                    fontWeight="medium"
                  />
                </Box>
              </Box>

              {paymentDate && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FootTypo
                    footlabel="Payment Date"
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <Box display="flex" alignItems="center">
                    <FootTypo
                      footlabel={formatDateTime(paymentDate).date}
                      fontWeight="medium"
                    />
                    <LuDot
                      size={16}
                      className="text-gray-600 dark:text-gray-300"
                    />
                    <FootTypo
                      footlabel={formatDateTime(paymentDate).time}
                      fontWeight="medium"
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Transaction Details */}
            <Box className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-3">
              {orderCode && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FootTypo
                    footlabel="Order Code"
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <FootTypo footlabel={orderCode} fontWeight="medium" />
                </Box>
              )}

              {bookingCode && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FootTypo
                    footlabel="Booking Code"
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <FootTypo footlabel={bookingCode} fontWeight="medium" />
                </Box>
              )}

              {/* Provider Information - Only show section if any provider info exists */}
              {(providerName || providerEmail || providerPhone) && (
                <Box className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <FootTypo
                    footlabel="Payment Recipient"
                    className="text-gray-600 dark:text-gray-300 mb-2"
                  />

                  {providerName && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <FootTypo
                        footlabel="Provider Name"
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <FootTypo footlabel={providerName} fontWeight="medium" />
                    </Box>
                  )}

                  {providerEmail && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <FootTypo
                        footlabel="Email"
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <FootTypo footlabel={providerEmail} fontWeight="medium" />
                    </Box>
                  )}

                  {providerPhone && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <FootTypo
                        footlabel="Phone"
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <FootTypo footlabel={providerPhone} fontWeight="medium" />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              label={redirectOptions.primary.label}
              onClick={redirectOptions.primary.action}
              className="w-full"
              icon={<TbArrowNarrowRight size={20} />}
              iconPosition="right"
            />

            <Button
              label={redirectOptions.secondary.label}
              onClick={redirectOptions.secondary.action}
              className="w-full bg-action text-white"
              icon={<TbArrowBack size={20} />}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessView;

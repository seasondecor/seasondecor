"use client";

import React, { useEffect } from "react";
import { useVerifySignature } from "@/app/queries/contract/contract.query";
import { BsClipboard2Check } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PiSealWarning } from "react-icons/pi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";

const SignPage = () => {
  const {
    mutate: verifySignature,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifySignature();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Background circle animation variants
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifySignature(token, {
        onSuccess: () => {
          //console.log("Contract signed successfully:", data);
        },
        onError: () => {
          toast.error("Error signing contract, please try again later");
        },
      });
    } else {
      console.error("No token provided for contract signing");
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background circles */}
      <motion.div
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        variants={circleVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: theme.palette.mode === "dark" ? "rgba(17, 25, 40, 0.75)" : "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
            minWidth: "320px",
            boxShadow: theme.palette.mode === "dark" 
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {isPending ? (
              <>
                <motion.div
                  variants={iconVariants}
                  className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full"
                >
                  <AiOutlineLoading size={40} className="animate-spin text-blue-600 dark:text-blue-400" />
                </motion.div>
                <motion.p variants={textVariants} className="text-lg font-medium">
                  Signing your contract...
                </motion.p>
              </>
            ) : isError ? (
              <>
                <motion.div
                  variants={iconVariants}
                  className="bg-red p-6 rounded-full"
                >
                  <PiSealWarning size={40} color="white" />
                </motion.div>
                <div className="text-center">
                  <motion.p variants={textVariants} className="text-xl font-medium text-red ">
                    Unable to sign the contract
                  </motion.p>
                  <motion.p
                    variants={textVariants}
                    className="text-sm mt-2 text-gray-600 dark:text-gray-400"
                  >
                    {error?.message || "Please try again later"}
                  </motion.p>
                </div>
              </>
            ) : isSuccess ? (
              <>
                <motion.div
                  variants={iconVariants}
                  className="bg-green p-6 rounded-full"
                >
                  <BsClipboard2Check size={40} color="white" />
                </motion.div>
                <motion.p variants={textVariants} className="text-xl font-medium text-green">
                  Your contract is successfully signed!
                </motion.p>
              </>
            ) : null}

            {(isSuccess || isError) && (
              <motion.div
                variants={linkVariants}
                whileHover="hover"
                className="mt-2"
              >
                <Link
                  href="/quotation"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform hover:shadow-lg"
                >
                  Go Back
                </Link>
              </motion.div>
            )}
          </div>
        </Paper>
      </motion.div>
    </div>
  );
};

export default SignPage;

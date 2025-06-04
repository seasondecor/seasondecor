"use client";

import * as React from "react";
import { FcOk } from "react-icons/fc";
import { FootTypo } from "@/app/components/ui/Typography";
import { ButtonInvert2 } from "@/app/components/ui/Buttons/ButtonInvert";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
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
        stiffness: 300,
        damping: 24,
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
      },
    },
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            variants={iconVariants}
            className="p-6 rounded-full"
          >
            <FcOk size={80} />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <FootTypo
              footlabel="Your payment has been successfully processed!"
              fontSize="1.5rem"
              fontWeight="bold"
              className="text-gray-800 dark:text-white"
            />

            <FootTypo
              footlabel="Thank you for your payment"
              className="text-gray-500 dark:text-gray-400 mt-2"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ButtonInvert2
              label="Go Back"
              icon={<FaAngleLeft size={20} />}
              onClick={() => router.push("/user/account/wallet")}
              className="transition-all duration-300 hover:shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccessPage;

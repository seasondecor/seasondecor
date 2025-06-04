"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { useParams, useRouter } from "next/navigation";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
import Button from "@/app/components/ui/Buttons/Button";
import {
  Paper,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Skeleton,
  TextField,
  Button as MuiButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSignContract } from "@/app/queries/contract/contract.query";
import { TbArrowLeft } from "react-icons/tb";
import { LuUser, LuBuilding, LuDot } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { formatCurrency } from "@/app/helpers";
import { IoIosArrowForward } from "react-icons/io";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { FaCalendarDay } from "react-icons/fa";
import { TbCalendarCancel } from "react-icons/tb";
import { formatDate, formatDateTime } from "@/app/helpers";
import { MdNotes } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FaPenNib } from "react-icons/fa6";
import { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { motion } from "framer-motion";
import {
  useRequestTerminationOtp,
  useTerminateContract,
} from "@/app/queries/contract/contract.query";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { IoWalletOutline } from "react-icons/io5";
import OTPInput from "react-otp-input";
import Countdown from "react-countdown";

// Create styled motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionAvatar = motion(Avatar);
const MotionCard = motion(Card);

const ViewContractPage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState("policies"); // "policies" or "success"
  const [showCancelValidation, setShowCancelValidation] = useState(false);
  const [cancelText, setCancelText] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [showCompensationDialog, setShowCompensationDialog] = useState(false);
  const [isOtpView, setIsOtpView] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const theme = useTheme();

  const { data: contractFile, isLoading: isContractLoading } =
    useGetContractFile(slug);

  const { data: wallet, isLoading: isWalletLoading } = useGetWallet();

  const { mutate: signContract, isPending: isSigningContract } =
    useSignContract();

  const {
    mutate: requestTerminationOtp,
    isPending: isRequestingTerminationOtp,
  } = useRequestTerminationOtp();

  const { mutate: terminateContract, isPending: isTerminatingContract } =
    useTerminateContract();

  const handleOpenPoliciesDialog = () => {
    setDialogState("policies");
    setDialogOpen(true);
  };

  const handleSignContract = () => {
    signContract(contractFile?.data.contractCode, {
      onSuccess: () => {
        setDialogState("success");
      },
      onError: () => {
        alert("Failed to sign contract");
        setDialogOpen(false);
      },
    });
  };

  const openEmailClient = () => {
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCancelRequest = () => {
    setShowCancelValidation(true);
    setCancelText("");
    setCancelError("");
  };

  const handleCancelTextChange = (e) => {
    setCancelText(e.target.value);
    if (cancelError) setCancelError("");
  };

  const handleCancelSubmit = () => {
    if (cancelText.trim() === "Cancel") {
      setShowCompensationDialog(true);
    } else {
      setCancelError("Please type 'Cancel' to confirm");
    }
  };

  const handleProceedWithCancellation = () => {
    requestTerminationOtp(contractFile?.data.contractCode, {
      onSuccess: () => {
        setIsOtpView(true);
        setOtp("");
        setOtpError("");
      },
      onError: (error) => {
        alert(error?.message || "Failed to send OTP");
      },
    });
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    terminateContract(
      { contractCode: contractFile?.data.contractCode, otp },
      {
        onSuccess: () => {
          setShowCompensationDialog(false);
        },
        onError: (error) => {
          setOtpError(error?.message || "Invalid OTP");
        },
      }
    );
  };

  // Animation variants
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
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  // Add this function to render the countdown
  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <FootTypo
          footlabel="The cancellation period has expired"
          fontWeight="bold"
        />
      );
    }

    return (
      <Box mt={1} p={2} border="1px solid" borderRadius={2}>
        <FootTypo footlabel="Time remaining to cancel:" />
        <Box display="flex" gap={4} mt={1} justifyContent="center">
          <Box textAlign="center">
            <FootTypo footlabel={String(days).padStart(2, "0")} />
            <FootTypo footlabel="Days" fontWeight="bold" />
          </Box>
          <Box textAlign="center">
            <FootTypo footlabel={String(hours).padStart(2, "0")} />
            <FootTypo footlabel="Hours" fontWeight="bold" />
          </Box>
          <Box textAlign="center">
            <FootTypo footlabel={String(minutes).padStart(2, "0")} />
            <FootTypo footlabel="Minutes" fontWeight="bold" />
          </Box>
          <Box textAlign="center">
            <FootTypo footlabel={String(seconds).padStart(2, "0")} />
            <FootTypo footlabel="Seconds" fontWeight="bold" />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Container>
      <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>

      {/* Dialog for Policies and Success Message */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="contract-dialog"
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          {dialogState === "policies" ? (
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              component="div"
              sx={{
                p: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(20, 30, 50, 0.95)"
                    : "background.paper",
              }}
            >
              <MotionBox
                variants={itemVariants}
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
              >
                <MotionAvatar
                  variants={iconVariants}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.1)",
                    color: "primary.main",
                  }}
                >
                  <IoDocumentTextOutline size={24} />
                </MotionAvatar>
                <DialogTitle sx={{ p: 0, fontWeight: 600 }}>
                  Contract Signing Policies
                </DialogTitle>
              </MotionBox>

              <Divider sx={{ mb: 2 }} />

              <MotionBox
                variants={itemVariants}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(30, 41, 59, 0.8)"
                      : "rgba(241, 245, 249, 0.8)",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(71, 85, 105, 0.5)"
                      : "rgba(203, 213, 225, 0.8)"
                  }`,
                }}
              >
                <Typography variant="subtitle1" fontWeight="500" mb={1.5}>
                  By signing this contract, you acknowledge and agree to the
                  following terms:
                </Typography>

                <List dense sx={{ pl: 1 }}>
                  {[
                    "You have read and understood all terms and conditions outlined in the contract document.",
                    "You agree to the construction date and service details specified in this contract.",
                    "You agree to pay the deposit amount to secure the service.",
                    "You understand that a secret verification key will be sent to your email to complete the signing process.",
                    "Cancellation of this contract may be subject to fees as outlined in the contract document.",
                    "You confirm that all provided information is accurate and complete.",
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <MotionBox
                          component="span"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {index + 1}.
                        </MotionBox>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <MotionTypography
                            variant="body2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {item}
                          </MotionTypography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </MotionBox>

              <MotionBox
                variants={itemVariants}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <MuiButton
                  onClick={handleCloseDialog}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </MuiButton>
                <MuiButton
                  onClick={handleSignContract}
                  variant="contained"
                  disabled={isSigningContract}
                  loading={isSigningContract}
                  sx={{
                    bgcolor: "black",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "grey.800",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "grey.300",
                    },
                  }}
                  icon={<FaPenNib />}
                >
                  Sign Contract
                </MuiButton>
              </MotionBox>
            </MotionBox>
          ) : (
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(124, 58, 237, 0.2))"
                    : "linear-gradient(135deg, rgba(239, 246, 255, 1), rgba(243, 232, 255, 1))",
                boxShadow: "none",
                border: "none",
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <MotionAvatar
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 3,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.1)",
                    color: "primary.main",
                  }}
                >
                  <MotionBox
                    initial={{ rotate: -120, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <MdOutlineEmail size={40} />
                  </MotionBox>
                </MotionAvatar>

                <MotionTypography
                  variant="h5"
                  component="h2"
                  fontWeight="bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  mb={1}
                >
                  Secret Key Sent
                </MotionTypography>

                <MotionTypography
                  variant="body1"
                  color="text.secondary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  mb={4}
                  sx={{ maxWidth: "80%", mx: "auto" }}
                >
                  A secret key has been sent to your email. Please check your
                  inbox to complete the contract signing process.
                </MotionTypography>

                <MotionBox
                  display="flex"
                  justifyContent="center"
                  gap={2}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    label="Open Email"
                    className="bg-action text-white"
                    onClick={openEmailClient}
                    icon={<MdOutlineEmail />}
                  />

                  <Button label="Close" onClick={handleCloseDialog} />
                </MotionBox>
              </CardContent>
            </MotionCard>
          )}
        </DialogContent>
      </Dialog>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <HiOutlineDocumentText className="mr-2" size={28} />
          <BodyTypo bodylabel="Contract Summary" />
        </Box>
        {!isContractLoading && (
          <Box
            display="flex"
            alignItems="center"
            px={3}
            py={1}
            borderRadius="full"
          >
            <HiOutlineDocumentText
              className="text-blue-600 dark:text-blue-400 mr-2"
              size={18}
            />
            <FootTypo
              footlabel={contractFile?.data.contractCode}
              className="text-blue-600 dark:text-blue-400 font-medium text-sm"
            />
          </Box>
        )}
      </Box>

      {isContractLoading ? (
        <Paper
          elevation={0}
          className="rounded-xl mb-10 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={200}
                  height={24}
                  animation="wave"
                />
              </div>
              <Skeleton
                variant="rounded"
                width={180}
                height={36}
                animation="wave"
                sx={{ borderRadius: "20px" }}
              />
            </div>

            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={160}
                      height={28}
                      animation="wave"
                    />
                  </div>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/20"
                    >
                      <Skeleton
                        variant="text"
                        width={120}
                        height={24}
                        animation="wave"
                      />
                      <Skeleton
                        variant="text"
                        width={100}
                        height={24}
                        animation="wave"
                      />
                    </div>
                  ))}
                </div>
              </Grid>

              <Grid xs={12} md={6}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={160}
                      height={28}
                      animation="wave"
                    />
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/20"
                    >
                      <Skeleton
                        variant="text"
                        width={120}
                        height={24}
                        animation="wave"
                      />
                      <Skeleton
                        variant="text"
                        width={100}
                        height={24}
                        animation="wave"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 mt-6">
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={40}
                      animation="wave"
                      sx={{ borderRadius: "12px" }}
                    />
                    <Skeleton
                      variant="rounded"
                      width={160}
                      height={40}
                      animation="wave"
                      sx={{ borderRadius: "12px" }}
                    />
                  </div>
                </div>
              </Grid>

              <Grid xs={12} md={6}>
                <div className="bg-rose-50/30 dark:bg-rose-900/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={160}
                      height={28}
                      animation="wave"
                    />
                  </div>
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white/50 dark:bg-gray-800/30"
                    >
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation="wave"
                      />
                      <div className="flex-1">
                        <Skeleton
                          variant="text"
                          width={80}
                          height={16}
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width={140}
                          height={20}
                          animation="wave"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>

              <Grid xs={12} md={6}>
                <div className="bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={160}
                      height={28}
                      animation="wave"
                    />
                  </div>
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white/50 dark:bg-gray-800/30"
                    >
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation="wave"
                      />
                      <div className="flex-1">
                        <Skeleton
                          variant="text"
                          width={80}
                          height={16}
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          width={140}
                          height={20}
                          animation="wave"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      ) : (
        <Paper
          elevation={2}
          className="rounded-xl mb-10 bg-white dark:bg-transparent overflow-hidden dark:text-white shadow-xl"
        >
          <TabGroup>
            <TabList className="flex space-x-1 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                  ${
                    selected
                      ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                      : "hover:bg-white/[0.12] hover:text-primary"
                  }`
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineDocumentText size={18} />
                  <FootTypo footlabel="Contract Details" />
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                  ${
                    selected
                      ? "bg-white dark:bg-gray-900 text-primary shadow-lg"
                      : "hover:bg-white/[0.12] hover:text-primary"
                  }`
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <MdNotes size={18} />
                  <FootTypo footlabel="Requirements" />
                </div>
              </Tab>
            </TabList>

            <TabPanels className="mt-2 relative overflow-hidden">
              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-fade-in">
                <div className="p-4">
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <h3 className="text-blue-700 dark:text-blue-400 font-semibold mb-4 flex items-center">
                        <HiOutlineDocumentText size={18} className="mr-2" />
                        Contract Information
                      </h3>
                      <div className="space-y-4">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Contract Code"
                            className=" text-gray-500 dark:text-gray-400"
                          />

                          <FootTypo
                            footlabel={contractFile?.data.contractCode}
                            fontWeight="bold"
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Related Booking"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={contractFile?.data.bookingCode}
                            fontWeight="bold"
                          />
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Total Amount"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatCurrency(
                              contractFile?.data.totalPrice || 0
                            )}
                            fontWeight="bold"
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Deposit Amount To Pay"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatCurrency(
                              contractFile?.data.depositAmount || 0
                            )}
                            fontWeight="bold"
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Status"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <StatusChip
                            status={contractFile?.data.status}
                            isContract
                          />
                        </Box>
                        {contractFile?.data.isSigned && (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <FootTypo
                              footlabel="Contract Signed"
                              className="text-gray-500 dark:text-gray-400"
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                              <FootTypo
                                footlabel={
                                  formatDateTime(contractFile?.data.signedDate)
                                    .date
                                }
                                fontWeight="bold"
                              />
                              <LuDot size={12} />
                              <FootTypo
                                footlabel={
                                  formatDateTime(contractFile?.data.signedDate)
                                    .time
                                }
                                className="text-gray-600 dark:text-gray-400"
                              />
                            </Box>
                          </Box>
                        )}
                      </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <h3 className="text-purple-700 dark:text-purple-400 font-semibold mb-4 flex items-center">
                        <FaCalendarDay size={18} className="mr-2" />
                        Schedule Information
                      </h3>
                      <div className="space-y-4">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Survey Date"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatDate(
                              contractFile?.data.surveyDate
                            )}
                            fontWeight="bold"
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <FootTypo
                            footlabel="Construction Start Date"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatDate(
                              contractFile?.data.constructionDate
                            )}
                            fontWeight="bold"
                          />
                        </Box>
                        <Box display="flex">
                          {contractFile?.data.isFinalPaid ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="start"
                              gap={2}
                            >
                              <Alert
                                severity="success"
                                color="success"
                                sx={{
                                  paddingY: 0.5,
                                  borderRadius: 10,
                                  paddingX: 1,
                                }}
                              >
                                Your contract is paid successfully. Thank you
                                for choosing Season Decor !
                              </Alert>
                              <button
                                className="flex items-center gap-2 bg-action text-white px-5 py-2 hover:translate-x-2 rounded-full transition-all"
                                onClick={() =>
                                  router.push(
                                    `/booking/request`
                                  )
                                }
                              >
                                Continue to Booking
                                <IoIosArrowForward size={20} />
                              </button>
                            </Box>
                          ) : contractFile?.data.isSigned &&
                            contractFile?.data.status !== 4 &&
                            !contractFile?.data.isDeposited ? (
                            <Button
                              icon={<IoIosArrowForward />}
                              label="Proceed to Contract Deposit"
                              className="bg-action text-white"
                              onClick={() =>
                                router.push(
                                  `/payment/${contractFile?.data.contractCode}?type=deposit&bookingCode=${contractFile?.data.bookingCode}`
                                )
                              }
                            />
                          ) : contractFile?.data.isDeposited ? (
                            <Alert
                              severity="success"
                              color="success"
                              sx={{
                                paddingY: 0.5,
                                borderRadius: 10,
                                paddingX: 1,
                              }}
                            >
                              Your contract is deposited successfully !
                              <br />
                              Provider will continue to process your service and
                              will contact you soon
                            </Alert>
                          ) : contractFile?.data.status !== 4 ? (
                            <Button
                              icon={<FaPenNib />}
                              label="Sign Contract"
                              className="bg-action text-white"
                              onClick={handleOpenPoliciesDialog}
                              disabled={isSigningContract}
                              isLoading={isSigningContract}
                            />
                          ) : null}
                        </Box>
                      </div>
                    </Grid>
                  </Grid>

                  {contractFile?.data.isSigned &&
                    contractFile?.data.isTerminatable &&
                    contractFile?.data.status !== 4 && (
                      <Alert
                        variant="outlined"
                        severity="warning"
                        sx={{ mt: 2 }}
                      >
                        <FootTypo footlabel="Note" fontWeight="bold" />
                        <br />
                        Dear Customer, Please be advised that once both parties
                        — you (the customer) and the service provider — have
                        signed the contract, it becomes legally binding and
                        enforceable. Unilateral cancellation of the contract
                        after it has been duly signed by both parties is
                        considered a breach of agreement, unless otherwise
                        stipulated in the contract terms. While we understand
                        that unforeseen circumstances may arise, we strongly
                        encourage you to review the cancellation and termination
                        clauses outlined in your agreement. Unauthorized
                        cancellations may result in legal and/or financial
                        consequences, including but not limited to forfeiture of
                        deposits or liability for damages. If you are
                        considering cancellation, please contact our support
                        team immediately to discuss available options and
                        minimize potential risks. Thank you for your
                        understanding and cooperation. Sincerely,
                        <FootTypo footlabel="Season Decor" fontWeight="bold" />
                        <FootTypo
                          footlabel="You have 3 days since the contract was signed to cancel the contract"
                          fontWeight="bold"
                        />
                        <Countdown
                          date={
                            new Date(contractFile?.data.signedDate).getTime() +
                            3 * 24 * 60 * 60 * 1000
                          }
                          renderer={renderCountdown}
                          separator=":"
                        />
                        <FootTypo
                          footlabel="If you still want to cancel the contract, please continue to the cancellation process !"
                          fontWeight="bold"
                          fontStyle="italic"
                          mt={1}
                        />
                        {!showCancelValidation ? (
                          <Button
                            icon={<TbCalendarCancel />}
                            label="I want to cancel the contract"
                            className="bg-lightGrey text-white mt-2"
                            onClick={handleCancelRequest}
                          />
                        ) : (
                          <div className="mt-3 p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                            <FootTypo
                              footlabel="Please type 'Cancel' to confirm contract cancellation"
                              className="pb-2"
                            />
                            <div className="flex flex-col gap-2">
                              <TextField
                                fullWidth
                                value={cancelText}
                                onChange={handleCancelTextChange}
                                placeholder="Type 'Cancel' here"
                                variant="outlined"
                                size="small"
                                error={!!cancelError}
                                helperText={cancelError}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor:
                                        theme.palette.mode === "dark"
                                          ? "rgba(255, 255, 255, 0.23)"
                                          : "rgba(0, 0, 0, 0.23)",
                                    },
                                    "&:hover fieldset": {
                                      borderColor:
                                        theme.palette.mode === "dark"
                                          ? "rgba(255, 255, 255, 0.23)"
                                          : "rgba(0, 0, 0, 0.23)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#ef4444",
                                    },
                                  },
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(0, 0, 0, 0.12)"
                                      : "white",
                                }}
                              />
                              <div className="flex gap-2 mt-1">
                                <Button
                                  label="Continue"
                                  className="bg-action text-white"
                                  onClick={handleCancelSubmit}
                                />
                                <Button
                                  label="Cancel"
                                  onClick={() => setShowCancelValidation(false)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Alert>
                    )}

                  {contractFile?.data.status === 4 && (
                    <Alert
                      severity="info"
                      color="info"
                      sx={{
                        mt: 2,
                        "& .MuiAlert-message": {
                          width: "100%",
                        },
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          color="info.main"
                          sx={{ mb: 1 }}
                        >
                          Contract Termination Notice
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ mb: 2 }}
                        >
                          This contract has been officially terminated at
                          <Typography fontWeight="bold" py={1}>
                            {formatDateTime(contractFile?.data.cancelDate).date}
                            {" "}
                            at
                            {" "}
                            {formatDateTime(contractFile?.data.cancelDate).time}
                          </Typography>
                          Below are the details of the termination process:
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          bgcolor: "background.paper",
                          borderRadius: 2,
                          p: 2,
                          mb: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              Contract Code
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {contractFile?.data.contractCode}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              Customer Name
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {contractFile?.data.customerName}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Contract Value
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formatCurrency(contractFile?.data.totalPrice)}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              Compensation Fee (50%)
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="500"
                              color="error.main"
                            >
                              {formatCurrency(
                                contractFile?.data.totalPrice * 0.5
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" paragraph>
                          The contract termination has been processed in
                          accordance with our terms and conditions. A
                          termination fee of 50% of the total contract value has
                          been applied as per the agreement.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          All services associated with this contract have been
                          discontinued. Any ongoing processes or scheduled
                          appointments have been cancelled.
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(0, 0, 0, 0.02)",
                          borderRadius: 2,
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Follow-up Actions:
                        </Typography>
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                            <ListItemText primary="Contract closure documentation has been processed" />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                            <ListItemText primary="Termination fee has been deducted from wallet balance" />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                            <ListItemText primary="All scheduled services have been cancelled" />
                          </ListItem>
                        </List>
                      </Box>
                    </Alert>
                  )}

                  <Grid container spacing={4} mt={2}>
                    <Grid
                      size={{ xs: 12, md: 6 }}
                      className="bg-rose-50 dark:bg-rose-900/10 rounded-lg p-4"
                    >
                      <h3 className="text-rose-700 dark:text-rose-400 font-semibold mb-4 flex items-center">
                        <LuUser size={18} className="mr-2" />
                        Customer Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                            <LuUser
                              className="text-rose-600 dark:text-rose-400"
                              size={20}
                            />
                          </div>
                          <div>
                            <FootTypo
                              footlabel="Name"
                              className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                            />
                            <FootTypo
                              footlabel={contractFile?.data.customerName}
                              className="font-medium text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        {contractFile?.data.customerEmail && (
                          <div className="flex items-center gap-3">
                            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                              <MdOutlineEmail
                                className="text-rose-600 dark:text-rose-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <FootTypo
                                footlabel="Email"
                                className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                              />
                              <FootTypo
                                footlabel={contractFile?.data.customerEmail}
                                className="font-medium text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Grid>

                    <Grid
                      size={{ xs: 12, md: 6 }}
                      className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4"
                    >
                      <h3 className="text-indigo-700 dark:text-indigo-400 font-semibold mb-4 flex items-center">
                        <LuBuilding size={18} className="mr-2" />
                        Provider Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <LuBuilding
                              className="text-indigo-600 dark:text-indigo-400"
                              size={20}
                            />
                          </div>
                          <div>
                            <FootTypo
                              footlabel="Name"
                              className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                            />
                            <FootTypo
                              footlabel={contractFile?.data.providerName}
                              className="font-medium text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        {contractFile?.data.providerEmail && (
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                              <MdOutlineEmail
                                className="text-indigo-600 dark:text-indigo-400"
                                size={20}
                              />
                            </div>
                            <div>
                              <FootTypo
                                footlabel="Email"
                                className="text-sm text-gray-500 dark:text-gray-400 mr-2"
                              />
                              <FootTypo
                                footlabel={contractFile?.data.providerEmail}
                                className="font-medium text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Grid>
                  </Grid>

                  {contractFile?.data.address && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 mt-6">
                      <h3 className="text-amber-700 dark:text-amber-400 font-semibold mb-4 flex items-center">
                        <FaMapMarkerAlt size={18} className="mr-2" />
                        Service Location
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <FaMapMarkerAlt
                            className="text-amber-600 dark:text-amber-400"
                            size={20}
                          />
                        </div>
                        <div>
                          <FootTypo
                            footlabel="Address"
                            className="text-sm text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={contractFile?.data.address}
                            className="font-medium text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-slide-right">
                <div className="p-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full flex-shrink-0">
                        <MdNotes
                          className="text-blue-600 dark:text-blue-400"
                          size={24}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-lg">
                          Requirements
                        </h3>

                        <FootTypo
                          footlabel={
                            contractFile?.data.note ||
                            "You have no specific requirements for the provider."
                          }
                          className={`${
                            contractFile?.data.note
                              ? "text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
                              : "text-gray-500 dark:text-gray-400 italic"
                          }`}
                        />

                        {contractFile?.data.note && (
                          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                            <FootTypo
                              footlabel="These requirements will be taken into consideration during the project execution"
                              className="text-sm text-blue-600 dark:text-blue-400"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Paper>
      )}

      <section className="flex flex-row justify-between items-center my-5">
        <div className="flex items-center">
          <BsFileEarmarkPdf className="mr-2" size={24} />
          <BodyTypo bodylabel="Contract Document" className="text-lg" />
        </div>
      </section>
      <div className="flex flex-col h-[100vh] bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
        <div className="pdf-viewer-container w-full h-full bg-white dark:bg-gray-800">
          {contractFile?.data.fileUrl ? (
            <Viewer fileUrl={contractFile?.data.fileUrl} defaultScale={1.5} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>No PDF document available</p>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={showCompensationDialog}
        onClose={() => setShowCompensationDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              position: "relative",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 3,
            overflow: "hidden",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            sx={{ position: "relative" }}
          >
            {!isOtpView ? (
              <MotionBox
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Box sx={{ mb: 3 }}>
                  <MotionTypography
                    variant="h6"
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.primary",
                      fontWeight: 600,
                    }}
                  >
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <TbCalendarCancel size={24} />
                    </motion.div>
                    Contract Cancellation Details
                  </MotionTypography>
                </Box>

                <MotionBox
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography color="text.secondary">
                        Your Wallet Balance
                      </Typography>
                      <Typography
                        fontWeight="500"
                        color={
                          wallet?.balance < contractFile?.data.totalPrice * 0.5
                            ? "error"
                            : "inherit"
                        }
                      >
                        {formatCurrency(wallet?.balance || 0)}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography color="text.secondary">
                        Contract Total Amount
                      </Typography>
                      <Typography fontWeight="500">
                        {formatCurrency(contractFile?.data.totalPrice || 0)}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Typography color="error" fontWeight="500">
                        Cancellation Compensation (50%)
                      </Typography>
                      <Typography color="error" fontWeight="500">
                        {formatCurrency(
                          (contractFile?.data.totalPrice || 0) * 0.5
                        )}
                      </Typography>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {wallet?.data?.balance <
                    contractFile?.data.totalPrice * 0.5 ? (
                      <Alert
                        severity="error"
                        sx={{
                          "& .MuiAlert-message": { width: "100%" },
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Your wallet balance is insufficient for the
                          cancellation compensation. Please top up your wallet
                          to proceed.
                        </Typography>
                        <Button
                          label="Top Up Wallet"
                          onClick={() => router.push("/wallet")}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          icon={<IoWalletOutline />}
                        />
                      </Alert>
                    ) : (
                      <Alert
                        severity="warning"
                        sx={{
                          "& .MuiAlert-message": { width: "100%" },
                          bgcolor: "warning.50",
                        }}
                      >
                        By proceeding with the cancellation, you agree to pay
                        the compensation amount of{" "}
                        {formatCurrency(
                          (contractFile?.data.totalPrice || 0) * 0.5
                        )}{" "}
                        as per the contract terms.
                      </Alert>
                    )}
                  </motion.div>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    label="Go Back"
                    onClick={() => setShowCompensationDialog(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  />
                  {wallet?.balance < contractFile?.data.totalPrice * 0.5 ? (
                    <Button
                      label="Top Up"
                      onClick={() => router.push("/user/account/wallet")}
                      className="bg-action text-white"
                      icon={<IoWalletOutline />}
                    />
                  ) : (
                    <Button
                      label="Continue"
                      isLoading={isRequestingTerminationOtp}
                      onClick={handleProceedWithCancellation}
                      className="bg-red text-white"
                      icon={<TbCalendarCancel />}
                    />
                  )}
                </MotionBox>
              </MotionBox>
            ) : (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                sx={{
                  textAlign: "center",
                  maxWidth: "400px",
                  margin: "0 auto",
                  py: 4,
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    Enter Verification Code
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    We've sent a verification code to your email{" "}
                    <Typography variant="body1" fontWeight="bold">
                      {contractFile?.data.customerEmail}
                    </Typography>
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    containerStyle={{
                      gap: "12px",
                      justifyContent: "center",
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          fontSize: "18px",
                          fontWeight: "600",
                          transition: "all 0.2s ease",
                          textAlign: "center",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        }}
                      />
                    )}
                  />
                  {otpError && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <span>⚠️</span> {otpError}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    "& button": {
                      minWidth: "120px",
                    },
                  }}
                >
                  <MuiButton
                    onClick={handleVerifyOtp}
                    variant="contained"
                    loading={isTerminatingContract}
                  >
                    Verify & Proceed
                  </MuiButton>
                </Box>
              </MotionBox>
            )}
          </MotionBox>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ViewContractPage;

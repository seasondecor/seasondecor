"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { useParams, useRouter } from "next/navigation";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
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
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { useSignContract } from "@/app/queries/contract/contract.query";
import { TbArrowLeft } from "react-icons/tb";
import { LuUser, LuBuilding } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { formatCurrency } from "@/app/helpers";
import { IoIosArrowForward } from "react-icons/io";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { formatDate } from "@/app/helpers";
import { MdNotes } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FaPenNib } from "react-icons/fa6";
import { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { motion } from "framer-motion";

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
  const theme = useTheme();

  const { data: contractFile, isLoading: isContractLoading } =
    useGetContractFile(slug);

  const { mutate: signContract, isPending: isSigningContract } =
    useSignContract();

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
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
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
                <Button
                  label="Cancel"
                  className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                  onClick={handleCloseDialog}
                />
                <Button
                  label="Sign Contract"
                  className="bg-action text-white"
                  onClick={handleSignContract}
                  isLoading={isSigningContract}
                  disabled={isSigningContract}
                  icon={<FaPenNib />}
                />
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

      <section className="flex flex-row justify-between items-center mb-6">
        <div className="flex items-center">
          <HiOutlineDocumentText className="mr-2" size={28} />
          <BodyTypo bodylabel="Contract Summary" />
        </div>
        {!isContractLoading && (
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            <HiOutlineDocumentText
              className="text-blue-600 dark:text-blue-400 mr-2"
              size={18}
            />
            <FootTypo
              footlabel={contractFile?.data.contractCode}
              className="text-blue-600 dark:text-blue-400 font-medium text-sm"
            />
          </div>
        )}
      </section>

      {isContractLoading ? (
        <Paper
          elevation={0}
          className="rounded-lg mb-10 bg-white dark:bg-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="60%" height={24} />
                </div>
              </div>
            ))}
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
                  <FootTypo
                    footlabel="Contract Details"
                    className="!m-0 dark:text-white"
                  />
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
                  <FootTypo
                    footlabel="Requirements"
                    className="!m-0 dark:text-white"
                  />
                </div>
              </Tab>
            </TabList>

            <TabPanels className="mt-2 relative overflow-hidden">
              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-fade-in">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg p-4">
                      <h3 className="text-blue-700 dark:text-blue-400 font-semibold mb-4 flex items-center">
                        <HiOutlineDocumentText size={18} className="mr-2" />
                        Contract Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Contract Code"
                            className=" text-gray-500 dark:text-gray-400"
                          />

                          <FootTypo
                            footlabel={contractFile?.data.contractCode}
                            fontWeight="bold"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Related Booking"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={contractFile?.data.bookingCode}
                            fontWeight="bold"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Deposit Amount"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatCurrency(
                              contractFile?.data.depositAmount || 0
                            )}
                            fontWeight="bold"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Signature Status"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          {contractFile?.data.isSigned ? (
                            <Alert
                              severity="success"
                              color="success"
                              sx={{
                                paddingY: 0.5,
                                borderRadius: 10,
                                paddingX: 1,
                              }}
                            >
                              Signed
                            </Alert>
                          ) : (
                            <Alert
                              severity="warning"
                              color="warning"
                              sx={{
                                paddingY: 0.5,
                                borderRadius: 10,
                                paddingX: 1,
                              }}
                            >
                              Pending to sign
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                      <h3 className="text-purple-700 dark:text-purple-400 font-semibold mb-4 flex items-center">
                        <FaCalendarDay size={18} className="mr-2" />
                        Schedule Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
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
                        </div>

                        <div className="flex items-center justify-between">
                          <FootTypo
                            footlabel="Construction Date"
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <FootTypo
                            footlabel={formatDate(
                              contractFile?.data.constructionDate
                            )}
                            fontWeight="bold"
                          />
                        </div>
                        <div className="flex justify-start items-center">
                          {contractFile?.data.isFinalPaid ? (
                            <div className="flex items-center gap-3">
                              <Alert
                                severity="success"
                                color="success"
                                sx={{
                                  paddingY: 0.5,
                                  borderRadius: 10,
                                  paddingX: 1,
                                }}
                              >
                                Your contract is paid successfully
                              </Alert>
                              <button className="flex items-center gap-2 bg-action text-white px-5 py-2 hover:translate-x-2 rounded-full transition-all">
                                Go to your booking
                                <IoIosArrowForward size={20} />
                              </button>
                            </div>
                          ) : contractFile?.data.isSigned &&
                            !contractFile?.data.isDeposited ? (
                            <Button
                              icon={<IoIosArrowForward />}
                              label="Proceed to Deposit Payment"
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
                              Your contract is deposited successfully
                            </Alert>
                          ) : (
                            <Button
                              icon={<FaPenNib />}
                              label="Sign Contract"
                              className="bg-action text-white"
                              onClick={handleOpenPoliciesDialog}
                              disabled={isSigningContract}
                              isLoading={isSigningContract}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-rose-50 dark:bg-rose-900/10 rounded-lg p-4">
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
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4">
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
                    </div>
                  </div>

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
          <BsFileEarmarkPdf
            className="text-amber-600 dark:text-amber-400 mr-2"
            size={24}
          />
          <BodyTypo bodylabel="Contract Document" className="text-lg" />
        </div>
      </section>

      <div className="flex flex-col h-[100vh] bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
        {isContractLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-center">
              <BsFileEarmarkPdf
                size={48}
                className="mx-auto mb-4 text-gray-400"
              />
              <p className="text-gray-500">Loading contract document...</p>
            </div>
          </div>
        ) : (
          <div className="pdf-viewer-container w-full h-full bg-white dark:bg-gray-800">
            {contractFile?.data.fileUrl ? (
              <Viewer fileUrl={contractFile?.data.fileUrl} defaultScale={1.5} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p>No PDF document available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ViewContractPage;

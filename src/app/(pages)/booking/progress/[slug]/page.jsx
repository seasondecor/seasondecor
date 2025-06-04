"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams, useSearchParams } from "next/navigation";
import { useGetTrackingByBookingCode } from "@/app/queries/tracking/tracking.query";
import { FootTypo } from "@/app/components/ui/Typography";
import { Timeline } from "@/app/components/ui/animated/TimeLine";
import { formatDateTime } from "@/app/helpers";
import { Skeleton, Divider, Chip, Box, TextField, Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { TbArrowLeft, TbRotate } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { BorderBox } from "@/app/components/ui/BorderBox";
import Button from "@/app/components/ui/Buttons/Button";
import { IoWalletOutline } from "react-icons/io5";
import { IoCheckmarkCircleSharp, IoTimeOutline } from "react-icons/io5";
import Folder from "@/app/components/ui/animated/Folder";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Typography } from "@mui/material";
import { CiFlag1 } from "react-icons/ci";
import { motion } from "framer-motion";

const ViewTrackingPage = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const status = Number(searchParams.get("status") || NaN);
  const quotationCode = searchParams.get("quotation-code") || "";

  const provider = searchParams.get("provider") || "";
  const providerAvatar = searchParams.get("avatar") || "";

  const {
    data: trackingData,
    isPending,
    refetch,
  } = useGetTrackingByBookingCode(slug);
  const [bookingCode, setBookingCode] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (Array.isArray(trackingData) && trackingData.length > 0) {
      const bookingCode = trackingData[0].bookingCode;
      // Find the latest update
      const mostRecent = [...trackingData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      const { date, time } = formatDateTime(mostRecent.createdAt);
      setLatestUpdate({ date, time });

      const formattedTimelineData = trackingData.map((item) => ({
        title: (() => {
          const { date, time } = formatDateTime(item.createdAt);
          return (
            <Box display="flex" flexDirection="column" gap={1}>
              <FootTypo footlabel={date} />
              <FootTypo footlabel={time} />
            </Box>
          );
        })(),
        content: (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <FootTypo footlabel="Main Task" className="mb-2" />
              <TextField
                fullWidth
                multiline
                rows={2}
                value={item.task}
                placeholder="No task available"
                disabled
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.100",
                    borderRadius: 4,
                    "& fieldset": {
                      border: "none",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "grey.100",
                      "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        WebkitTextFillColor: "inherit",
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <FootTypo footlabel="Note" className="mb-2" />
              <TextField
                fullWidth
                multiline
                rows={5}
                value={item.note}
                placeholder="No notes available"
                disabled
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "grey.100",
                    borderRadius: 4,
                    "& fieldset": {
                      border: "none",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "grey.100",
                      "& .MuiOutlinedInput-input": {
                        color: "text.primary",
                        WebkitTextFillColor: "inherit",
                      },
                    },
                  },
                }}
              />
            </Box>

            {item.images && item.images.length > 0 && (
              <Grid container spacing={2}>
                {item.images.map((img, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: { xs: 160, md: 200, lg: 240 },
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow:
                          "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
                      }}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`Tracking image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ),
      }));
      setTimelineData(formattedTimelineData);
      setBookingCode(bookingCode);
    }
  }, [trackingData]);

  // Timeline loading skeleton component
  const TimelineLoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center space-x-3">
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <Skeleton animation="wave" variant="text" width="60%" height={30} />
      </div>

      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="ml-5 pl-6 border-l-2 border-gray-200 dark:border-gray-700 pb-8 space-y-4"
        >
          <div className="flex items-center space-x-3">
            <Skeleton
              animation="wave"
              variant="circular"
              width={24}
              height={24}
            />
            <Skeleton animation="wave" variant="text" width="40%" height={24} />
          </div>

          <div className="ml-8 space-y-4">
            <Skeleton animation="wave" variant="text" width="25%" height={20} />
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={60}
            />
            <Skeleton animation="wave" variant="text" width="25%" height={20} />
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={120}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="100%"
                height={120}
                className="rounded-lg"
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="100%"
                height={120}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Status card loading skeleton
  const StatusCardSkeleton = () => (
    <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-4 animate-pulse">
      <Skeleton animation="wave" variant="circular" width={60} height={60} />
      <Skeleton animation="wave" variant="text" width="80%" height={30} />
      <Skeleton animation="wave" variant="text" width="90%" height={20} />
      <Skeleton animation="wave" variant="text" width="60%" height={20} />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="70%"
        height={40}
        className="rounded-full"
      />
    </BorderBox>
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000); // Ensure animation plays for at least 1 second
  };

  const CaughtUpSection = () => (
    <Box position="relative">
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to bottom, #4CAF50, #45a049)",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
            }}
          >
            <IoCheckmarkCircleSharp size={40} color="white" />
          </Box>
        </motion.div>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textAlign: "center",
          }}
        >
          You're All Caught Up!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          You've seen all the latest updates. Check back later for new progress
          on your service.
        </Typography>

        {latestUpdate && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Latest Update
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                color: "text.primary",
              }}
            >
              <Typography variant="body1">{latestUpdate.date}</Typography>
              <Typography variant="body2" color="text.secondary">
                at
              </Typography>
              <Typography variant="body1">{latestUpdate.time}</Typography>
            </Box>
          </Box>
        )}

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleRefresh}
            icon={
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: isRefreshing ? Infinity : 0,
                }}
              >
                <TbRotate size={18} />
              </motion.div>
            }
            label="Refresh Updates"
            className="bg-action text-white"
            disabled={isRefreshing}
          />
        </motion.div>
      </Box>
    </Box>
  );

  // Add this near your other component code
  const successVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container>
      <button
        onClick={() => router.back()}
        className="flex flex-row items-center gap-2"
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>

      <Grid container spacing={4} position="relative">
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
            {isPending ? (
              <TimelineLoadingSkeleton />
            ) : timelineData.length > 0 ? (
              <>
                <Timeline
                  data={timelineData}
                  title={`Tracking Progress ${bookingCode} `}
                />
              </>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={6}
                px={2}
                textAlign="center"
                borderRadius={2}
              >
                <IoTimeOutline size={50} className="text-gray-400 mb-4" />
                <FootTypo
                  footlabel="No tracking information available yet"
                  className="text-lg font-medium mb-2"
                />
                <FootTypo
                  footlabel="The provider will update the progress of your service here"
                  className="text-gray-500"
                />
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ position: "sticky", top: "100px" }}>
            {isPending ? (
              <StatusCardSkeleton />
            ) : status === 9 ? (
              <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <FootTypo
                  footlabel="Complete Your Experience"
                  fontWeight="bold"
                  fontSize="20px"
                />
                <IoCheckmarkCircleSharp
                  color="green"
                  size={60}
                  className="self-center"
                />
                <FootTypo footlabel="Your service has been successfully completed! Please check your contract again and proceed to final payment." />
                <Folder
                  size={0.5}
                  color="#00d8ff"
                  className="hover:scale-110 transition-transform duration-200"
                  onClick={() =>
                    router.push(`/quotation/view-contract/${quotationCode}`)
                  }
                />
                <Divider flexItem>
                  <Chip
                    label="Or Proceed to"
                    size="small"
                    className="dark:text-white"
                  />
                </Divider>
                <Button
                  icon={<IoWalletOutline />}
                  label="Complete Payment"
                  onClick={() =>
                    router.push(`/payment/${bookingCode}?type=final`)
                  }
                  className="bg-action text-white w-full sm:w-auto"
                />
              </BorderBox>
            ) : status === 10 ? (
              <BorderBox className="relative overflow-hidden">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={successVariants}
                  className="flex flex-col items-center justify-center p-8 text-center"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white dark:from-green-900/20 dark:to-slate-800 -z-10" />

                  <FootTypo
                    footlabel="Payment successful"
                    fontWeight="bold"
                    fontSize="24px"
                    className="text-green mb-6"
                  />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-green/10 rounded-full animate-pulse" />
                    <IoCheckmarkCircleSharp
                      color="green"
                      size={80}
                      className="relative z-10"
                    />
                  </motion.div>

                  <Box sx={{ width: "100%", mt: 4, mb: 2 }}>
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: "1.5rem",
                        },
                        "& .MuiAlert-message": {
                          width: "100%",
                        },
                      }}
                    >
                      <FootTypo footlabel="Please wait for the provider to confirm your payment information." />
                    </Alert>
                  </Box>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-row items-center gap-3"
                  >
                    <Avatar
                      userImg={providerAvatar}
                      name={provider}
                      w={45}
                      h={45}
                    />
                    <Box>
                      <FootTypo footlabel="Service Provider" />
                      <FootTypo footlabel={provider} fontWeight="bold" />
                    </Box>
                  </motion.div>
                </motion.div>
              </BorderBox>
            ) : status === 11 ? (
              <>
                <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-3">
                  <FootTypo
                    footlabel="You service is completed "
                    className="text-lg font-bold"
                  />
                  <div className="card">
                    <div className="relative bg-black w-[300px] sm:w-[350px] group transition-all duration-700 aspect-video flex items-center justify-center mt-10">
                      <div className="transition-all flex flex-col items-center py-5 justify-start duration-300 group-hover:duration-1000 bg-gray-200 w-full h-full absolute group-hover:-translate-y-16">
                        <FootTypo
                          footlabel="Thank You"
                          className="text-gray-500 "
                        />

                        <FootTypo
                          footlabel="Hope you will feel happy with our service"
                          className="text-gray-700"
                        />

                        <FootTypo
                          footlabel="Wishing you a fantastic day ahead!"
                          className="text-gray-700"
                        />
                      </div>
                      <button className="seal bg-rose-500 text-red-800 w-10 aspect-square rounded-full z-40 text-[10px] flex items-center justify-center font-semibold [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)] group-hover:opacity-0 transition-all duration-1000 group-hover:scale-0 group-hover:rotate-180 border-4 border-rose-900"></button>
                      <div className="tp transition-all duration-1000 group-hover:duration-100 bg-neutral-900 absolute group-hover:[clip-path:polygon(50%_0%,_100%_0,_0_0)] w-full h-full [clip-path:polygon(50%_50%,_100%_0,_0_0)]"></div>
                      <div className="lft transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_0_0,_0_100%)]"></div>
                      <div className="rgt transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"></div>
                      <div className="btm transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"></div>
                    </div>
                  </div>
                  <span className="flex flex-row items-center gap-2">
                    <FootTypo footlabel="From" />
                    <Avatar
                      userImg={providerAvatar}
                      name={provider}
                      w={40}
                      h={40}
                    />
                    <FootTypo footlabel={provider} />
                  </span>
                </BorderBox>

                <Divider textAlign="center" className="py-5" flexItem>
                  If you have issue with your service
                </Divider>
                <div className="flex flex-col items-center justify-center gap-4">
                  <Typography variant="body2" className="text-center mb-4">
                    If you're experiencing any issues with your service such as
                    quality concerns, or communication problems, please send a
                    report. Our provider will review and respond within 24
                    hours.
                  </Typography>

                  <Button
                    onClick={() => router.push("/support")}
                    icon={<CiFlag1 size={20} />}
                    label="Request Support"
                    className="bg-action text-white self-center"
                  />
                </div>
              </>
            ) : (
              <BorderBox className="flex flex-col items-center justify-center p-6 text-center gap-4">
                <IoTimeOutline size={50} color="orange" className="mb-4" />
                <FootTypo
                  footlabel="Your Service In Progress"
                  fontWeight="bold"
                  fontSize="1.2rem"
                  className="text-orange mb-2"
                />
                <FootTypo footlabel="You will see the task tracking of your service being updated by the provider." />
              </BorderBox>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <CaughtUpSection />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewTrackingPage;

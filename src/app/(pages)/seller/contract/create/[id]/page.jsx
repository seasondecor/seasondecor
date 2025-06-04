"use client";

import SellerWrapper from "../../../components/SellerWrapper";
import { useSearchParams } from "next/navigation";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import {
  useCreateContractByQuotationCode,
  useGetContractFile,
} from "@/app/queries/contract/contract.query";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState, useEffect } from "react";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { customCalendarStyles } from "@/app/(pages)/booking/components/PickDate";
import { format, parseISO, addDays } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TbArrowLeft } from "react-icons/tb";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Image from "next/image";
import { Alert, Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

function LinearProgressWithLabel(props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "50vw",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "8px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${props.value}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
            borderRadius: "4px",
          }}
        />
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FootTypo
          footlabel={`${Math.round(props.value)}%`}
          fontWeight="bold"
          className="text-blue-600"
        />
      </motion.div>
    </Box>
  );
}

// Add animation variants for the container
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const CreateContractPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quotationCode = searchParams.get("quotationCode");
  const surveyDateParam = searchParams.get("surveyDate");
  const surveyDate = surveyDateParam ? parseISO(surveyDateParam) : new Date();
  
  const [constructionDate, setConstructionDate] = useState(surveyDate);
  const { mutate: createContract, isPending } = useCreateContractByQuotationCode();
  const {
    data: contractFile,
    isLoading: isContractFileLoading,
    refetch: refetchContractFile,
  } = useGetContractFile(quotationCode);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (contractFile?.data) {
      setCurrentStep(2);
    }
  }, [contractFile?.data]);

  // Add test function for linear progress
  const testProgressAnimation = () => {
    setIsCreatingContract(true);
    setProgress(10);
    
    // Simulate contract creation process
    setTimeout(() => {
      setProgress(30);
      setTimeout(() => {
        setProgress(60);
        setTimeout(() => {
          setProgress(90);
          setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setIsCreatingContract(false);
              setProgress(10);
              toast.success("Test animation completed!");
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    let timer;
    if (isCreatingContract) {
      setProgress(10);
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          // Slowly increase progress but don't reach 100%
          // until we have confirmation of completion
          const newProgress = prevProgress >= 90 ? 90 : prevProgress + 10;
          return newProgress;
        });
      }, 800);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isCreatingContract]);

  const handleCreateContract = () => {
    setIsCreatingContract(true);
    const formattedDate = format(
      constructionDate,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );
    createContract(
      {
        quotationCode: quotationCode,
        constructionDate: formattedDate,
      },
      {
        onSuccess: async () => {
          toast.success("Contract created successfully");
          setProgress(100);
          // Wait a bit for the file to be processed
          setTimeout(async () => {
            await refetchContractFile();
            setIsCreatingContract(false);
          }, 2000);
        },
        onError: (error) => {
          console.error("Error creating contract:", error);
          toast.error("Failed to create contract");
          setIsCreatingContract(false);
        },
      }
    );
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!constructionDate) {
        toast.error("Please select a construction date before proceeding.");
        return false;
      }
      handleCreateContract();
      return false; // Don't proceed to next step until file is loaded
    }
    return true;
  };

  // Separate loading and creating states
  if (isContractFileLoading) {
    return (
      <SellerWrapper>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <Image
            src="/gif/loading.gif"
            alt="loading"
            width={150}
            height={150}
            priority
            unoptimized
          />
          <FootTypo
            footlabel="Loading contract file..."
            className="text-gray-500"
          />
        </Box>
      </SellerWrapper>
    );
  }

  if (isCreatingContract) {
    return (
      <SellerWrapper>
        <BodyTypo bodylabel="Creating Contract" fontWeight="bold" />
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <motion.div variants={itemVariants}>
              <FootTypo
                footlabel="Creating contract..."
                className="mb-4"
                fontWeight="bold"
              />
            </motion.div>

            <motion.div variants={itemVariants} style={{ width: "100%" }}>
              <LinearProgressWithLabel value={progress} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FootTypo
                footlabel={
                  progress === 100
                    ? "Finalizing your contract..."
                    : "Processing your contract..."
                }
                className="text-gray-500"
              />
            </motion.div>
          </motion.div>
        </Box>
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper>
      <div className="flex justify-between items-center mb-5">
        <button
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" />
        </button>
      </div>
      
      <BodyTypo
        bodylabel={contractFile?.data ? "View Contract" : "Create Contract"}
        className="mb-5"
      />
      <Stepper
        initialStep={currentStep}
        onStepChange={(step) => {
          setCurrentStep(step);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        validateStep={validateStep}
        isContractStep={true}
      >
        <Step>
          <div className="flex flex-col gap-6">
            <BorderBox className="flex flex-col gap-4 border shadow-xl p-6">
              <FootTypo
                footlabel="Select Construction Date"
                fontWeight="bold"
              />
              <Alert severity="info" className="mb-4">
                <FootTypo
                  footlabel="Construction Start Date"
                  fontWeight="bold"
                  className="mb-2"
                />
                <Paper elevation={0} className="bg-blue-50 p-4 mt-2">
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FootTypo footlabel="Survey Date On:" className="text-gray-600" />
                      <FootTypo
                        footlabel={format(surveyDate, "EEEE, MMMM d, yyyy")}
                        fontWeight="bold"
                        className="text-blue-600"
                      />
                    </Box>
                    <FootTypo
                      footlabel="Please choose a date after the survey date. This will be the date your team starts construction and will be visible to the customer."
                      className="text-gray-600 text-sm"
                    />
                  </Box>
                </Paper>
              </Alert>
              <div className="flex flex-col items-center gap-3 w-full">
                <style jsx global>
                  {customCalendarStyles}
                </style>

                <Calendar
                  date={constructionDate}
                  onChange={(date) => setConstructionDate(date)}
                  minDate={addDays(surveyDate, 1)}
                  color="#2563eb"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FootTypo footlabel="Construction Start Date:" />
                <FootTypo
                  footlabel={format(constructionDate, "EEEE, MMMM d, yyyy")}
                  fontWeight="bold"
                />
              </div>
            </BorderBox>
          </div>
        </Step>
        <Step>
          <div className="flex flex-col gap-6">
            <FootTypo footlabel="Contract preview" fontWeight="bold" />
            {contractFile?.data && (
              <Alert 
                severity="success" 
                className="mb-4"
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Contract Generated Successfully
                  </Typography>
                  <Typography variant="body2">
                    The contract is successfully generated and pending for customer to sign
                  </Typography>
                </Box>
              </Alert>
            )}
            <div className="h-[800px] flex flex-col border rounded-md">
              {contractFile?.data ? (
                <Viewer
                  fileUrl={contractFile?.data.fileUrl}
                  defaultScale={1.5}
                />
              ) : (
                <div className="flex items-center justify-center h-[600px] bg-gray-50">
                  <FootTypo
                    footlabel="No contract file available yet"
                    className="text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default CreateContractPage;

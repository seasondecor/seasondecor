"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../../../components/SellerWrapper";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { MdModeEdit, MdPreview } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import MaterialTab from "../../components/MaterialTab";
import LabourTab from "../../components/LabourTab";
import TermTab from "../../components/TermTab";
import { formatCurrency } from "@/app/helpers";
import { useCreateQuotation } from "@/app/queries/quotation/quotation.query";
import { useUploadQuotationFile } from "@/app/queries/quotation/quotation.query";
import { AiOutlineUpload } from "react-icons/ai";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetBookingDetailForProvider } from "@/app/queries/book/book.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { formatDateVN } from "@/app/helpers";
import { motion, AnimatePresence } from "framer-motion";

// Import MUI components
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Skeleton,
  CardActions,
  Chip,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  MdEmail,
  MdLocalPhone,
  MdLocationOn,
  MdCalendarToday,
  MdColorLens,
  MdHouse,
  MdSquareFoot,
  MdPerson,
  MdBuild,
  MdOutlineDesignServices,
  MdWarning,
  MdCheckCircle,
  MdError,
} from "react-icons/md";
import Image from "next/image";

const QuotationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: bookingData, isPending: isBookingLoading } =
    useGetBookingDetailForProvider(id);

  const { mutate: createQuotation, isLoading: isCreatingQuotation } =
    useCreateQuotation();
  const { mutate: uploadQuotationFile, isLoading: isUploadingFile } =
    useUploadQuotationFile();

  const [showEditor, setShowEditor] = useState(true);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quotationData, setQuotationData] = useState({
    quotationCode: id,
    customerName: bookingData?.fullName || "John Doe",
    customerEmail: bookingData?.email || "john.doe@example.com",
    customerAddress: bookingData?.address || "123 Main St, Anytown, USA",
    terms:
      "A deposit of 500,000 VND is required prior to the issuance of a formal quotation. This deposit confirms the customer's commitment to proceed with the service and is deductible from the final invoice upon successful booking.\n\nIn the event the customer cancels the service after the deposit is made but before confirmation of the final quotation, a cancellation fee of 500,000 VND will apply. This means the deposit is non-refundable, as it covers consultation, reservation, and administrative efforts undertaken during the pre-booking process.",
    materials: [
      {
        materialName: "",
        quantity: 1,
        cost: 0,
        note: "",
      },
    ],
    constructionTasks: [
      {
        taskName: "",
        cost: 0,
        unit: "",
        area: 0,
        note: "",
      },
    ],
  });

  const { register, handleSubmit, setValue, getValues, control } = useForm({
    defaultValues: {},
  });

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Initialize form data on component mount
  useEffect(() => {
    // Register terms and deposit percentage
    setValue("terms", quotationData.terms);
    setValue("depositPercentage", quotationData.depositPercentage || 20);

    // Register material fields
    quotationData.materials.forEach((material, index) => {
      Object.keys(material).forEach((key) => {
        setValue(`materials.${index}.${key}`, material[key]);
      });
    });

    // Register construction task fields
    quotationData.constructionTasks.forEach((task, index) => {
      Object.keys(task).forEach((key) => {
        setValue(`constructionTasks.${index}.${key}`, task[key]);
      });
    });
  }, []);

  // Handle terms change
  const handleTermsChange = (e) => {
    const terms = e.target.value;
    setQuotationData((prev) => ({
      ...prev,
      terms,
    }));
    setValue("terms", terms);
  };

  // Handle deposit percentage change
  const handleDepositChange = (e) => {
    const depositPercentage = parseInt(e.target.value) || 0;
    setQuotationData((prev) => ({
      ...prev,
      depositPercentage,
    }));
    setValue("depositPercentage", depositPercentage);
  };

  // Material handling functions
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...quotationData.materials];

    // Ensure cost is stored as a number, not a string
    if (field === "cost") {
      value = parseFloat(value) || 0;
    } else if (field === "quantity") {
      value = parseInt(value) || 0;
    }

    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      materials: updatedMaterials,
    }));

    // Also update the form value
    setValue(`materials.${index}.${field}`, value);
  };

  const addMaterial = () => {
    const newMaterial = {
      materialName: "",
      quantity: 1,
      cost: 0,
      note: "",
    };

    const newIndex = quotationData.materials.length;

    // First update the state
    setQuotationData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));

    // Then register each field with react-hook-form
    Object.keys(newMaterial).forEach((key) => {
      setValue(`materials.${newIndex}.${key}`, newMaterial[key]);
    });
  };

  const removeMaterial = (index) => {
    // Prevent removing if it's the last item
    if (quotationData.materials.length <= 1) {
      alert("At least one material item must remain in the list.");
      return;
    }

    const updatedMaterials = [...quotationData.materials];
    updatedMaterials.splice(index, 1);

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      materials: updatedMaterials,
    }));

    // Re-register all remaining materials with updated indices
    updatedMaterials.forEach((material, idx) => {
      Object.keys(material).forEach((key) => {
        setValue(`materials.${idx}.${key}`, material[key]);
      });
    });
  };

  // Construction task handling functions
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...quotationData.constructionTasks];

    // Ensure cost, length, and width are stored as numbers, not strings
    if (field === "cost") {
      value = parseFloat(value) || 0;
    } else if (field === "area") {
      value = parseInt(value) || 0;
    }

    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
    };

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: updatedTasks,
    }));

    // Also update the form value
    setValue(`constructionTasks.${index}.${field}`, value);
  };

  const addTask = () => {
    const newTask = {
      taskName: "",
      cost: 0,
      unit: "",
      area: 0,
      note: "",
    };

    const newIndex = quotationData.constructionTasks.length;

    // First update the state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: [...prev.constructionTasks, newTask],
    }));

    // Then register each field with react-hook-form
    Object.keys(newTask).forEach((key) => {
      setValue(`constructionTasks.${newIndex}.${key}`, newTask[key]);
    });
  };

  const removeTask = (index) => {
    // Prevent removing if it's the last item
    if (quotationData.constructionTasks.length <= 1) {
      alert("At least one construction task must remain in the list.");
      return;
    }

    const updatedTasks = [...quotationData.constructionTasks];
    updatedTasks.splice(index, 1);

    // Update state
    setQuotationData((prev) => ({
      ...prev,
      constructionTasks: updatedTasks,
    }));

    // Re-register all remaining tasks with updated indices
    updatedTasks.forEach((task, idx) => {
      Object.keys(task).forEach((key) => {
        setValue(`constructionTasks.${idx}.${key}`, task[key]);
      });
    });
  };

  // Helper function to parse potentially formatted number strings
  const parseFormattedNumber = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    // First convert to string
    const stringValue = value.toString();

    // Check if this is a number already formatted by our Input component with formatPrice
    // These values often are formatted in Vietnamese format (e.g., "1.000.000")

    // Remove all dots, commas and spaces
    const cleanStr = stringValue.replace(/[.,\s]/g, "");
    const result = parseFloat(cleanStr);

    // Log the parsing for debugging
    //console.log(`Parsing "${value}" -> "${cleanStr}" -> ${result}`);

    return isNaN(result) ? 0 : result;
  };

  // Total calculation for display
  const calculateMaterialTotal = () => {
    return quotationData.materials.reduce((sum, item) => {
      const cost = parseFormattedNumber(item.cost);
      const quantity = parseFormattedNumber(item.quantity) || 1;
      return sum + cost * quantity;
    }, 0);
  };

  const calculateConstructionTotal = () => {
    return quotationData.constructionTasks.reduce((sum, item) => {
      const cost = parseFormattedNumber(item.cost);
      const area = parseFormattedNumber(item.area);
      return sum + cost * area;
    }, 0);
  };

  // Add this function to calculate product total
  const calculateProductTotal = () => {
    return (
      bookingData?.productDetails?.reduce(
        (total, product) => total + product.quantity * product.unitPrice,
        0
      ) || 0
    );
  };

  // Update the grand total calculation to include products
  const calculateGrandTotal = () => {
    return (
      calculateMaterialTotal() +
      calculateConstructionTotal() +
      calculateProductTotal()
    );
  };

  // Helper function to check if an item is valid
  const isItemValid = (item, type) => {
    if (type === "material") {
      return (
        item.materialName &&
        item.materialName.trim() !== "" &&
        item.quantity > 0 &&
        item.cost &&
        parseFloat(item.cost) > 0
      );
    }
    if (type === "construction") {
      return (
        item.taskName &&
        item.taskName.trim() !== "" &&
        item.unit &&
        item.unit.trim() !== "" &&
        item.area > 0 &&
        item.cost &&
        parseFloat(item.cost) > 0
      );
    }
    return false;
  };

  // Helper function to check if an item is empty
  const isItemEmpty = (item, type) => {
    if (type === "material") {
      // Material is empty if any required field is empty
      return (
        !item.materialName ||
        item.materialName.trim() === "" ||
        !item.quantity ||
        item.quantity <= 0 ||
        !item.cost ||
        parseFloat(item.cost) <= 0
      );
    }
    if (type === "construction") {
      // Construction task is empty if any required field is empty
      return (
        !item.taskName ||
        item.taskName.trim() === "" ||
        !item.unit ||
        item.unit.trim() === "" ||
        !item.area ||
        item.area <= 0 ||
        !item.cost ||
        parseFloat(item.cost) <= 0
      );
    }
    return true;
  };

  // Check if quotation data is valid for submission
  const isQuotationValid = () => {
    // Check if there are any valid materials and construction tasks
    const hasValidMaterials = quotationData.materials.some((item) =>
      isItemValid(item, "material")
    );

    const hasValidTasks = quotationData.constructionTasks.some((item) =>
      isItemValid(item, "construction")
    );

    // Check if there are any empty items (newly added but not filled)
    const hasEmptyMaterials = quotationData.materials.some((item) =>
      isItemEmpty(item, "material")
    );

    const hasEmptyTasks = quotationData.constructionTasks.some((item) =>
      isItemEmpty(item, "construction")
    );

    // Both must have at least one valid item and no empty items
    return (
      hasValidMaterials && hasValidTasks && !hasEmptyMaterials && !hasEmptyTasks
    );
  };

  // Function to preview PDF
  const previewPdf = () => {
    // Reset PDF ready state first to force a complete refresh
    setIsPdfReady(false);

    // Prepare enhanced data for PDF with all customer information
    const enhancedQuotationData = {
      ...quotationData,
      // Customer information
      customerName:
        bookingData?.customer?.fullName || quotationData.customerName,
      customerEmail:
        bookingData?.customer?.email || quotationData.customerEmail,
      customerPhone: bookingData?.customer?.phone || "",
      address: bookingData?.address || "",
      surveyDate: bookingData?.surveyDate,
      // Customer preferences - pass the raw data objects
      designName: bookingData?.designName || "Not specified",
      // Pass all theme colors as an array
      themeColors: bookingData?.themeColors || [],
      // Booking form data - extract specific properties
      spaceType: bookingData?.bookingForm?.spaceStyle || "Not specified",
      roomSize: bookingData?.bookingForm?.roomSize || "Not specified",
      primaryUser: bookingData?.bookingForm?.primaryUser || "Not specified",
      // Scope of work - pass the entire array
      scopeOfWorks: bookingData?.bookingForm?.scopeOfWorks || [],
      // Add related product items
      relatedProductItems: bookingData?.productDetails || [],
    };

    // Show the PDF viewer
    setShowEditor(false);

    // Update the state with the enhanced data
    setQuotationData(enhancedQuotationData);

    // Lazy load PDF preview components with slight delay to ensure state updates
    setTimeout(() => {
      import("../[id]/QuotationPdf").then(() => {
        setIsPdfReady(true);
      });
    }, 50);
  };

  // Function to handle dialog open
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  // Function to handle dialog close
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  // Modify the existing onSubmit function
  const handleConfirmSubmit = async () => {
    handleCloseConfirmDialog();
    await onSubmit();
  };

  // Function to submit quotation and upload PDF
  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      // Use current state rather than form values to ensure deleted items stay deleted
      const currentState = { ...quotationData };

      // Get deposit percentage from form
      const formData = getValues();
      const depositPercentage =
        parseInt(formData.depositPercentage) ||
        currentState.depositPercentage ||
        20;

      // Prepare enhanced data for API submission with flattened properties
      const enhancedQuotationData = {
        ...currentState,
        // Customer information
        customerName:
          bookingData?.customer?.fullName || currentState.customerName,
        customerEmail:
          bookingData?.customer?.email || currentState.customerEmail,
        customerPhone: bookingData?.customer?.phone || "",
        address: bookingData?.address || "",
        surveyDate: bookingData?.surveyDate,
        // Customer preferences - pass the raw data objects
        designName: bookingData?.designName || "Not specified",
        // Pass all theme colors as an array
        themeColors: bookingData?.themeColors || [],
        // Booking form data - extract specific properties
        spaceType: bookingData?.bookingForm?.spaceStyle || "Not specified",
        roomSize: bookingData?.bookingForm?.roomSize || "Not specified",
        primaryUser: bookingData?.bookingForm?.primaryUser || "Not specified",
        // Scope of work - pass the entire array
        scopeOfWorks: bookingData?.bookingForm?.scopeOfWorks || [],
        depositPercentage: depositPercentage,
        // Add related product items
        relatedProductItems: bookingData?.productDetails || [],
      };

      // Create API payload
      const quotationPayload = {
        bookingCode: id,
        materials: enhancedQuotationData.materials,
        constructionTasks: enhancedQuotationData.constructionTasks,
        depositPercentage: depositPercentage,
      };

      // First API call: Create quotation
      createQuotation(quotationPayload, {
        onSuccess: () => {
          generatePdfBlob(enhancedQuotationData)
            .then((pdfBlob) => {
              const formData = new FormData();
              formData.append("file", pdfBlob, `quotation_${id}.pdf`);
              formData.append("bookingCode", id);

              // Second API call: Upload PDF file
              uploadQuotationFile(formData, {
                onSuccess: (uploadResponse) => {
                 // console.log("PDF uploaded successfully:", uploadResponse);
                  setIsProcessing(false);
                  router.push("/seller/request");
                },
                onError: (error) => {
                  console.error("Error uploading PDF:", error);
                  setIsProcessing(false);
                  toast.error(
                    "Quotation was created but PDF upload failed. Please try again."
                  );
                },
              });
            })
            .catch((error) => {
              console.error("Error generating PDF:", error);
              setIsProcessing(false);
              toast.error("Error generating PDF. Please try again.");
            });
        },
        onError: (error) => {
          console.error("Error creating quotation:", error);
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsProcessing(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Helper function to generate PDF blob
  const generatePdfBlob = (enhancedData) => {
    return new Promise((resolve, reject) => {
      import("../[id]/QuotationPdf")
        .then((module) => {
          if (module.generatePdfBlob) {
            module
              .generatePdfBlob(enhancedData)
              .then((blob) => resolve(blob))
              .catch((err) => reject(err));
          } else {
            // If the function doesn't exist, we need to add it to QuotationPdf.js
            reject(new Error("PDF generation function not found"));
          }
        })
        .catch((err) => reject(err));
    });
  };

  // Add the ConfirmationDialog component
  const ConfirmationDialog = () => {
    const dialogVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
          duration: 0.2,
        },
      },
    };

    return (
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        PaperComponent={motion.div}
        slotProps={{
          paper: {
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            variants: dialogVariants,
            sx: {
              bgcolor: 'background.paper',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
            }
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 2,
            pt: 2,
            px: 3,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <MdWarning className="text-yellow-500" size={24} />
            <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Confirm Quotation Submission
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  color: 'info.main',
                  fontWeight: 500
                }
              }}
            >
              Please review the following information before submitting !
            </Alert>

            <List sx={{ '& .MuiListItem-root': { px: 0, py: 1.5 } }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <MdCheckCircle color="green" size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Materials and Labor
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Total: {formatCurrency(calculateMaterialTotal() + calculateConstructionTotal())}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <MdCheckCircle color="green" size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Add-On Products
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Total: {formatCurrency(calculateProductTotal())}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <MdCheckCircle color="green" size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Customer Commitment Deposit Charged
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Amount: {formatCurrency(500000)}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <MdCheckCircle color="green" size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Final Total
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Amount: {formatCurrency(calculateGrandTotal() - 500000)}
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Alert 
              severity="warning" 
              sx={{ 
                mt: 1,
                '& .MuiAlert-message': {
                  color: 'warning.main',
                  fontWeight: 500
                }
              }}
            >
              Once submitted, you cannot modify this quotation.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions 
          sx={{ 
            p: 2.5,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 1
          }}
        >
          <Button
            label="Cancel"
            onClick={handleCloseConfirmDialog}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          />
          <Button
            label={isProcessing ? "Processing..." : "Confirm & Submit"}
            onClick={handleConfirmSubmit}
            className="bg-black text-white hover:bg-gray-900"
            disabled={isProcessing}
            isLoading={isProcessing}
          />
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5 w-fit"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>
      <div className="w-full">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <BodyTypo bodylabel="Creating Quotation" fontWeight="bold" />
            <BodyTypo
              bodylabel={`#${id}`}
              className="bg-primary text-white rounded-md p-2 font-semibold"
            />
          </div>

          <div className="flex gap-3">
            <Button
              label={showEditor ? "Preview PDF" : "Edit Quotation"}
              icon={
                showEditor ? <MdPreview size={20} /> : <MdModeEdit size={20} />
              }
              className="bg-primary h-fit"
              onClick={() => (showEditor ? previewPdf() : setShowEditor(true))}
            />

            <div className="flex flex-col">
              <Button
                label={isProcessing ? "Processing..." : "Submit Quotation"}
                icon={<AiOutlineUpload size={20} />}
                className={
                  isQuotationValid() ? "bg-action text-white w-fit" : "w-fit"
                }
                onClick={handleOpenConfirmDialog}
                disabled={
                  isProcessing ||
                  isCreatingQuotation ||
                  isUploadingFile ||
                  !isQuotationValid()
                }
                isLoading={isProcessing}
              />
            </div>

            {!showEditor && isPdfReady && (
              <QuotationDownloadButton
                quotationData={quotationData}
                key={new Date().getTime()}
              />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col">
          {showEditor ? (
            <TabGroup>
              <TabList className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                      ${
                        selected
                          ? "bg-white dark:bg-gray-900 text-primary shadow"
                          : "hover:bg-white/[0.12] hover:text-primary"
                      }`
                  }
                >
                  <FootTypo footlabel="Information" className="!m-0" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                      ${
                        selected
                          ? "bg-white dark:bg-gray-900 text-primary shadow"
                          : "hover:bg-white/[0.12] hover:text-primary"
                      }`
                  }
                >
                  <FootTypo footlabel="Materials" className="!m-0" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                      ${
                        selected
                          ? "bg-white dark:bg-gray-900 text-primary shadow"
                          : "hover:bg-white/[0.12] hover:text-primary"
                      }`
                  }
                >
                  <FootTypo footlabel="Labour Tasks" className="!m-0" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                      ${
                        selected
                          ? "bg-white dark:bg-gray-900 text-primary shadow"
                          : "hover:bg-white/[0.12] hover:text-primary"
                      }`
                  }
                >
                  <FootTypo footlabel="Terms" className="!m-0" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
                      ${
                        selected
                          ? "bg-white dark:bg-gray-900 text-primary shadow"
                          : "hover:bg-white/[0.12] hover:text-primary"
                      }`
                  }
                >
                  <FootTypo footlabel="Summary" className="!m-0" />
                </Tab>
              </TabList>

              <TabPanels className="mt-4 relative overflow-hidden font-semibold">
                {/* Information Panel */}
                <TabPanel className="animate-tab-fade-in">
                  {isBookingLoading ? (
                    <Card>
                      <CardContent>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="rectangular" height={120} />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card elevation={3}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar
                            userImg={bookingData?.customer?.avatar}
                            alt={bookingData?.customer?.fullName}
                            w={80}
                            h={80}
                          />
                          <Box>
                            <Typography variant="h5" component="div">
                              {bookingData?.customer?.fullName ||
                                quotationData.customerName}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider textAlign="left" sx={{ my: 1 }}>
                          Customer Information
                        </Divider>

                        <Box sx={{ px: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdEmail size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Email
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.customer?.email ||
                                  quotationData.customerEmail ||
                                  "Not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdLocationOn size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Address
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.address ||
                                  quotationData.customerAddress ||
                                  "Not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdLocalPhone size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Phone
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.customer?.phone || "Not provided"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdCalendarToday size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Booked Survey Date
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.surveyDate
                                  ? formatDateVN(bookingData.surveyDate)
                                  : "Not scheduled"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Divider textAlign="left" sx={{ my: 2 }}>
                          Customer Preferences
                        </Divider>

                        <Box sx={{ px: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdColorLens size={22} />
                            </Box>
                            <Box sx={{ ml: 2, flex: 1 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Main Theme Colors
                              </Typography>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                {bookingData?.themeColors?.map(
                                  (color, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        width: 70,
                                        height: 30,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "4px",
                                        backgroundColor: color.colorCode,
                                        border: "1px solid #ddd",
                                      }}
                                    >
                                      <Typography variant="body2" color="white">
                                        {color.colorCode}
                                      </Typography>
                                    </Box>
                                  )
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdHouse size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Space Type
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.bookingForm?.spaceStyle ||
                                  "Not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdSquareFoot size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Room Size
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.bookingForm?.roomSize
                                  ? `${bookingData.bookingForm.roomSize} m²`
                                  : "Not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdPerson size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Party Type
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.bookingForm?.primaryUser ||
                                  "Not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdBuild size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Scope of Work
                              </Typography>
                              {bookingData?.bookingForm?.scopeOfWorks &&
                              bookingData?.bookingForm?.scopeOfWorks?.length >
                                0 ? (
                                bookingData?.bookingForm?.scopeOfWorks.map(
                                  (work, index) => (
                                    <Typography
                                      key={`scope-${index}`}
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {work.workType || "Not specified"}
                                    </Typography>
                                  )
                                )
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Not specified
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 2,
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 40,
                                justifyContent: "center",
                              }}
                            >
                              <MdOutlineDesignServices size={22} />
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Design Preference
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {bookingData?.designName ||
                                  quotationData.customerStylePreference ||
                                  "Not specified"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Divider textAlign="left" sx={{ my: 2 }}>
                          Products Add-Ons
                        </Divider>

                        {bookingData?.productDetails &&
                        bookingData.productDetails.length > 0 ? (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              gutterBottom
                              sx={{ mb: 3 }}
                            >
                              Customer Selected Products (
                              {bookingData.productDetails.length})
                            </Typography>
                            <Grid container spacing={3}>
                              {bookingData.productDetails.map((product) => (
                                <Grid size={3} key={product.id}>
                                  <Card
                                    elevation={2}
                                    sx={{
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                      "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 8,
                                      },
                                    }}
                                  >
                                    <div className="relative w-full h-48">
                                      <Image
                                        src={product.image}
                                        alt={product.productName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{
                                          fontSize: "1.1rem",
                                          fontWeight: "600",
                                          mb: 2,
                                          height: "2.8em",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                        }}
                                      >
                                        {product.productName}
                                      </Typography>

                                      <Stack spacing={1.5}>
                                        <Box className="flex justify-between items-center">
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            Quantity
                                          </Typography>
                                          <Chip
                                            label={product.quantity}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                        </Box>

                                        <Box className="flex justify-between items-center">
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                          >
                                            Price
                                          </Typography>
                                          <Typography
                                            variant="body1"
                                            color="primary"
                                            sx={{ fontWeight: 600 }}
                                          >
                                            {formatCurrency(product.unitPrice)}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </CardContent>
                                    <CardActions
                                      sx={{
                                        bgcolor: "grey.50",
                                        borderTop: 1,
                                        borderColor: "grey.200",
                                        p: 2,
                                      }}
                                    >
                                      <Box className="flex justify-between items-center w-full">
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          Total
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          color="primary.main"
                                          sx={{ fontWeight: 700 }}
                                        >
                                          {formatCurrency(
                                            product.quantity * product.unitPrice
                                          )}
                                        </Typography>
                                      </Box>
                                    </CardActions>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>

                            <Card
                              elevation={2}
                              sx={{
                                mt: 3,
                                borderRadius: 2,
                              }}
                            >
                              <CardContent
                                sx={{ py: 2, "&:last-child": { pb: 2 } }}
                              >
                                <Box className="flex justify-between items-center">
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Total Products Cost
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700 }}
                                  >
                                    {formatCurrency(
                                      bookingData.productDetails.reduce(
                                        (total, product) =>
                                          total +
                                          product.quantity * product.unitPrice,
                                        0
                                      )
                                    )}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              textAlign: "center",
                              py: 4,
                              px: 2,
                              bgcolor: "grey.50",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              No products have been added yet.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabPanel>

                {/* Materials Panel */}
                <TabPanel className="animate-tab-slide-right">
                  <MaterialTab
                    materials={quotationData.materials}
                    onMaterialChange={handleMaterialChange}
                    onAddMaterial={addMaterial}
                    onRemoveMaterial={removeMaterial}
                    calculateMaterialTotal={calculateMaterialTotal}
                    register={register}
                    control={control}
                  />
                </TabPanel>

                {/* Labour Panel */}
                <TabPanel className="animate-tab-slide-left">
                  <LabourTab
                    constructionTasks={quotationData.constructionTasks}
                    onTaskChange={handleTaskChange}
                    onAddTask={addTask}
                    onRemoveTask={removeTask}
                    calculateConstructionTotal={calculateConstructionTotal}
                    register={register}
                    control={control}
                  />
                </TabPanel>

                {/* Terms Panel */}
                <TabPanel className="animate-tab-slide-right">
                  <TermTab
                    register={register}
                    value={quotationData.terms}
                    depositPercentage={quotationData.depositPercentage}
                    onTermsChange={handleTermsChange}
                    onDepositChange={handleDepositChange}
                  />
                </TabPanel>

                {/* Summary Panel */}
                <TabPanel className="animate-tab-fade-in">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-bold mb-4">
                        Quotation Summary
                      </h3>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <span>Materials Total:</span>
                        <span className="font-bold">
                          {formatCurrency(calculateMaterialTotal())}
                        </span>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <span>Construction Total:</span>
                        <span className="font-bold">
                          {formatCurrency(calculateConstructionTotal())}
                        </span>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <span>Products Total:</span>
                        <span className="font-bold">
                          {formatCurrency(calculateProductTotal())}
                        </span>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <span>Customer Commitment Deposit Charged:</span>
                        <span className="font-bold text-red">
                          -{formatCurrency(500000)}
                        </span>
                      </Box>
                    </div>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className="border-b pb-4"
                    >
                      <FootTypo
                        fontWeight={600}
                        fontSize={16}
                        footlabel="Subtotal:"
                      />
                      <FootTypo
                        fontWeight={600}
                        fontSize={16}
                        footlabel={`${formatCurrency(
                          calculateGrandTotal()
                        )}`}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      className="bg-primary/10 p-4 rounded-lg"
                    >
                      <FootTypo
                        fontWeight={700}
                        fontSize={18}
                        footlabel="Final Total:"
                      />
                      <FootTypo
                        fontWeight={700}
                        fontSize={18}
                        footlabel={`${formatCurrency(
                          calculateGrandTotal() - 500000
                        )}`}
                      />
                    </Box>

                    {bookingData?.productDetails &&
                      bookingData.productDetails.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ mb: 1.5, fontWeight: 600 }}
                          >
                            Additional Products:
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              bgcolor: "background.paper",
                            }}
                          >
                            {bookingData.productDetails.map(
                              (product, index) => (
                                <Box
                                  key={product.id}
                                  sx={{
                                    p: 1.5,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom:
                                      index !==
                                      bookingData.productDetails.length - 1
                                        ? 1
                                        : 0,
                                    borderColor: "divider",
                                    "&:hover": {
                                      bgcolor: "action.hover",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "relative",
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <Image
                                        src={product.image}
                                        alt={product.productName}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                        unoptimized
                                      />
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500 }}
                                      >
                                        {product.productName}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Quantity: {product.quantity}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {formatCurrency(
                                        product.quantity * product.unitPrice
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {formatCurrency(product.unitPrice)} /each
                                    </Typography>
                                  </Box>
                                </Box>
                              )
                            )}
                          </Paper>
                        </Box>
                      )}
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          ) : (
            <div className="bg-transparent h-[90vh]">
              {isPdfReady ? (
                <PdfPreview
                  quotationData={quotationData}
                  key={new Date().getTime()}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading PDF preview...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        <ConfirmationDialog />
      </AnimatePresence>
    </SellerWrapper>
  );
};

// We only load the PDF components when needed
const PdfPreview = ({ quotationData }) => {
  const [Component, setComponent] = useState(null);

  console.log("PdfPreview received enhanced data:", quotationData);

  useEffect(() => {
    import("../[id]/QuotationPdf").then((module) => {
      setComponent(() => module.PdfPreview);
    });
  }, []);

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use the data directly without any caching or refs
  return <Component quotationData={quotationData} />;
};

const QuotationDownloadButton = ({ quotationData }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    import("../[id]/QuotationPdf").then((module) => {
      setComponent(() => module.PdfDownloadButton);
    });
  }, []);

  if (!Component) {
    return (
      <Button
        label="Loading..."
        icon={<IoDownloadOutline size={20} />}
        className="bg-gray-400"
        disabled
      />
    );
  }

  // Use the data directly
  return <Component quotationData={quotationData} />;
};

export default QuotationPage;

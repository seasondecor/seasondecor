"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  FormControl,
  TextField,
  IconButton,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Slide,
  Select,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { MdClose, MdArrowBack, MdArrowForward } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import ThemePalette from "@/app/components/ui/themePalette/ThemePalatte";
import DesignStyle from "@/app/components/ui/designStyle/DesignStyle";
import Button from "@/app/components/ui/Buttons/Button";
import { PointerHighlight } from "@/app/components/ui/animated/PointerHiglight";
import { propertyTypes } from "@/app/constant/property";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Grid from "@mui/material/Grid2";
import { TbCurrencyDong, TbMeterSquare } from "react-icons/tb";
import Particles from "@/app/components/ui/animated/Particles";
import { useGetListWorkScope } from "@/app/queries/list/workscope.list.query";
import { Autocomplete } from "@mui/material";
import AdditionalCard from "./AdditionalCard";
import { useGetRelatedProductForBooking } from "@/app/queries/list/service.list.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { formatMoney, formatCurrency } from "@/app/helpers";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  useAddProductToService,
  useUpdateProductInService,
  useRemoveProductFromService,
} from "@/app/queries/service/service.query";
import { toast } from "sonner";
import { useGetAddedProducts } from "@/app/queries/service/service.query";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide ref={ref} {...props} />;
});

const getDesignStyleName = (styleId) => {
  const styleMap = {
    1: "Modern",
    2: "Traditional",
    3: "Coastal",
    4: "Scandinavian",
    5: "Industrial",
  };
  return styleMap[styleId] || "Unknown Style";
};

const CustomizeModal = ({ open, onClose, onSubmit, onSkip, serviceDetail }) => {
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(0);
  const [wantCustomize, setWantCustomize] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const {
    mutate: addProductToService,
    isPending: isAddProductToServiceLoading,
  } = useAddProductToService();
  const {
    mutate: updateProductInService,
    isPending: isUpdateProductInServiceLoading,
  } = useUpdateProductInService();
  const {
    mutate: removeProductFromService,
    isPending: isRemoveProductFromServiceLoading,
  } = useRemoveProductFromService();

  const { data: addedProducts, isPending: isAddedProductsLoading } =
    useGetAddedProducts(serviceDetail?.id);

  // Handle pagination change
  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  const { data: workScopeList, isPending: isWorkScopeLoading } =
    useGetListWorkScope();

  const [customData, setCustomData] = useState({
    note: "",
    selectedDesign: "",
    selectedColors: [],
    propertyType: "",
    spaceArea: "",
    estimatedBudget: "",
    primaryUser: "",
    workScopes: [],
  });

  const { data: relatedProducts, isPending: isRelatedProductLoading } =
    useGetRelatedProductForBooking({
      ...pagination,
      serviceId: serviceDetail?.id,
    });

  const products = relatedProducts?.data || [];
  const totalCount = relatedProducts?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const steps = [
    "Customization Choice",
    "Design Preferences",
    "Color Themes",
    "Specific Information",
    "Additional Notes",
    "Additional Products",
    "Review",
  ];

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleCustomizationChoice = (choice) => {
    setWantCustomize(choice);
    if (choice === false) {
      onSkip();
    } else {
      handleNext();
    }
  };

  const handleDesignSelection = (designId) => {
    setCustomData((prev) => ({
      ...prev,
      selectedDesign: designId,
    }));
  };

  const handleColorSelection = (colorId) => {
    setCustomData((prev) => {
      const exists = prev.selectedColors.includes(colorId);
      return {
        ...prev,
        selectedColors: exists
          ? prev.selectedColors.filter((id) => id !== colorId)
          : [...prev.selectedColors, colorId],
      };
    });
  };

  const handlePropertyTypeChange = (event) => {
    setCustomData((prev) => ({
      ...prev,
      propertyType: event.target.value,
    }));
  };

  const handleImageChange = (files) => {
    const imageFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(imageFiles);
  };

  const handleImageDelete = (indexToRemove) => {
    setImages((prevImages) => {
      // Revoke the URL of the image being removed
      if (prevImages[indexToRemove]?.preview) {
        URL.revokeObjectURL(prevImages[indexToRemove].preview);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const handleSubmitCustomization = () => {
    const formData = {
      note: customData.note,
      selectedDesign: customData.selectedDesign,
      selectedColors: customData.selectedColors,
      propertyType: customData.propertyType,
      spaceArea: customData.spaceArea,
      estimatedBudget: customData.estimatedBudget,
      primaryUser: customData.primaryUser,
      workScopes: customData.workScopes,
      images: images.map((img) => img.file),
    };

    onSubmit(formData);
    onClose(); // Close the dialog after submitting
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  // Add this function to handle money input
  const handleMoneyInput = (e) => {
    const value = e.target.value;
    // Remove any non-digit characters
    const rawValue = value.replace(/\D/g, "");
    // Update state with raw value
    setCustomData((prev) => ({
      ...prev,
      estimatedBudget: rawValue,
    }));
  };

  // Handle adding product to service
  const handleAddProductToService = (productId, quantity) => {
    addProductToService(
      {
        serviceId: serviceDetail?.id,
        productId: productId,
        quantity: quantity,
      },
      {
        onSuccess: () => {},
        onError: (error) => {
          console.error("Error adding product:", error);
          toast.error("Failed to add product");
        },
      }
    );
  };

  // Handle updating product quantity
  const handleUpdateProductQuantity = (productId, quantity) => {
    updateProductInService(
      {
        serviceId: serviceDetail?.id,
        productId: productId,
        quantity: quantity,
      },
      {
        onSuccess: () => {},
        onError: (error) => {
          console.error("Error updating quantity:", error);
          toast.error("Failed to update quantity");
        },
      }
    );
  };

  // Handle removing product
  const handleRemoveProduct = (productId) => {
    removeProductFromService(
      {
        serviceId: serviceDetail?.id,
        productId: productId,
      },
      {
        onSuccess: () => {},
        onError: (error) => {
          console.error("Error removing product:", error);
          toast.error("Failed to remove product");
        },
      }
    );
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
      slotProps={{
        transition: {
          direction: "up",
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "white",
          backgroundImage: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: { xs: 2, md: 4 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 10,
          }}
        >
          <MdClose size={24} />
        </IconButton>

        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, textAlign: "center", mt: 2 }}
          fontWeight="bold"
        >
          Survey Form for{" "}
          <span className="underline">{serviceDetail?.style}</span>
        </Typography>

        <Stepper
          activeStep={step}
          sx={{ mb: 4, mx: 4, display: { xs: "none", md: "flex" } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <DialogContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Customization Choice */}
            {step === 0 && (
              <motion.div
                key="step0"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center justify-center w-full min-h-[60vh]"
              >
                <motion.img
                  src="/img/custom-bg.png"
                  alt="Customize Illustration"
                  className="w-full max-w-[400px] mx-auto mb-8 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                />
                <div className="text-center max-w-[600px] mx-auto">
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Would you like to provide
                    <PointerHighlight
                      rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                      pointerClassName="text-yellow"
                      containerClassName="inline-block ml-2"
                    >
                      <span className="relative z-10">
                        customization preferences
                      </span>
                    </PointerHighlight>
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    This will help the service provider to better understand
                    your needs
                  </Typography>

                  <Alert severity="info">
                    This is optional, you can{" "}
                    <strong>Skip</strong> {""}this form if you don't want to
                    provide any customization preferences.
                  </Alert>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 4,
                    }}
                  >
                    <Button
                      label="Not now"
                      onClick={() => handleCustomizationChoice(false)}
                      className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    />
                    <Button
                      icon={<MdArrowForward />}
                      label="Get Started"
                      onClick={() => handleCustomizationChoice(true)}
                      className="min-w-[120px] bg-action text-white hover:bg-action/90"
                    />
                  </Box>
                </div>
              </motion.div>
            )}

            {/* Step 1: Design Preferences */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-start justify-center w-full min-h-[60vh]"
              >
                <Typography variant="h5" gutterBottom mb={4}>
                  Select your preferred
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow"
                    containerClassName="inline-block ml-2"
                  >
                    <span className="relative z-10">design styles</span>
                  </PointerHighlight>
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Choose the design styles you prefer
                </Typography>

                <Box sx={{ mt: 3, mb: 3, width: "100%" }}>
                  {serviceDetail?.designs && (
                    <DesignStyle
                      styles={serviceDetail.designs}
                      selectable
                      selectedStyle={customData.selectedDesign}
                      onSelectStyle={handleDesignSelection}
                    />
                  )}
                </Box>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                      position: "sticky",
                      top: 24,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "#1a1a1a",
                        fontSize: "1.25rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Design Style Guide
                    </Typography>

                    {customData.selectedDesign ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            p: 3,
                            borderRadius: "12px",
                            backgroundColor:
                              customData.selectedDesign === 1
                                ? "rgba(37, 99, 235, 0.05)"
                                : customData.selectedDesign === 2
                                ? "rgba(147, 51, 234, 0.05)"
                                : customData.selectedDesign === 3
                                ? "rgba(8, 145, 178, 0.05)"
                                : customData.selectedDesign === 4
                                ? "rgba(5, 150, 105, 0.05)"
                                : "rgba(71, 85, 105, 0.05)",
                            border: "1px solid",
                            borderColor:
                              customData.selectedDesign === 1
                                ? "rgba(37, 99, 235, 0.1)"
                                : customData.selectedDesign === 2
                                ? "rgba(147, 51, 234, 0.1)"
                                : customData.selectedDesign === 3
                                ? "rgba(8, 145, 178, 0.1)"
                                : customData.selectedDesign === 4
                                ? "rgba(5, 150, 105, 0.1)"
                                : "rgba(71, 85, 105, 0.1)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 2,
                              color:
                                customData.selectedDesign === 1
                                  ? "#2563eb"
                                  : customData.selectedDesign === 2
                                  ? "#9333ea"
                                  : customData.selectedDesign === 3
                                  ? "#0891b2"
                                  : customData.selectedDesign === 4
                                  ? "#059669"
                                  : "#475569",
                              fontSize: "1.1rem",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getDesignStyleName(customData.selectedDesign)}
                            <Box
                              component="span"
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor:
                                  customData.selectedDesign === 1
                                    ? "#2563eb"
                                    : customData.selectedDesign === 2
                                    ? "#9333ea"
                                    : customData.selectedDesign === 3
                                    ? "#0891b2"
                                    : customData.selectedDesign === 4
                                    ? "#059669"
                                    : "#475569",
                                display: "inline-block",
                              }}
                            />
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4b5563",
                              lineHeight: 1.8,
                              fontSize: "0.95rem",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {customData.selectedDesign === 1 &&
                              "Clean lines, minimalism, and a neutral color palette define Modern design. It often incorporates sleek materials like glass, steel, and polished wood for a sophisticated and uncluttered look."}
                            {customData.selectedDesign === 2 &&
                              "Elegant and timeless, Traditional design features classic furniture, rich colors, and ornate details. It draws inspiration from 18th and 19th-century European décor, creating a warm and formal atmosphere."}
                            {customData.selectedDesign === 3 &&
                              "Light, airy, and relaxed, Coastal design takes cues from the beach. Think soft blues, whites, natural textures like rattan and linen, and plenty of natural light to evoke a seaside vibe."}
                            {customData.selectedDesign === 4 &&
                              "Scandinavian design emphasizes simplicity, functionality, and coziness. It features neutral tones, natural wood, and clean lines, often with touches of hygge—comfort and warmth."}
                            {customData.selectedDesign === 5 &&
                              "Inspired by warehouses and factories, Industrial design showcases raw materials like exposed brick, metal, and wood. It's rugged, edgy, and utilitarian, often with a masculine aesthetic."}
                          </Typography>
                        </Box>
                      </motion.div>
                    ) : (
                      <Alert
                        severity="info"
                        sx={{
                          mt: 2,
                          borderRadius: "12px",
                          "& .MuiAlert-message": {
                            fontSize: "0.925rem",
                            color: "#3b82f6",
                          },
                          "& .MuiAlert-icon": {
                            color: "#3b82f6",
                          },
                          backgroundColor: "#eff6ff",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        Select a design style to see its description
                      </Alert>
                    )}
                  </Paper>
                </motion.div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                    width: "100%",
                  }}
                >
                  <Button
                    icon={<MdArrowBack />}
                    label="Back"
                    onClick={handleBack}
                    className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  />
                  <Button
                    icon={<MdArrowForward />}
                    label="Next"
                    onClick={handleNext}
                    className="min-w-[120px] bg-action text-white"
                  />
                </Box>
              </motion.div>
            )}

            {/* Step 2: Color Themes */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-start justify-center w-full min-h-[60vh]"
              >
                <Typography variant="h5" gutterBottom mb={4}>
                  Select
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow"
                    containerClassName="inline-block ml-2"
                  >
                    <span className="relative z-10">color themes</span>
                  </PointerHighlight>
                </Typography>

                <Box sx={{ width: "100%" }}>
                  {serviceDetail?.themeColors && (
                    <ThemePalette
                      colors={serviceDetail.themeColors}
                      title="Available Color Themes"
                      selectable
                      selectedColors={customData.selectedColors}
                      onSelectColor={handleColorSelection}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                    width: "100%",
                  }}
                >
                  <Button
                    icon={<MdArrowBack />}
                    label="Back"
                    onClick={handleBack}
                    className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  />
                  <Button
                    icon={<MdArrowForward />}
                    label="Next"
                    onClick={handleNext}
                    className="min-w-[120px] bg-action text-white hover:bg-action/90"
                  />
                </Box>
              </motion.div>
            )}

            {/* Step 3: Specific Information */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <Grid container spacing={4} sx={{ minHeight: "60vh" }}>
                  {/* Left Column - Form */}
                  <Grid
                    size={{ xs: 12, md: 7 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 2, md: 4 },
                    }}
                  >
                    <Typography variant="h5" gutterBottom mb={4}>
                      Tell us more about your
                      <PointerHighlight
                        rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                        pointerClassName="text-yellow"
                        containerClassName="inline-block ml-2"
                      >
                        <span className="relative z-10">
                          specific information
                        </span>
                      </PointerHighlight>
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Please provide any additional details or requirements
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        className="mb-1"
                      >
                        Property Type
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <Select
                          value={customData.propertyType}
                          onChange={(e) =>
                            setCustomData((prev) => ({
                              ...prev,
                              propertyType: e.target.value,
                            }))
                          }
                          displayEmpty
                          placeholder="Property Type"
                          sx={{
                            borderRadius: "8px",
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#E2E8F0",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <span className="text-gray-500">
                              Select Property Type
                            </span>
                          </MenuItem>
                          {propertyTypes.map((property) => (
                            <MenuItem key={property.id} value={property.name}>
                              <span className="flex items-center gap-2">
                                <property.icon size={20} />
                                {property.name}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            className="mb-1"
                          >
                            Space Area
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Space Area (sqm)"
                            type="number"
                            value={customData.spaceArea}
                            onChange={(e) =>
                              setCustomData((prev) => ({
                                ...prev,
                                spaceArea: e.target.value,
                              }))
                            }
                            InputProps={{
                              inputProps: {
                                min: 0,
                              },
                              endAdornment: (
                                <span className="text-gray-500">
                                  <TbMeterSquare size={20} />
                                </span>
                              ),
                            }}
                            sx={{
                              mb: 3,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: "white",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E2E8F0",
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            className="mb-1"
                          >
                            Estimated Budget
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Enter your budget"
                            value={formatMoney(customData.estimatedBudget)}
                            onChange={handleMoneyInput}
                            InputProps={{
                              inputProps: {
                                min: 0,
                              },
                              startAdornment: (
                                <span className="text-gray-500">
                                  <TbCurrencyDong size={20} className="mr-1" />
                                </span>
                              ),
                              inputProps: {
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              },
                            }}
                            sx={{
                              mb: 3,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: "white",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#E2E8F0",
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        className="mb-1"
                      >
                        Primary User
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <Select
                          value={customData.primaryUser}
                          onChange={(e) =>
                            setCustomData((prev) => ({
                              ...prev,
                              primaryUser: e.target.value,
                            }))
                          }
                          displayEmpty
                          placeholder="Primary User"
                          sx={{
                            borderRadius: "8px",
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#E2E8F0",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <span className="text-gray-500">Primary User</span>
                          </MenuItem>
                          <MenuItem value="Family">Family</MenuItem>
                          <MenuItem value="Couple">Couple</MenuItem>
                          <MenuItem value="Single">Single</MenuItem>
                          <MenuItem value="Shared">Shared Living</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>

                      {/* Work Scope */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        className="mb-1"
                      >
                        Scope of Work
                      </Typography>
                      <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
                        Tell provider about the scope of work you want to
                        customize which helps provider to have better
                        preparation.
                      </Alert>
                      <Autocomplete
                        multiple
                        fullWidth
                        options={workScopeList || []}
                        value={customData.workScopes || []}
                        onChange={(_, newValue) => {
                          setCustomData((prev) => ({
                            ...prev,
                            workScopes: newValue,
                          }));
                        }}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.workType}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        loading={isWorkScopeLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select scope of work"
                            sx={{
                              mb: 3,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                backgroundColor: "white",
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option, { selected }) => {
                          const { key, ...rest } = props;
                          return (
                            <MenuItem
                              key={key}
                              {...rest}
                              value={option.id}
                              sx={{ justifyContent: "space-between" }}
                            >
                              <div className="flex flex-row items-center gap-2">
                                <span>{option.workType}</span>
                              </div>
                              {selected ? (
                                <FaCheck color="info" className="ml-2" />
                              ) : null}
                            </MenuItem>
                          );
                        }}
                      />

                      <div className="mb-6">
                        <Typography
                          variant="subtitle1"
                          className="font-medium mb-1"
                        >
                          Upload Reference Images
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Upload up to 5 images that represent your space
                        </Typography>
                        <ImageUpload
                          onImageChange={handleImageChange}
                          onImageDelete={handleImageDelete}
                          existingImages={images.map((img) => ({
                            dataURL: img.preview,
                            file: img.file,
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 4,
                          gap: 2,
                        }}
                      >
                        <Button
                          icon={<MdArrowBack />}
                          label="Back"
                          onClick={handleBack}
                          className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        />
                        <Button
                          icon={<MdArrowForward />}
                          label="Next"
                          onClick={handleNext}
                          className="min-w-[120px] bg-action text-white"
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Column - Background/Illustration */}
                  <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F8FAFC",
                      borderRadius: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 3,
                        position: "relative",
                      }}
                    >
                      <Particles
                        particleColors={["#000000", "#000000"]}
                        particleCount={300}
                        particleSpread={10}
                        speed={0.1}
                        particleBaseSize={100}
                        moveParticlesOnHover={true}
                        alphaParticles={false}
                        disableRotation={false}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            padding: 4,
                            marginX: 4,
                            borderRadius: "16px",
                            bgcolor: "transparent",
                          }}
                        >
                          <motion.img
                            src="/img/custom-bg.png"
                            alt="Customize Illustration"
                            className="w-full max-w-[500px] mx-auto rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          />
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            mx="30px"
                            className="break-after-auto text-center"
                          >
                            Your informations will help us to create a better
                            decoration for your space
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Step 4: Additional Notes */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <Typography variant="h5" gutterBottom mb={4}>
                  Add Your
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow"
                    containerClassName="inline-block ml-2"
                  >
                    <span className="relative z-10">Additional Notes</span>
                  </PointerHighlight>
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Special Requirements or Notes
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Please provide any additional requirements, preferences, or
                    special notes for the service provider.
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Enter your notes here..."
                    value={customData.note}
                    onChange={(e) =>
                      setCustomData((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "white",
                      },
                    }}
                  />
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    icon={<MdArrowBack />}
                    label="Back"
                    onClick={handleBack}
                    className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  />
                  <Button
                    icon={<MdArrowForward />}
                    label="Next"
                    onClick={handleNext}
                    className="min-w-[120px] bg-action text-white"
                  />
                </Box>
              </motion.div>
            )}

            {/* Step 5: Additional Products */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <Typography variant="h5" gutterBottom mb={4}>
                  Base on your request, we suggest for you some decorative furnitures to
                  make your
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow"
                    containerClassName="inline-block mx-2"
                  >
                    <span className="relative z-10">
                      {serviceDetail?.categoryName}
                    </span>
                  </PointerHighlight>
                  more beautiful
                </Typography>

                <Grid container spacing={12}>
                  <DataMapper
                    data={products}
                    Component={AdditionalCard}
                    emptyStateComponent={
                      <EmptyState title="No products found" />
                    }
                    loading={isRelatedProductLoading}
                    getKey={(item) => item.id}
                    componentProps={(product) => ({
                      image: product.imageUrls,
                      productName: product.productName,
                      rate: product.rate,
                      price: product.productPrice,
                      totalQuantity: product.quantity,
                      totalSold: product.totalSold,
                      description: product.description,
                      category: product.category,
                      productId: product.id,
                      id: product.id,
                      relatedProducts: addedProducts || [],
                      onAddProduct: handleAddProductToService,
                      onUpdateQuantity: handleUpdateProductQuantity,
                      onRemoveProduct: handleRemoveProduct,
                      isLoading:
                        isAddProductToServiceLoading ||
                        isUpdateProductInServiceLoading ||
                        isRemoveProductFromServiceLoading,
                    })}
                  />
                </Grid>
                {totalCount > 0 && (
                  <div className="flex justify-center mt-4 gap-4">
                    <button
                      onClick={() =>
                        pagination.pageIndex > 1 &&
                        handlePaginationChange(pagination.pageIndex - 1)
                      }
                      disabled={pagination.pageIndex <= 1}
                      className="p-1 border rounded-full disabled:opacity-50"
                    >
                      <IoIosArrowBack size={20} />
                    </button>
                    <span className="flex items-center">
                      Page {pagination.pageIndex} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        pagination.pageIndex < totalPages &&
                        handlePaginationChange(pagination.pageIndex + 1)
                      }
                      disabled={pagination.pageIndex >= totalPages}
                      className="p-1 border rounded-full disabled:opacity-50"
                    >
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    icon={<MdArrowBack />}
                    label="Back"
                    onClick={handleBack}
                    className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  />
                  <Button
                    icon={<MdArrowForward />}
                    label="Next"
                    onClick={handleNext}
                    className="min-w-[120px] bg-action text-white"
                  />
                </Box>
              </motion.div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <motion.div
                key="step6"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <Typography variant="h5" gutterBottom mb={4}>
                  Review Your
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow"
                    containerClassName="inline-block ml-2"
                  >
                    <span className="relative z-10">Selections</span>
                  </PointerHighlight>
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    {/* Design Style */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Design Preferences
                      </Typography>
                      {customData.selectedDesign ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {getDesignStyleName(customData.selectedDesign)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Selected Design Style
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity="warning">
                          No design style selected
                        </Alert>
                      )}
                    </Paper>

                    {/* Color Themes */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Color Themes
                      </Typography>
                      {customData.selectedColors?.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {customData.selectedColors.map((selectedColorId) => {
                            // Find the matching color from serviceDetail
                            const colorDetails =
                              serviceDetail?.themeColors?.find(
                                (color) => color.id === selectedColorId
                              );

                            return colorDetails ? (
                              <Box
                                key={colorDetails.id}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: 1,
                                  backgroundColor: "action.selected",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: colorDetails.colorCode,
                                    border: "1px solid",
                                    borderColor: "divider",
                                  }}
                                />
                                <Typography variant="body2">
                                  {colorDetails.colorCode}
                                </Typography>
                              </Box>
                            ) : null;
                          })}
                        </Box>
                      ) : (
                        <Alert severity="warning">
                          No color themes selected
                        </Alert>
                      )}
                    </Paper>

                    {/* Property Details */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Property Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Property Type
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {customData.propertyType || "Not specified"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Space Area
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {customData.spaceArea
                              ? `${customData.spaceArea} m²`
                              : "Not specified"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Primary User
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {customData.primaryUser || "Not specified"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Estimated Budget
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {customData.estimatedBudget
                              ? `${formatMoney(customData.estimatedBudget)} đ`
                              : "Not specified"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Work Scopes */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Selected Work Scopes
                      </Typography>
                      {customData.workScopes?.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {customData.workScopes.map((scope) => (
                            <Box
                              key={scope.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 2,
                                borderRadius: 1,
                                backgroundColor: "action.selected",
                              }}
                            >
                              <Typography variant="body1">
                                {scope.workType}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Alert severity="warning">
                          No work scopes selected
                        </Alert>
                      )}
                    </Paper>

                    {/* Additional Notes */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Additional Notes
                      </Typography>
                      {customData.note ? (
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {customData.note}
                        </Typography>
                      ) : (
                        <Alert severity="info">
                          No additional notes provided
                        </Alert>
                      )}
                    </Paper>

                    {/* Added Products */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Added Products
                      </Typography>
                      {addedProducts && addedProducts.length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {addedProducts.map((product) => (
                            <Box
                              key={product.productId}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 2,
                                borderRadius: 1,
                                backgroundColor: "action.selected",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 60,
                                  height: 60,
                                  position: "relative",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                }}
                              >
                                <Image
                                  src={product.image}
                                  alt={product.productName}
                                  fill
                                  style={{ objectFit: "cover" }}
                                  sizes="(max-width: 768px) 100vw, 60px"
                                />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={500}
                                >
                                  {product.productName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Quantity: {product.quantity} ×{" "}
                                  {formatCurrency(product.unitPrice)}
                                </Typography>
                              </Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {formatCurrency(
                                  product.quantity * product.unitPrice
                                )}
                              </Typography>
                            </Box>
                          ))}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              pt: 2,
                              borderTop: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="h6" fontWeight={600}>
                              Total:{" "}
                              {formatCurrency(
                                addedProducts.reduce(
                                  (sum, product) =>
                                    sum + product.quantity * product.unitPrice,
                                  0
                                )
                              )}
                            </Typography>
                          </Box>
                          <Alert severity="info">
                            This cost will be included in your quotation during
                            the design process.
                          </Alert>
                        </Box>
                      ) : (
                        <Alert severity="info">No products added</Alert>
                      )}
                    </Paper>

                    {/* Reference Images */}
                    {images?.length > 0 && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          Reference Images
                        </Typography>
                        <Grid container spacing={2}>
                          {images.map((image, index) => (
                            <Grid key={index} size={{ xs: 6, md: 4 }}>
                              <Box
                                sx={{
                                  width: "100%",
                                  paddingTop: "100%",
                                  position: "relative",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={image.preview}
                                  alt={`Reference ${index + 1}`}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        position: "sticky",
                        top: 24,
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Ready to Complete?
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        Please review all your selections carefully. You can go
                        back to make any changes if needed.
                      </Typography>
                      <Box sx={{ mt: 3 }}>
                        <Button
                          icon={<BsCheckCircleFill />}
                          label="Finish"
                          onClick={handleSubmitCustomization}
                          className="w-[120px] bg-action text-white hover:bg-action/90"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                    gap: 2,
                  }}
                >
                  <Button
                    icon={<MdArrowBack />}
                    label="Back"
                    onClick={handleBack}
                    className="min-w-[120px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CustomizeModal;

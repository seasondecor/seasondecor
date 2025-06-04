"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams } from "next/navigation";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import {
  useGetQuotationDetailByCustomerId,
  useConfirmQuotation,
} from "@/app/queries/quotation/quotation.query";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { formatDate, formatCurrency } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import DataTable from "@/app/components/ui/table/DataTable";
import { TbLayoutList, TbFileText } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import {
  Divider,
  Tooltip,
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Button as MuiButton,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IoIosRemove } from "react-icons/io";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useDispatch } from "react-redux";
import {
  setQuotationExisted,
  setQuotationSigned,
  setQuotationConfirmed,
} from "@/app/lib/redux/reducers/quotationSlice";
import { Skeleton, Alert } from "@mui/material";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { MdNotes } from "react-icons/md";
import QuotationChangeRequestView from "../View/View";
import { motion } from "framer-motion";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Create styled motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionAvatar = motion(Avatar);

const QuotationDetailPage = () => {
  const params = useParams();
  const slug = params.slug;
  const [processedMaterials, setProcessedMaterials] = useState([]);
  const [processedTasks, setProcessedTasks] = useState([]);
  const [isStatusChecked, setIsStatusChecked] = useState(false);
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState(false);
  const { mutate: confirmQuotation, isPending: isConfirming } =
    useConfirmQuotation();

  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const {
    data: quotationDetail,
    isLoading: isQuotationDetailLoading,
    refetch: refetchQuotationDetail,
  } = useGetQuotationDetailByCustomerId(slug);

  const [openTermsDialog, setOpenTermsDialog] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const theme = useTheme();

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

  // First effect: Process quotation details and update Redux store
  useEffect(() => {
    if (quotationDetail) {
      const materials = normalizeArray(quotationDetail.materials);
      const tasks = normalizeArray(quotationDetail.constructionTasks);

      setProcessedMaterials(materials);
      setProcessedTasks(tasks);

      // First, track if the contract is signed
      dispatch(setQuotationSigned(quotationDetail.isSigned || false));

      // Now set the quotationExisted state
      // We want this true ONLY if isQuoteExisted is true AND BOTH isContractExisted and isSigned are false
      const shouldExist =
        quotationDetail.isQuoteExisted &&
        !(quotationDetail.isContractExisted && quotationDetail.isSigned);

      dispatch(setQuotationExisted(shouldExist));

      setIsStatusChecked(true);
    }

    if (quotationDetail?.status === 1) {
      dispatch(setQuotationConfirmed(true));
    } else {
      dispatch(setQuotationConfirmed(false));
    }

    // Cleanup function to reset state when unmounting or changing quotation
    return () => {
      dispatch(setQuotationExisted(false));
      dispatch(setQuotationSigned(false));
      dispatch(setQuotationConfirmed(false));
      setIsStatusChecked(false);
    };
  }, [quotationDetail, dispatch, slug]);

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
  };

  if (isQuotationDetailLoading) {
    return (
      <Container>
        <div className="my-4">
          <Skeleton variant="text" width={300} height={30} />
        </div>

        <div className="flex my-4 border-b">
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ mr: 2 }}
          />
          <Skeleton variant="rectangular" width={120} height={40} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Skeleton variant="rectangular" height={150} />
            <Skeleton variant="rectangular" height={150} />
          </div>

          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />

          <div>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" height={140} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const materialColumns = [
    {
      header: "Material Name",
      accessorKey: "materialName",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
    {
      header: "Total Cost",
      accessorKey: "totalCost",
      cell: ({ row }) => formatCurrency(row.original.totalCost),
    },
    {
      header: "Note",
      accessorKey: "note",
      cell: ({ row }) => {
        const note = row.original.note;
        if (!note) return "-";

        return (
          <Tooltip
            title={
              <Typography
                sx={{
                  p: 1,
                  maxWidth: 300,
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                {note}
              </Typography>
            }
            placement="top"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  boxShadow: 2,
                  "& .MuiTooltip-arrow": {
                    color: "background.paper",
                  },
                },
              },
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{
                maxWidth: "200px",
                color: "text.secondary",
                cursor: "help",
                px: 1.5,
                py: 0.75,
                bgcolor: "grey.50",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.200",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                  bgcolor: "grey.100",
                  borderColor: "grey.300",
                },
              }}
            >
              {note}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  // Construction tasks table columns
  const constructionColumns = [
    {
      header: "Task Name",
      accessorKey: "taskName",
    },
    {
      header: "Unit",
      accessorKey: "unit",
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
    {
      header: "Note",
      accessorKey: "note",
      cell: ({ row }) => {
        const note = row.original.note;
        if (!note) return "-";
        return (
          <Tooltip
            title={
              <Typography
                sx={{
                  p: 1,
                  maxWidth: 300,
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                {note}
              </Typography>
            }
            placement="top"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  boxShadow: 2,
                  "& .MuiTooltip-arrow": {
                    color: "background.paper",
                  },
                },
              },
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{
                maxWidth: "200px",
                color: "text.secondary",
                cursor: "help",
                px: 1.5,
                py: 0.75,
                bgcolor: "grey.50",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.200",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                  bgcolor: "grey.100",
                  borderColor: "grey.300",
                },
              }}
            >
              {note}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  const handleAcceptQuotation = () => {
    setOpenTermsDialog(true);
  };

  const handleCloseTerms = () => {
    setOpenTermsDialog(false);
    setTermsAgreed(false);
  };

  const handleAgreeTerms = () => {
    if (!termsAgreed) return;
    try {
      confirmQuotation(quotationDetail?.quotationCode);
      setOpenTermsDialog(false);
      setTermsAgreed(false);
    } catch (error) {
      console.error("Error accepting quotation:", error);
    }
  };

  const handleTermsCheckbox = (event) => {
    setTermsAgreed(event.target.checked);
  };

  // Extract product details from quotation
  const quotationProducts = quotationDetail?.productDetails || [];

  // Calculate the total price of all products
  const totalProductsPrice = quotationProducts.reduce(
    (total, product) => total + (product.totalPrice || 0),
    0
  );

  // Add PDF skeleton loading
  const PDFSkeleton = () => (
    <div className="h-[800px] flex flex-col border rounded-lg p-6">
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height="90%" />
    </div>
  );

  // Handle opening change request dialog
  const handleOpenChangeRequest = () => {
    setIsChangeRequestOpen(true);
  };

  // Handle closing change request dialog
  const handleCloseChangeRequest = () => {
    setIsChangeRequestOpen(false);
  };

  return (
    <Container>
      {isChangeRequestOpen ? (
        <QuotationChangeRequestView onClose={handleCloseChangeRequest} />
      ) : (
        <>
          <MuiBreadcrumbs />

          <Box display="flex" alignItems="center" my={3}>
            <MdNotes
              className="mr-2"
              size={28}
            />
            <BodyTypo bodylabel="Quotation Details" className="text-xl" />
          </Box>

          {/* Tab Navigation */}
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
                  <TbLayoutList size={18} />
                  <FootTypo footlabel="Quotation Details" />
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
                  <TbFileText size={18} />
                  <FootTypo footlabel="PDF Document" />
                </div>
              </Tab>
            </TabList>

            <TabPanels className="mt-2 relative overflow-hidden">
              <TabPanel className="animate-tab-fade-in">
                {/* Quotation Details Panel */}
                <div className="space-y-3">
                  <BorderBox className="border">
                    <div className="space-y-6">
                      {/* Quotation Info Section */}
                      <div className="space-y-3">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2">
                            Quotation Code
                          </Typography>
                          <Typography
                            component="span"
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md font-medium"
                          >
                            {quotationDetail?.quotationCode}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2">Created Date</Typography>
                          <Typography>
                            {formatDate(quotationDetail?.createdAt)}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="body2">Status</Typography>
                          <StatusChip
                            status={quotationDetail?.status}
                            isQuotation={true}
                          />
                        </Box>

                        {quotationDetail?.status === 0 &&
                          !quotationDetail?.isContractExisted && (
                            <Alert
                              severity="info"
                              className="mt-2"
                              sx={{ width: "fit-content" }}
                            >
                              You have a pending quotation.
                            </Alert>
                          )}
                        {quotationDetail?.status === 1 &&
                          !quotationDetail?.isContractExisted && (
                            <Alert
                              severity="success"
                              sx={{ width: "fit-content" }}
                            >
                              We notified the provider. Please wait for the
                              provider to prepare the contract
                            </Alert>
                          )}
                        {quotationDetail?.status === 2 &&
                          !quotationDetail?.isContractExisted && (
                            <Alert
                              severity="info"
                              sx={{ width: "fit-content" }}
                            >
                              Your change request is being reviewed by the
                              provider
                            </Alert>
                          )}
                        {quotationDetail?.status === 3 &&
                          !quotationDetail?.isContractExisted && (
                            <Alert
                              severity="info"
                              sx={{ width: "fit-content" }}
                            >
                              Your cancel request is being reviewed by the
                              provider
                            </Alert>
                          )}
                        {quotationDetail?.status === 4 &&
                          !quotationDetail?.isContractExisted && (
                            <Alert
                              severity="error"
                              sx={{ width: "fit-content" }}
                            >
                              The quotation is closed
                            </Alert>
                          )}
                        {quotationDetail?.isContractExisted &&
                          !quotationDetail?.isSigned && (
                            <Alert
                              severity="success"
                              sx={{ width: "fit-content" }}
                            >
                              Your contract is ready to sign
                            </Alert>
                          )}
                        {quotationDetail?.isSigned && (
                          <Alert
                            severity="success"
                            sx={{ width: "fit-content" }}
                          >
                            Contract is successfully signed
                          </Alert>
                        )}
                      </div>

                      <Divider />

                      {/* Cost Summary Section */}
                      <div className="space-y-4">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1" fontWeight="medium">
                            Material Cost
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(quotationDetail?.materialCost)}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1" fontWeight="medium">
                            Labour Cost
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(quotationDetail?.constructionCost)}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1" fontWeight="medium">
                            Product Cost
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(quotationDetail?.productCost)}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              Commit Deposit
                            </Typography>
                            <Typography variant="caption">
                              (Total cost is included your commitment deposit)
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            color="error"
                          >
                            - {formatCurrency(500000)}
                          </Typography>
                        </Box>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              Deposit Percentage
                            </Typography>
                            <Typography variant="caption">
                              (This will be deducted from your total cost when
                              you start contract deposite)
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            {quotationDetail?.depositPercentage || 0}%
                          </Typography>
                        </Box>

                        <Divider />

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Total Cost
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            className="text-blue-500"
                          >
                            {formatCurrency(quotationDetail?.totalCost)}
                          </Typography>
                        </Box>

                        {quotationDetail?.status === 0 && (
                          <Box
                            display="flex"
                            justifyContent="center"
                            gap={3}
                            mt={6}
                          >
                            <Button
                              label="Accept Quotation"
                              className="bg-black hover:bg-gray-800 text-white "
                              icon={<FaCheck size={18} />}
                              onClick={handleAcceptQuotation}
                            />
                            <Button
                              label="Request Changes"
                              className="bg-red text-white"
                              icon={<IoIosRemove size={18} />}
                              onClick={handleOpenChangeRequest}
                            />
                          </Box>
                        )}
                      </div>
                    </div>
                  </BorderBox>

                  {/* Materials Section */}
                  <BorderBox className="border">
                    <h2 className="text-xl font-semibold mb-4">Materials</h2>
                    {processedMaterials.length > 0 ? (
                      <DataTable
                        data={processedMaterials}
                        columns={materialColumns}
                        showPagination={false}
                        manualSorting={false}
                        pageSize={pagination.pageSize}
                      />
                    ) : (
                      <p className="text-gray-500">No materials available</p>
                    )}
                  </BorderBox>

                  {/* Labour Tasks Section */}
                  <BorderBox className="border">
                    <h2 className="text-xl font-semibold mb-4">Labour Tasks</h2>
                    {processedTasks.length > 0 ? (
                      <DataTable
                        data={processedTasks}
                        columns={constructionColumns}
                        showPagination={false}
                        manualSorting={false}
                        pageSize={pagination.pageSize}
                      />
                    ) : (
                      <p className="text-gray-500">
                        No construction tasks available
                      </p>
                    )}
                  </BorderBox>

                  {/* Added Products Section */}
                  <BorderBox className="border">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight="600">
                        Added Products
                      </Typography>
                      {totalProductsPrice > 0 && (
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="600"
                        >
                          Total: {formatCurrency(totalProductsPrice)}
                        </Typography>
                      )}
                    </Box>

                    {isQuotationDetailLoading ? (
                      <Grid container spacing={3}>
                        {[1, 2, 3].map((item) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                            <Skeleton
                              variant="rectangular"
                              height={140}
                              sx={{ borderRadius: 1 }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : quotationProducts.length > 0 ? (
                      <Grid container spacing={3}>
                        {quotationProducts.map((product) => (
                          <Grid
                            size={{ xs: 12, sm: 6, md: 4 }}
                            key={product.id}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                height: "100%",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                  {/* Product Image */}
                                  <Box
                                    sx={{
                                      width: 64,
                                      height: 64,
                                      flexShrink: 0,
                                      borderRadius: 1,
                                      overflow: "hidden",
                                      bgcolor: "grey.100",
                                    }}
                                  >
                                    {product.image ? (
                                      <img
                                        src={product.image}
                                        alt={product.productName}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <Box
                                        sx={{
                                          width: "100%",
                                          height: "100%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          bgcolor: "grey.200",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          No img
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>

                                  {/* Product Details */}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          fontWeight: 500,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: "vertical",
                                          maxWidth: "200px",
                                        }}
                                      >
                                        {product.productName}
                                      </Typography>
                                      <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{ fontWeight: 500, flexShrink: 0 }}
                                      >
                                        {formatCurrency(product.totalPrice)}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Quantity: {product.quantity}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 6,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No products added to this quotation
                        </Typography>
                      </Box>
                    )}
                  </BorderBox>
                </div>
              </TabPanel>
              <TabPanel className="rounded-xl bg-white dark:bg-gray-900 p-3 animate-tab-slide-right">
                {/* PDF Document Panel */}
                <div className="h-[800px] flex flex-col">
                  {isQuotationDetailLoading ? (
                    <PDFSkeleton />
                  ) : quotationDetail?.quotationFilePath ? (
                    <div className="h-full">
                      <Viewer
                        fileUrl={quotationDetail?.quotationFilePath}
                        defaultScale={1.5}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <TbFileText
                          size={60}
                          className="mx-auto text-gray-400 mb-4"
                        />
                        <h3 className="text-xl font-medium mb-2">
                          No PDF Document Available
                        </h3>
                        <p className="text-gray-500">
                          The quotation document has not been uploaded yet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>

          {/* Terms and Conditions Dialog */}
          <Dialog
            open={openTermsDialog}
            onClose={handleCloseTerms}
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
                    Our Policies & Terms
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
                    By accepting this quotation, you acknowledge and agree to
                    the following terms:
                  </Typography>

                  <List dense sx={{ pl: 1 }}>
                    {[
                      "You authorize the provider to conduct a detailed survey at your specified address.",
                      "Service begins only after both parties sign the official contract.",
                      "Required deposit must be paid before service commencement.",
                      "Digital contract will be sent to your email.",
                      "Changes after signing must be agreed by both parties.",
                      "All processes follow Season Decor's terms and policies.",
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
                    mt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAgreed}
                        onChange={handleTermsCheckbox}
                        color="primary"
                        sx={{
                          "&.Mui-checked": {
                            color: "black",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I have read and agree to the terms and conditions
                      </Typography>
                    }
                  />
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
                    onClick={handleCloseTerms}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </MuiButton>
                  <MuiButton
                    onClick={handleAgreeTerms}
                    variant="contained"
                    disabled={!termsAgreed}
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
                  >
                    I Agree
                  </MuiButton>
                </MotionBox>
              </MotionBox>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default QuotationDetailPage;

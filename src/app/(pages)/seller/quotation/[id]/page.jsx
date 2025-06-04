"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SellerWrapper from "../../components/SellerWrapper";
import { useGetQuotationDetailByProvider } from "@/app/queries/quotation/quotation.query";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Dialog,
  Alert,
  Divider,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatCurrency } from "@/app/helpers";
import {
  MdPerson,
  MdAttachMoney,
  MdShoppingCart,
  MdClose,
} from "react-icons/md";
import { SiMaterialformkdocs } from "react-icons/si";
import { IoIosConstruct } from "react-icons/io";
import { BsFileEarmarkPdf, BsFileEarmarkText } from "react-icons/bs";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateTime, formatDate } from "@/app/helpers";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { FootTypo } from "@/app/components/ui/Typography";
import { useGetContractFile } from "@/app/queries/contract/contract.query";
import { LuDot } from "react-icons/lu";
import DataTable from "@/app/components/ui/table/DataTable";

const QuotationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: quotationDetail, isLoading } =
    useGetQuotationDetailByProvider(id);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [contractPdfDialogOpen, setContractPdfDialogOpen] = useState(false);
  const [processedMaterials, setProcessedMaterials] = useState([]);
  const [processedTasks, setProcessedTasks] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: contractFile, isLoading: isContractLoading } =
    useGetContractFile(id);

  const handleOpenPdfDialog = () => setPdfDialogOpen(true);
  const handleClosePdfDialog = () => setPdfDialogOpen(false);
  const handleOpenContractPdfDialog = () => setContractPdfDialogOpen(true);
  const handleCloseContractPdfDialog = () => setContractPdfDialogOpen(false);

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
  };

  useEffect(() => {
    if (quotationDetail) {
      const materials = normalizeArray(quotationDetail.materials);
      const tasks = normalizeArray(quotationDetail.constructionTasks);

      setProcessedMaterials(materials);
      setProcessedTasks(tasks);
    }
  }, [quotationDetail]);

  if (isLoading) {
    return (
      <SellerWrapper>
        <LoadingSkeleton />
      </SellerWrapper>
    );
  }

  const { date, time } = formatDateTime(quotationDetail?.createdAt);

  // Define columns for materials table
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

  // Define columns for construction tasks table
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
      header: "Area",
      accessorKey: "area",
      cell: ({ row }) => `${row.original.area} m²`,
    },
    {
      header: "Total Cost",
      accessorKey: "totalCost",
      cell: ({ row }) => formatCurrency(row.original.cost * row.original.area),
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

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5 w-fit"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" />
      </button>
      <Box>
        {/* Header Section */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Quotation #{quotationDetail?.quotationCode}
            </Typography>
            <StatusChip status={quotationDetail?.status} isQuotation={true} />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography color="text.secondary">Created on: {date}</Typography>
            <Typography color="text.secondary">at {time}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Typography color="text.secondary">Contract:</Typography>
            <Chip
              label={
                quotationDetail?.isContractExisted ? "Generated" : "Unavailable"
              }
              color={quotationDetail?.isContractExisted ? "success" : "error"}
              size="small"
            />
          </Box>
        </Paper>
        {quotationDetail?.status === 4 && quotationDetail?.hasTerminated ? (
          <Alert severity="info" color="error" sx={{ mb: 2 }}>
            This quotation is closed due to Contract Termination!
          </Alert>
        ) : quotationDetail?.status === 4 && !quotationDetail?.hasTerminated ? (
          <Alert severity="info" color="error" sx={{ mb: 2 }}>
            This quotation is closed.
          </Alert>
        ) : null}
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <MdPerson size={24} className="mr-2" />
              <Typography variant="h6">Customer Information</Typography>
            </Box>
            <Box sx={{ pl: 4, space: 2 }}>
              <Box mb={2} display="flex" alignItems="center" gap={2}>
                <Avatar
                  userImg={quotationDetail?.customer?.avatar}
                  w={40}
                  h={40}
                />
                <Typography>{quotationDetail?.customer?.fullName}</Typography>
              </Box>
              <Box mb={2}>
                <Typography
                  fontWeight="bold"
                  variant="subtitle2"
                  color="text.secondary"
                >
                  Email
                </Typography>
                <Typography>{quotationDetail?.customer?.email}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography>
                  {quotationDetail?.customer?.phone || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Financial Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <MdAttachMoney size={24} className=" mr-2" />
              <Typography variant="h6">Financial Summary</Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Materials Cost
                  </Typography>
                  <Typography fontWeight="medium">
                    {formatCurrency(quotationDetail?.materialCost)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Construction Cost
                  </Typography>
                  <Typography fontWeight="medium">
                    {formatCurrency(quotationDetail?.constructionCost)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Products Cost
                  </Typography>
                  <Typography fontWeight="medium">
                    {formatCurrency(quotationDetail?.productCost)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Deposit Commimment Charged
                  </Typography>
                  <Typography fontWeight="bold" color="red">
                    {`- ${formatCurrency(500000)}`}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider flexItem sx={{ my: 1 }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Final Total
                  </Typography>
                  <Typography fontWeight="bold" color="primary">
                    {formatCurrency(quotationDetail?.totalCost)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Materials List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <SiMaterialformkdocs size={24} className="mr-2" />
              <Typography variant="h6">Materials</Typography>
            </Box>
            {isLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : processedMaterials.length > 0 ? (
              <DataTable
                data={processedMaterials}
                columns={materialColumns}
                showPagination={false}
                manualSorting={false}
                pageSize={pagination.pageSize}
              />
            ) : (
              <Typography color="text.secondary" align="center" py={4}>
                No materials available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Construction Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <IoIosConstruct size={24} className="mr-2" />
              <Typography variant="h6">Construction Tasks</Typography>
            </Box>
            {isLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : processedTasks.length > 0 ? (
              <DataTable
                data={processedTasks}
                columns={constructionColumns}
                showPagination={false}
                manualSorting={false}
                pageSize={pagination.pageSize}
              />
            ) : (
              <Typography color="text.secondary" align="center" py={4}>
                No construction tasks available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Products */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <MdShoppingCart size={24} className="mr-2" />
              <Typography variant="h6">Products</Typography>
            </Box>
            {!quotationDetail?.productDetails || quotationDetail?.productDetails.length === 0 ? (
              <Alert 
                severity="info" 
                variant="outlined"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                No products specified in this quotation.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {quotationDetail?.productDetails?.map((product, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          objectFit: "cover",
                        }}
                      />
                      <Box flex={1}>
                        <Typography fontWeight="medium">
                          {product.productName}
                        </Typography>
                        <Grid container spacing={1} mt={1}>
                          <Grid size={{ xs: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                              Quantity
                            </Typography>
                            <Typography>{product.quantity}</Typography>
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                              Price
                            </Typography>
                            <Typography>
                              {formatCurrency(product.unitPrice)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                              Total
                            </Typography>
                            <Typography fontWeight="medium">
                              {formatCurrency(product.totalPrice)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* PDF Documents Section */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <BsFileEarmarkPdf size={24} className="mr-2" />
              <Typography variant="h6">Documents</Typography>
            </Box>

            <Box display="flex" gap={2}>
              {quotationDetail?.quotationFilePath && (
                <Button
                  variant="contained"
                  startIcon={<BsFileEarmarkPdf />}
                  onClick={handleOpenPdfDialog}
                >
                  View Quotation PDF
                </Button>
              )}

              {contractFile?.data?.fileUrl && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<BsFileEarmarkText />}
                  onClick={handleOpenContractPdfDialog}
                >
                  View Contract PDF
                </Button>
              )}
            </Box>

            {contractFile?.data?.fileUrl && (
              <Box
                mt={2}
                pt={2}
                borderTop={1}
                borderColor="divider"
                className="space-y-5"
              >
                <Box display="flex" gap={2} alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Contract Code:
                  </Typography>
                  <Typography fontWeight="medium">
                    {contractFile?.data?.contractCode}
                  </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <StatusChip
                    status={contractFile?.data?.status}
                    isContract={true}
                  />
                </Box>

                {contractFile?.data?.isSigned && (
                  <Box display="flex" gap={1} alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Signed on:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {formatDateTime(contractFile?.data.signedDate).date}
                    </Typography>
                    <LuDot size={12} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(contractFile?.data.signedDate).time}
                    </Typography>
                  </Box>
                )}

                {contractFile?.data?.constructionDate && (
                  <Box display="flex" gap={1} alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Construction Start Date:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {formatDate(contractFile?.data.constructionDate)}
                    </Typography>
                  </Box>
                )}

                {contractFile?.data?.isDeposited &&
                contractFile?.data?.isFinalPaid ? (
                  <Alert severity="success" color="success" sx={{ mb: 2 }}>
                    Customer has been fully paid for the contract.
                  </Alert>
                ) : contractFile?.data?.isDeposited ? (
                  <Alert severity="success" color="success" sx={{ mb: 2 }}>
                    Contract has been deposited.
                  </Alert>
                ) : contractFile?.data?.status === 4 ? (
                  <Alert severity="error" color="error" sx={{ mb: 2 }}>
                    <Box>
                      <Typography
                        fontWeight="bold"
                        gutterBottom
                        component="span"
                      >
                        Contract has been terminated at{" "}
                        <Typography
                          fontWeight="bold"
                          component="span"
                          color="text.secondary"
                        >
                          {formatDateTime(contractFile?.data.cancelDate).date}{" "}
                          at{" "}
                          {formatDateTime(contractFile?.data.cancelDate).time}
                        </Typography>
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Customer Name:</strong>{" "}
                          {contractFile?.data?.customerName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Customer Email:</strong>{" "}
                          {contractFile?.data?.customerEmail}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Customer Phone:</strong>{" "}
                          {contractFile?.data?.customerPhone || "Not provided"}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Booking Code:</strong>{" "}
                          {contractFile?.data?.bookingCode || "N/A"}
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          <strong>Total Contract Value:</strong>{" "}
                          {formatCurrency(contractFile?.data.totalPrice)}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          color="error.main"
                        >
                          <strong>Compensation Fee (50%):</strong>{" "}
                          {formatCurrency(contractFile?.data.totalPrice * 0.5)}
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>
                ) : null}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* PDF Dialog */}
      <Dialog
        open={pdfDialogOpen}
        onClose={handleClosePdfDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Quotation Document</Typography>
            <IconButton onClick={handleClosePdfDialog} size="small">
              <MdClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: "80vh" }}>
            {pdfDialogOpen && (
              <Viewer
                fileUrl={quotationDetail?.quotationFilePath}
                defaultScale={1.2}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Contract PDF Dialog */}
      <Dialog
        open={contractPdfDialogOpen}
        onClose={handleCloseContractPdfDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Contract Document</Typography>
            <IconButton onClick={handleCloseContractPdfDialog} size="small">
              <MdClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: "80vh" }}>
            {contractPdfDialogOpen && (
              <Viewer
                fileUrl={contractFile?.data?.fileUrl}
                defaultScale={1.2}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </SellerWrapper>
  );
};

const LoadingSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Skeleton variant="text" width={300} height={40} />
      <Skeleton variant="text" width={200} />
    </Paper>

    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={{ xs: 12, md: 6 }} key={item}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Skeleton variant="text" width={200} height={32} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={100} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default QuotationPage;

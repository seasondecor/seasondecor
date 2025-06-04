"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { MdOutlineFileUpload } from "react-icons/md";
import { useGetDecorServiceListByProvider } from "@/app/queries/list/service.list.query";
import {
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Alert,
  Button as MuiButton,
} from "@mui/material";
import Image from "next/image";
import DataTable from "@/app/components/ui/table/DataTable";
import { formatDate } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { VscIssueReopened } from "react-icons/vsc";
import { useReopenService } from "@/app/queries/service/service.query";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { toast } from "sonner";
import { FootTypo } from "@/app/components/ui/Typography";
import { IoFilterOutline, IoSearch, IoEyeOutline } from "react-icons/io5";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { MdFilterListOff } from "react-icons/md";

// Skeleton loader for the service table
const ServiceTableSkeleton = () => {
  return (
    <Paper
      elevation={0}
      className="w-full overflow-hidden border dark:bg-gray-800 dark:border-gray-700"
    >
      <Box
        p={2}
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width={150} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="text" width={100} height={30} />
          <Skeleton variant="text" width={80} height={30} />
        </Box>
      </Box>

      <Box px={2}>
        <Box
          mb={2}
          display="flex"
          width="100%"
          sx={{ borderBottom: "1px solid #eee" }}
        >
          {[20, 15, 15, 15, 10, 15, 10].map((width, index) => (
            <Box key={index} width={`${width}%`} p={1.5}>
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          ))}
        </Box>

        {[...Array(4)].map((_, rowIndex) => (
          <Box
            key={rowIndex}
            display="flex"
            width="100%"
            sx={{ borderBottom: "1px solid #f5f5f5" }}
          >
            {[20, 15, 15, 15, 10, 15, 10].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 0 ? (
                  <Skeleton
                    variant="rectangular"
                    width="90%"
                    height={80}
                    sx={{ borderRadius: "8px" }}
                  />
                ) : colIndex === 5 ? (
                  <Skeleton variant="rounded" width={80} height={30} />
                ) : colIndex === 6 ? (
                  <Skeleton variant="rounded" width={100} height={40} />
                ) : (
                  <Skeleton variant="text" width="80%" height={24} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width={100} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </Box>
    </Paper>
  );
};

const SellerServiceManage = () => {
  const router = useRouter();
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    style: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    style: "",
    minPrice: "",
    maxPrice: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      productName: filters.productName,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || "";
    handleFilterChange("productName", searchValue);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Available" },
    { id: "1", name: "Unavailable" },
    { id: "2", name: "Incoming" },
  ];

  // Dialog and calendar states
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Use the reopen service mutation
  const { mutate: reopenService, isPending: isReopening } = useReopenService();

  const { data, isLoading, error, refetch } =
    useGetDecorServiceListByProvider(pagination);

  const services = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Function to handle reopening a service
  const handleReopenService = () => {
    if (!selectedServiceId) return;

    // Set the time to noon to avoid timezone issues
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setHours(12, 0, 0, 0);
    const formattedDate = adjustedDate.toISOString();

    reopenService(
      { decorServiceId: selectedServiceId, startDate: formattedDate },
      {
        onSuccess: () => {
          toast.success("Service reopened successfully");
          setReopenDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reopen service");
        },
      }
    );
  };

  // Function to open the reopen dialog
  const handleOpenReopenDialog = (serviceId) => {
    setSelectedServiceId(serviceId);
    setReopenDialogOpen(true);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-24 h-24">
          {row.original.images && row.original.images.length > 0 ? (
            <Image
              src={row.original.images[0].imageURL}
              alt={row.original.style || "Service image"}
              className="object-cover rounded-md"
              sizes="100px"
              fill
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <FootTypo footlabel="No image" fontSize="12px" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Service Name",
      accessorKey: "style",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.style} fontWeight="bold" />
      ),
    },
    {
      header: "Created At",
      accessorKey: "createAt",
      cell: ({ row }) => (
        <FootTypo footlabel={formatDate(row.original.createAt)} />
      ),
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      cell: ({ row }) => (
        <FootTypo footlabel={formatDate(row.original.startDate)} />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusChip status={row.original.status} isService={true} />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <>
          {row.original.status === 1 &&
            (row.original.isBooked ? (
              <Alert
                severity="info"
                sx={{ width: "fit-content", borderRadius: "16px" }}
              >
                On-going Service
              </Alert>
            ) : (
              <Alert
                severity="success"
                sx={{ width: "fit-content", borderRadius: "16px" }}
                action={
                  <MuiButton
                    color="inherit"
                    size="small"
                    onClick={() => handleOpenReopenDialog(row.original.id)}
                  >
                    REOPEN
                  </MuiButton>
                }
              >
                Finished Service
              </Alert>
            ))}

          {row.original.status === 0 && (
            <Alert
              severity="info"
              color="success"
              sx={{ width: "fit-content", borderRadius: "16px" }}
              action={
                <MuiButton
                  color="inherit"
                  size="small"
                  onClick={() => router.push(`/seller/service/${row.original.id}`)}
                >
                  VIEW
                </MuiButton>
              }
            >
              Available Service
            </Alert>
          )}

          {row.original.status === 2 && (
            <Alert
              severity="info"
              color="warning"
              sx={{ width: "fit-content", borderRadius: "16px" }}
            >
              Incoming Service
            </Alert>
          )}
        </>
      ),
    },
  ];

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => {
      const updated = {
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      };
      return updated;
    });
  }, []);

  // Filter and search component
  const FilterSelectors = () => (
    <Box display="flex" flexDirection="row" gap={2} alignItems="center" mb={2}>
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[200px] dark:text-white"
      >
        <InputLabel id="status-label" className="dark:text-white">
          Status
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="status-label"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          label="Status"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        maxWidth="350px"
        width="100%"
      >
        <form
          className="flex items-center w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Search by service name"
            defaultValue={filters.productName}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-r-md shrink-0 border border-primary"
          >
            <IoSearch size={20} />
            Search
          </button>
        </form>
      </Box>

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filters"
        onClick={() => {
          setFilters({
            status: "",
            productName: "",
          });
          if (searchInputRef.current) {
            searchInputRef.current.value = "";
          }
        }}
        className="ml-auto"
      />
    </Box>
  );

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  return (
    <SellerWrapper>
      <>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <h1 className="text-2xl font-bold">Service Management</h1>
          <Box display="flex" gap={3} px={5}>
            <Button
              onClick={() => router.push("/seller/service/create")}
              label="Upload Service"
              className="bg-action text-white"
              icon={<MdOutlineFileUpload size={20} />}
            />
            <RefreshButton
              onRefresh={refetch}
              isLoading={isLoading}
              tooltip="Refresh service list"
            />
          </Box>
        </Box>

        <FilterSelectors />

        {isLoading && services.length === 0 ? (
          <ServiceTableSkeleton />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Error loading services: {error.message}
          </div>
        ) : services.length === 0 && !isLoading ? (
          <div className="p-4">
            <FootTypo footlabel="No Services Found" fontWeight="bold" />
            <p>
              {filters.status || filters.productName
                ? "No services match your filter criteria. Try adjusting your filters."
                : "You don't have any services yet. Start selling by adding your first service."}
            </p>
          </div>
        ) : (
          <DataTable
            data={services}
            columns={columns}
            isLoading={isLoading}
            showPagination={true}
            pageSize={pagination.pageSize}
            initialPageIndex={tablePageIndex}
            manualPagination={true}
            manualSorting={false}
            pageCount={totalPages}
            onPaginationChange={handlePaginationChange}
            totalCount={totalCount}
          />
        )}

        {/* Reopen Dialog with Calendar */}
        <Dialog open={reopenDialogOpen} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h5" component="div">
              Reopen Service
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" className="mb-4">
              Please select a new start date for the service:
            </Typography>
            <div className="w-full">
              <Calendar
                date={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full"
                style={{ width: "100%" }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button label="Cancel" onClick={() => setReopenDialogOpen(false)} />
            <Button
              label={isReopening ? "Reopening..." : "Confirm Reopen"}
              onClick={handleReopenService}
              isLoading={isReopening}
              className="bg-action text-white"
              disabled={isReopening}
            />
          </DialogActions>
        </Dialog>
      </>
    </SellerWrapper>
  );
};

export default SellerServiceManage;

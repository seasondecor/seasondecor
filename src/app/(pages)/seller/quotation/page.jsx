"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetListQuotationForProvider } from "@/app/queries/list/quotation.list.query";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Modal,
  Typography,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { TiArrowForward } from "react-icons/ti";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { IoIosArrowForward } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { PiEmpty } from "react-icons/pi";
import Folder from "@/app/components/ui/animated/Folder";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import {
  useGetRequestQuotaionChangeDetail,
  useGetRequestQuotaionCancelDetail,
  useApproveToChangeQuotation,
  useApproveCancelQuotation
} from "@/app/queries/quotation/quotation.query";
import { FaEye } from "react-icons/fa";
import { toast } from "sonner";

// Skeleton loader for the quotation table
const QuotationTableSkeleton = () => {
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
          {[10, 15, 15, 15, 15, 15, 15].map((width, index) => (
            <Box key={index} width={`${width}%`} p={1.5}>
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          ))}
        </Box>

        {[...Array(5)].map((_, rowIndex) => (
          <Box
            key={rowIndex}
            display="flex"
            width="100%"
            sx={{ borderBottom: "1px solid #f5f5f5" }}
          >
            {[10, 15, 15, 15, 15, 15, 15].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 3 ? (
                  <Skeleton variant="rounded" width={40} height={40} />
                ) : colIndex === 4 ? (
                  <Skeleton variant="rounded" width={80} height={30} />
                ) : colIndex === 6 ? (
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ borderRadius: "4px" }}
                  />
                ) : (
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? "40%" : "80%"}
                    height={24}
                  />
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

const QuotationPage = () => {
  const router = useRouter();
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    quotationCode: "",
  });

  // Add new state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [modalType, setModalType] = useState(null); // 'change' or 'cancel'

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    quotationCode: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      quotationCode: filters.quotationCode,
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
    handleFilterChange("quotationCode", searchValue);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Confirmed" },
    { id: "2", name: "Pending Change" },
    { id: "3", name: "Pending Cancel" },
    { id: "4", name: "Closed" },
  ];

  const {
    data: quotationsData,
    isLoading,
    error,
    refetch,
  } = useGetListQuotationForProvider(pagination);

  const quotations = quotationsData?.data || [];
  const totalCount = quotationsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const handleOpenModal = (quotationCode, type) => {
    setSelectedQuotation(quotationCode);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
    setModalType(null);
  };

  // Add mutation hooks
  const { mutate: approveChange, isPending: isApprovingChange } =
    useApproveToChangeQuotation();
  const { mutate: approveCancel, isPending: isApprovingCancel } =
    useApproveCancelQuotation();

  const handleApproveChange = async () => {
    if (modalType !== "change" || !selectedQuotation) return;
    
    try {
      approveChange(selectedQuotation, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve change request");
        },
      });
    } catch (error) {
      toast.error("Failed to approve change request");
    }
  };

  const handleApproveCancel = async () => {
    if (modalType !== "cancel" || !selectedQuotation) return;
    
    try {
      approveCancel(selectedQuotation, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve cancel request");
        },
      });
    } catch (error) {
      toast.error("Failed to approve cancel request");
    }
  };

  // Modal content component
  const ModalContent = () => {
    const { data: changeDetail, isPending: isPendingChange } = useGetRequestQuotaionChangeDetail(
      selectedQuotation,
      {
        enabled: modalType === "change" && !!selectedQuotation
      }
    );
    const { data: cancelDetail, isPending: isPendingCancel } = useGetRequestQuotaionCancelDetail(
      selectedQuotation,
      {
        enabled: modalType === "cancel" && !!selectedQuotation
      }
    );

    const detail = modalType === "change" ? changeDetail : cancelDetail;
    const isPending =
      modalType === "change" ? isPendingChange : isPendingCancel;
    const isApproving =
      modalType === "change" ? isApprovingChange : isApprovingCancel;

    if (isPending) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {detail ? (
          <div className="space-y-6">
            {modalType === "cancel" && detail.cancelType && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-primary mb-2"
                >
                  Cancellation Type
                </Typography>
                <Typography className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {detail.cancelType}
                </Typography>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Typography
                variant="subtitle1"
                className="font-semibold text-primary mb-2"
              >
                Reason for {modalType === "change" ? "Change" : "Cancellation"}
              </Typography>
              <Typography className="whitespace-pre-wrap">
                {detail.reason || "No reason provided"}
              </Typography>
            </div>

            {modalType === "change" && detail.requestedChanges && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-primary mb-2"
                >
                  Requested Changes
                </Typography>
                <Typography className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {detail.requestedChanges}
                </Typography>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t dark:border-gray-700">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                disabled={isApproving}
              >
                Cancel
              </button>
              <Button
                label={
                  modalType === "change"
                    ? "Approve Changes"
                    : "Approve Cancellation"
                }
                onClick={
                  modalType === "change"
                    ? handleApproveChange
                    : handleApproveCancel
                }
                disabled={isApproving}
                isLoading={isApproving}
                className="bg-action text-white"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Typography color="error" className="font-medium">
              No details available for this request
            </Typography>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <span className="font-bold">{row.original.id}</span>,
    },
    {
      header: "Quotation Code",
      accessorKey: "quotationCode",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.quotationCode}</span>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      header: "File",
      accessorKey: "filePath",
      cell: ({ row }) => (
        <div className="flex !p-0 !m-0 items-center">
          <TiArrowForward size={20} />
          <Folder
            size={0.4}
            color="#00d8ff"
            onClick={() => window.open(row.original.filePath, "_blank")}
          />
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <StatusChip status={row.original.status} isQuotation={true} />
      ),
    },
    {
      header: "Contract",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isContractExisted ? (
            <div className="flex items-center gap-2">
              <MdPlaylistAddCheckCircle size={20} color="green" />
              Yes
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <PiEmpty size={20} color="red" />
              No
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) =>
        row.original.status === 4 ? (
          <Button
            label="Remove"
            onClick={() => removeQuotation(row.original.id)}
            className="bg-red"
          />
        ) : row.original.status === 0 ? (
          <div>No action</div>
        ) : row.original.isContractExisted ? (
          <button
            onClick={() =>
              router.push(
                `/seller/contract/create/contract?quotationCode=${row.original.quotationCode}`
              )
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300"
          >
            <IoIosArrowForward size={20} />
            View Contract
          </button>
        ) : row.original.status === 2 ? (
          <button
            onClick={() =>
              handleOpenModal(row.original.quotationCode, "change")
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300 underline"
          >
            <FaEye size={20} />
            View Change Request
          </button>
        ) : row.original.status === 3 ? (
          <button
            onClick={() =>
              handleOpenModal(row.original.quotationCode, "cancel")
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300 underline"
          >
            <FaEye size={20} />
            View Cancel Request
          </button>
        ) : row.original.status === 4 ? ( 
          <div className="text-red">The quotation is closed</div>
         ) : (
          <button
            onClick={() =>
              router.push(
                `/seller/contract/create/contract?quotationCode=${row.original.quotationCode}`
              )
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300 underline"
          >
            <IoIosArrowForward size={20} />
            Create Contract
          </button>
        ),
    },
  ];

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  // Filter and search component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
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

      <div className="flex items-center gap-2 max-w-[350px] w-full">
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
            placeholder="Enter quotation code"
            defaultValue={filters.quotationCode}
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
      </div>

      <Button
        label="Reset Filters"
        onClick={() => {
          setFilters({
            status: "",
            quotationCode: "",
          });
          if (searchInputRef.current) {
            searchInputRef.current.value = "";
          }
        }}
        className="ml-auto"
      />
    </div>
  );

  return (
    <SellerWrapper>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotation Management</h1>
        <RefreshButton
          onRefresh={refetch}
          isLoading={isLoading}
          tooltip="Refresh quotation list"
        />
      </div>

      {/* Add Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="request-details-modal"
        aria-describedby="modal-showing-request-details"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl min-w-[600px] max-w-[90vw] max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Typography
              variant="h6"
              component="h2"
              className="font-bold text-gray-900 dark:text-white"
            >
              {modalType === "change"
                ? "Change Request Details"
                : "Cancellation Request Details"}
            </Typography>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ModalContent />
        </Box>
      </Modal>

      <FilterSelectors />

      {isLoading && quotations.length === 0 ? (
        <QuotationTableSkeleton />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading quotations: {error.message}
        </div>
      ) : quotations.length === 0 && !isLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Quotations Found</h2>
          <p>
            {filters.status || filters.quotationCode
              ? "No quotations match your filter criteria. Try adjusting your filters."
              : "You don't have any quotations at the moment."}
          </p>
        </div>
      ) : (
        <DataTable
          data={quotations}
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
    </SellerWrapper>
  );
};

export default QuotationPage;

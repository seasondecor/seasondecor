"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetPaginatedProviderTransactions } from "@/app/queries/dashboard/dashboard.provider.query";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import { formatCurrency, formatDateTime } from "@/app/helpers";
import { FootTypo } from "@/app/components/ui/Typography";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { MdFilterListOff } from "react-icons/md";
// Skeleton loader for the transaction table
const TransactionTableSkeleton = () => {
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
          {[10, 15, 20, 15, 20, 10].map((width, index) => (
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
            {[10, 15, 20, 15, 20, 10].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 2 ? (
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={24}
                    sx={{ color: "green" }}
                  />
                ) : colIndex === 5 ? (
                  <Skeleton variant="rounded" width={80} height={30} />
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

const TransactionPage = () => {
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    transactionCode: "",
    type: "",
    transactionType: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    transactionCode: "",
    transactionType: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      transactionCode: filters.transactionCode,
      transactionType: filters.type,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Transaction type options
  const typeOptions = [
    { id: "", name: "All Types" },
    { id: "2", name: "Deposite Payment" },
    { id: "4", name: "Final Payment" },
    { id: "6", name: "Order Payment" },
    { id: "7", name: "Compensation" },
  ];

  // Transaction type map for display
  const transactionTypeMap = {
    2: { name: "Deposite Payment", color: "success" },
    4: { name: "Final Payment", color: "primary" },
    5: { name: "Revenue", color: "info" },
    6: { name: "Order Payment", color: "warning" },
    7: { name: "Compensation", color: "error" },
  };

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedProviderTransactions({
    ...pagination,
    TransactionType: pagination.transactionType || undefined,
  });

  // Add a debugging effect to check what's being sent in the API call
  useEffect(() => {
    if (pagination.transactionType) {
      console.log("Filtering by transaction type:", pagination.transactionType);
    }
  }, [pagination.transactionType]);

  const transactions = transactionsData?.data || [];
  const totalCount = transactionsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const columns = [
    {
      header: "ID",
      accessorKey: "transactionId",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.transactionId} />
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const dateTime = formatDateTime(row.original.transactionDate);
        return (
          <div className="flex flex-col">
            <FootTypo footlabel={dateTime.date} fontWeight="bold" />
            <FootTypo
              footlabel={`${dateTime.time}`}
              fontSize="12px"
              color="gray"
            />
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <FootTypo
          footlabel={`+ ${formatCurrency(row.original.amount)}`}
          fontWeight="bold"
          className="text-green"
        />
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const typeId = row.original.transactionType?.toString();
        const typeInfo = transactionTypeMap[typeId] || {
          name: "Unknown",
          color: "default",
        };

        return (
          <Chip
            label={typeInfo.name}
            color={typeInfo.color}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 500,
              minWidth: "130px",
              "& .MuiChip-icon": {
                marginLeft: "8px",
                color: "inherit",
              },
            }}
          />
        );
      },
    },
    {
      header: "From",
      accessorKey: "senderEmail",
      cell: ({ row }) => (
        <FootTypo
          footlabel={row.original.senderEmail}
          fontWeight="bold"
          className="max-w-xs truncate"
        />
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
    <div className="mb-6 flex flex-wrap items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[200px] dark:text-white"
      >
        <InputLabel id="transaction-type-label" className="dark:text-white">
          Transaction Type
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="transaction-type-label"
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          label="Transaction Type"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filters"
        onClick={() => {
          setFilters({
            status: "",
            transactionCode: "",
            type: "",
            transactionType: "",
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
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <RefreshButton
          onRefresh={refetch}
          isLoading={isLoading}
          tooltip="Refresh transaction list"
        />
      </div>

      <FilterSelectors />

      {isLoading && transactions.length === 0 ? (
        <TransactionTableSkeleton />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading transactions: {error.message}
        </div>
      ) : transactions.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
          <FaMoneyBillWave size={40} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-4">No Transactions Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filters.status || filters.transactionCode || filters.type
              ? "No transactions match your filter criteria. Try adjusting your filters."
              : "You don't have any transactions at the moment."}
          </p>
        </div>
      ) : (
        <DataTable
          data={transactions}
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

export default TransactionPage;

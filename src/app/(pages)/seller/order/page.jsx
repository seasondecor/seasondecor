"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetOrderListByProvider } from "@/app/queries/list/order.list.query";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { IoFilterOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CiWallet } from "react-icons/ci";
import { BsClock } from "react-icons/bs";
import { formatDateTime } from "@/app/helpers";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { FootTypo } from "@/app/components/ui/Typography";
import { MdFilterListOff } from "react-icons/md";
// Skeleton loader for the order table
const OrderTableSkeleton = () => {
  return (
    <Paper elevation={0} className="w-full overflow-hidden border dark:bg-gray-800 dark:border-gray-700">
      <Box p={2} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width={150} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="text" width={100} height={30} />
          <Skeleton variant="text" width={80} height={30} />
        </Box>
      </Box>
      
      <Box px={2}>
        <Box mb={2} display="flex" width="100%" sx={{ borderBottom: '1px solid #eee' }}>
          {[15, 20, 20, 20, 15].map((width, index) => (
            <Box key={index} width={`${width}%`} p={1.5}>
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          ))}
        </Box>
        
        {[...Array(5)].map((_, rowIndex) => (
          <Box key={rowIndex} display="flex" width="100%" sx={{ borderBottom: '1px solid #f5f5f5' }}>
            {[15, 20, 20, 20, 15].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 4 ? (
                  <Skeleton variant="rounded" width={80} height={30} />
                ) : (
                  <Skeleton variant="text" width={colIndex === 0 ? "40%" : "80%"} height={24} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width={100} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </Box>
    </Paper>
  );
};

const OrderPage = () => {
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    orderCode: "",
  });

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
    { id: "1", name: "Paid" },
    { id: "2", name: "Rejected" },
  ];

  const {
    data: orderData,
    isLoading,
    error,
    refetch
  } = useGetOrderListByProvider(pagination);

  const orders = orderData?.data || [];
  const totalCount = orderData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <FootTypo footlabel={row.original.id}/>,
    },
    {
      header: "Order Code",
      accessorKey: "orderCode",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.orderCode} fontWeight="bold"/>
      ),
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CiWallet size={20} />
          <FootTypo footlabel={row.original.paymentMethod} fontWeight="bold"/>
        </div>
      ),
    },
    {
      header: "Order Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        if (!row.original.orderDate) return <span>N/A</span>;
        
        const dateTime = formatDateTime(row.original.orderDate);
        return (
          <div className="flex flex-col">
            <FootTypo footlabel={dateTime.date} fontWeight="bold"/>
            <FootTypo footlabel={dateTime.time} fontSize="12px" className="text-gray-500 inline-flex items-center gap-1">
              <BsClock /> 
            </FootTypo>
          </div>
        );
      },
    },
    {
      header: "Status",
      cell: ({ row }) => <StatusChip status={row.original.status} isOrder={true} />,
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
            placeholder="Enter order code"
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
        icon={<MdFilterListOff size={20} />}
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
        <h1 className="text-2xl font-bold">Order Management</h1>
        <RefreshButton 
          onRefresh={refetch} 
          isLoading={isLoading} 
          tooltip="Refresh order list" 
        />
      </div>

      <FilterSelectors />

      {isLoading && orders.length === 0 ? (
        <OrderTableSkeleton />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading orders: {error.message}
        </div>
      ) : orders.length === 0 && !isLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Orders Found</h2>
          <p>
            {filters.status || filters.quotationCode
              ? "No orders match your filter criteria. Try adjusting your filters."
              : "You don't have any orders at the moment."}
          </p>
        </div>
      ) : (
        <DataTable
          data={orders}
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

export default OrderPage;

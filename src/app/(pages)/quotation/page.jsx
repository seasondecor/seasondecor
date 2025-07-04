"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import DataMapper from "@/app/components/DataMapper";
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation.list.query";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import EmptyState from "@/app/components/EmptyState";
import { BodyTypo } from "@/app/components/ui/Typography";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useRouter } from "next/navigation";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Card,
  CardContent,
  Stack,
  Box,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { MdFilterListOff } from "react-icons/md";

const QuotationPage = () => {
  const router = useRouter();

  const [filters, setFilters] = useState({
    status: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
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
    isLoading: isQuotationsLoading,
    refetch: refetchQuotations,
  } = useGetListQuotationForCustomer(pagination);

  const quotations = quotationsData?.data || [];
  const totalCount = quotationsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[250px] dark:text-white"
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

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filter"
        onClick={() =>
          setFilters({
            status: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  // Add this function to generate quotation card skeletons
  const QuotationCardSkeleton = () => (
    <Card className="mb-4 hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width={120} height={28} animation="wave" />
            <Skeleton
              variant="rounded"
              width={100}
              height={30}
              animation="wave"
            />
          </div>
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
          <div className="mt-2 flex justify-between items-center">
            <Skeleton variant="text" width={150} height={20} animation="wave" />
            <Skeleton
              variant="rounded"
              width={80}
              height={36}
              animation="wave"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Container>
      <MuiBreadcrumbs />
      <Box display="flex" flexDirection="row" alignItems="center" my={2}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <BodyTypo bodylabel="Quotation" />
          <RefreshButton
            onRefresh={refetchQuotations}
            isLoading={isQuotationsLoading}
            tooltip="Refresh quotation list"
          />
        </Box>
      </Box>

      <FilterSelectors />

      {isQuotationsLoading && quotations.length === 0 ? (
        <Stack spacing={2}>
          <QuotationCardSkeleton />
          <QuotationCardSkeleton />
          <QuotationCardSkeleton />
        </Stack>
      ) : quotations.length === 0 && !isQuotationsLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Quotations Found</h2>
          <p>
            {filters.status
              ? "No quotations match your filter criteria. Try adjusting your filters."
              : "You don't have any quotations at the moment."}
          </p>
        </div>
      ) : (
        <>
          <DataMapper
            data={quotations}
            Component={QuotationCard}
            useGrid={false}
            emptyStateComponent={<EmptyState title="No quotations found" />}
            loading={isQuotationsLoading}
            getKey={(item) => item.quotationCode}
            componentProps={(item) => ({
              quotationCode: item.quotationCode,
              createdDate: item.createdAt,
              status: item.status,
              isContractExist: item.isContractExisted,
              isQuoteExisted: item.isQuoteExisted,
              hasTerminated: item.hasTerminated,
              serviceName: item.style,
              viewContract: () => {
                router.push(`/quotation/view-contract/${item.quotationCode}`);
              },
              onClick: () => {
                router.push(`/quotation/${item.quotationCode}`);
              },
            })}
          />

          {totalCount > 0 && (
            <Box display="flex" justifyContent="center" mt={2} gap={2}>
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
              <Box display="flex" alignItems="center">
                Page {pagination.pageIndex} of {totalPages}
              </Box>
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
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default QuotationPage;

"use client";

import React, { useState, useCallback, useEffect } from "react";
import AdminWrapper from "../../components/AdminWrapper";
import { useGetListAccount } from "@/app/queries/list/account.list.query";
import { useBanAccount } from "@/app/queries/account/account.query";
import DataTable from "@/app/components/ui/table/DataTable";
import Button from "@/app/components/ui/Buttons/Button";
import { IoPersonRemoveSharp } from "react-icons/io5";
import RoleChip from "../../components/RoleChip";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { IoFilterOutline } from "react-icons/io5";
import { MdFilterListOff } from "react-icons/md";
import { FootTypo } from "@/app/components/ui/Typography";
import { Chip } from "@mui/material";

const ManageAccount = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: true,
    status: "",
    gender: "",
    isVerified: "",
    isDisabled: "",
  });

  const [filters, setFilters] = useState({
    status: 0,
    gender: "",
    isVerified: "",
    isDisabled: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const { mutateBan } = useBanAccount();

  const { data: accountList, isLoading, error } = useGetListAccount(pagination);

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      gender: filters.gender,
      isVerified: filters.isVerified,
      isDisabled: filters.isDisabled,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filterOptions = [
    {
      label: "Gender",
      type: "boolean",
      options: [
        { id: "", name: "All" },
        { id: "true", name: "Male" },
        { id: "false", name: "Female" },
      ],
      onChange: (value) => handleFilterChange("gender", value),
      value: filters.gender,
    },
    {
      label: "Status",
      type: "boolean",
      options: [
        { id: "true", name: "Disabled" },
        { id: "false", name: "Active" },
      ],
      onChange: (value) => handleFilterChange("isDisabled", value),
      value: filters.isDisabled,
    },
  ];

  const data = accountList?.data || [];
  const totalCount = accountList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <FootTypo footlabel={row.original.id} />,
    },
    {
      header: "Avatar",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-16 h-16">
          {row.original.avatar ? (
            <Avatar
              userImg={row.original.avatar}
              alt={row.original.email}
              w={64}
              h={64}
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
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.email} fontWeight="bold" />
      ),
    },
    {
      header: "First Name",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.firstName} fontWeight="bold" />
      ),
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.lastName} fontWeight="bold" />
      ),
    },
    {
      header: "Status",
      accessorKey: "isDisable",
      cell: ({ row }) => (
        <Chip
          label={row.original.isDisable ? "Disabled" : "Active"}
          color={row.original.isDisable ? "error" : "success"}
          variant="filled"
          size="medium"
          className="dark:text-white"
        />
      ),
    },
    {
      header: "Role",
      accessorKey: "roleId",
      cell: ({ row }) => <RoleChip status={row.original.roleId} />,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => <FootTypo footlabel={row.original.location} />,
    },

    {
      header: "Actions",
      cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            label="Disable"
            onClick={() => handleOpenDialog(row.original.id)}
            className="bg-red text-white"
            icon={<IoPersonRemoveSharp size={20} />}
          />
        </Box>
      ),
    },
  ];

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const handlePaginationChange = useCallback((newPagination) => {
    //console.log("Pagination changed from DataTable:", newPagination);

    setPagination((prev) => {
      const updated = {
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      };
      // console.log("Updated pagination state:", updated);
      return updated;
    });
  }, []);

  const handleOpenDialog = (accountId) => {
    setSelectedAccountId(accountId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccountId(null);
  };

  const handleConfirmBan = async () => {
    if (selectedAccountId) {
      try {
        await mutateBan(selectedAccountId);
        handleCloseDialog();
      } catch (error) {
        console.error("Error banning account:", error);
      }
    }
  };

  // Filter selection component
  const FilterSelectors = () => (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      {filterOptions.map((filter) => (
        <FormControl
          key={filter.label}
          variant="outlined"
          size="small"
          className="w-full max-w-[200px] dark:text-white"
        >
          <InputLabel id={`${filter.label}-label`} className="dark:text-white">
            {filter.label}
          </InputLabel>
          <Select
            MenuProps={{
              disableScrollLock: true,
            }}
            labelId={`${filter.label}-label`}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            label={filter.label}
            className="bg-white dark:bg-gray-700 dark:text-white"
          >
            {filter.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filters"
        onClick={() =>
          setFilters({
            status: 0,
            gender: "",
            isVerified: "",
            isDisabled: "",
          })
        }
        className="ml-auto"
      />
    </Box>
  );

  return (
    <AdminWrapper>
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>
      <div className="w-full">
        <FilterSelectors />

        <div className="w-full">
          {isLoading && data.length === 0 ? (
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={40}
            />
          ) : error ? (
            <div className="bg-red-100 text-red p-4 rounded">
              Error loading accounts: {error.message}
            </div>
          ) : data.length === 0 && !isLoading ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">No Accounts Found</h2>
              <p>
                No accounts match your filter criteria. Try adjusting your
                filters.
              </p>
            </div>
          ) : (
            <DataTable
              data={data}
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
        </div>

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            className: "dark:bg-gray-800",
          }}
        >
          <DialogTitle className="text-xl font-semibold dark:text-white">
            Confirm Account Disable
          </DialogTitle>
          <DialogContent className="dark:text-gray-300">
            <p className="mt-4">
              Are you sure you want to disable this account? This action can be reversed later.
            </p>
          </DialogContent>
          <DialogActions className="p-4">
            <Button
              label="Cancel"
              onClick={handleCloseDialog}
              className="bg-gray-500 text-white hover:bg-gray-600"
            />
            <Button
              label="Confirm Disable"
              onClick={handleConfirmBan}
              className="bg-red text-white"
              icon={<IoPersonRemoveSharp size={20} />}
            />
          </DialogActions>
        </Dialog>
      </div>
    </AdminWrapper>
  );
};

export default ManageAccount;

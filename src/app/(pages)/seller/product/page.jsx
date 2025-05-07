"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { useGetProductByProvider } from "@/app/queries/list/product.list.query";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DataTable from "@/app/components/ui/table/DataTable";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";
import {
  Skeleton,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { IoSearch, IoFilterOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/app/helpers";
import { useRemoveProduct } from "@/app/queries/product/product.query";


// Skeleton loader for the product table
const ProductTableSkeleton = () => {
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
          {[20, 15, 10, 12, 10, 10, 10, 13].map((width, index) => (
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
            {[20, 15, 10, 12, 10, 10, 10, 13].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 0 ? (
                  <Skeleton
                    variant="rectangular"
                    width="80%"
                    height={80}
                    sx={{ borderRadius: "8px" }}
                  />
                ) : colIndex === 2 ? (
                  <Skeleton variant="rounded" width={80} height={28} />
                ) : colIndex === 6 ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Skeleton variant="text" width={20} height={24} />
                    <Skeleton variant="circular" width={16} height={16} />
                  </Box>
                ) : colIndex === 7 ? (
                  <Box display="flex" gap={1}>
                    <Skeleton variant="rounded" width={80} height={35} />
                    <Skeleton variant="rounded" width={80} height={35} />
                  </Box>
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

const SellerProductManage = () => {
  const router = useRouter();
  const userSlug = useSelector((state) => state.users.userSlug);
  const searchInputRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    orderCode: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    status: "",
    descending: true,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      pageIndex: 1, // Reset to first page when filter changes
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // State for selected price range
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Delete product state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { mutate: removeProduct, isPending: isRemoving } = useRemoveProduct();

  const { data, isLoading, error, refetch } = useGetProductByProvider(
    userSlug,
    pagination
  );

  const products = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Function to handle price filter
  const handlePriceFilter = () => {
    const minPrice = minPriceRef.current?.value || "";
    const maxPrice = maxPriceRef.current?.value || "";

    setPagination((prev) => ({
      ...prev,
      minPrice: minPrice,
      maxPrice: maxPrice,
      status: filters.status, // Include status from filters
      pageIndex: 1, // Reset to first page when filtering
    }));
  };

  // Function to reset all filters
  const handleResetFilters = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";

    // Reset price range
    setSelectedPriceRange(null);

    // Reset the input fields explicitly
    if (minPriceRef.current) minPriceRef.current.value = "";
    if (maxPriceRef.current) maxPriceRef.current.value = "";

    // Reset filter state
    setFilters({
      status: "",
      orderCode: ""
    });

    setPagination((prev) => ({
      ...prev,
      productName: "",
      minPrice: "",
      maxPrice: "",
      status: "",
      pageIndex: 1,
    }));
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
          {row.original.imageUrls?.[0] ? (
            <Image
              src={row.original.imageUrls[0]}
              alt={row.original.productName}
              fill
              className="object-cover rounded-md"
              sizes="100px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Product Name",
      accessorKey: "productName",
      cell: ({ row }) => (
        <span className="font-bold">
          {row.original.productName}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`${
            row.original.status === "InStock"
              ? "text-white bg-green"
              : "text-white bg-red"
          } px-2 py-1 rounded-md`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Price",
      accessorKey: "productPrice",
      cell: ({ row }) => (
        <span className="text-primary font-bold">
          {formatCurrency(row.original.productPrice)}
        </span>
      ),
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Total Sold",
      accessorKey: "totalSold",
      cell: ({ row }) => (
        <span className="font-bold">
          {`${row.original.totalSold} sold`}
        </span>
      ),
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          {row.original.rate ? row.original.rate : 0} <FaStar />
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="Modify"
            onClick={() =>
              router.push(`/seller/product/update?id=${row.original.id}`)
            }
            className="bg-action text-white"
            icon={<FaEdit size={20} />}
          />
          <Button
            label="Remove"
            onClick={() => handleDeleteProduct(row.original)}
            className="bg-red text-white"
            icon={<MdDelete size={20} />}
            disabled={isRemoving && productToDelete?.id === row.original.id}
          />
        </div>
      ),
    },
  ];

  const handleDeleteProduct = useCallback((product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    
    removeProduct(productToDelete.id, {
      onSuccess: () => {             
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      },
      onError: (error) => {
        setDeleteDialogOpen(false); 
        setProductToDelete(null);
      }
    });
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  // Function to handle search by product name
  const handleSearch = (event) => {
    event?.preventDefault();
    const searchValue = searchInputRef.current?.value || "";
    setPagination((prev) => ({
      ...prev,
      productName: searchValue,
      pageIndex: 1, // Reset to first page when searching
    }));
  };

  const statusOptions = [
    { id: "", name: "All" },
    { id: "InStock", name: "In Stock" },
    { id: "OutOfStock", name: "Out of Stock" },
  ];

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  return (
    <SellerWrapper>
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="flex gap-3 px-5">
            <Button
              onClick={() => router.push("/seller/product/create")}
              label="Start selling"
              className="bg-primary"
              icon={<MdOutlineFileUpload size={20} />}
            />
            <RefreshButton
              onRefresh={refetch}
              isLoading={isLoading}
              tooltip="Refresh product list"
            />
          </div>
        </div>

        {/* Redesigned Filter Section */}
        <Paper elevation={0} className="p-4 mb-6 w-full dark:bg-gray-800 dark:text-white">
          <Box className="flex flex-wrap items-center gap-3">
            <Box className="flex items-center gap-2">
              <IoFilterOutline size={18} />
              <Typography variant="body2" fontWeight={500}>
                Filters
              </Typography>
            </Box>

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

            {/* Price Range */}
            <Box className="flex items-center gap-2">
              <TextField
                label="Min Price"
                inputRef={minPriceRef}
                type="number"
                size="small"
                placeholder="Min"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
                className="w-[140px] dark:bg-white"
              />
              <Typography variant="body2">to</Typography>
              <TextField
                label="Max Price"
                inputRef={maxPriceRef}
                type="number"
                size="small"
                placeholder="Max"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₫</InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
                className="w-[140px] dark:bg-white"
              />
            </Box>
            <Box>
              <Button
                label="Apply"
                onClick={handlePriceFilter}
                className="bg-action text-white"
              />
            </Box>


            {/* Search Input */}
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
                  placeholder="Enter product name"
                  defaultValue={pagination.productName}
                  autoComplete="on"
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
          
            <Box className="ml-auto">
              <Button
                label="Reset Filters"
                onClick={handleResetFilters}
              />
            </Box>
          </Box>
        </Paper>

        {isLoading && products.length === 0 ? (
          <ProductTableSkeleton />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Error loading products: {error.message}
          </div>
        ) : products.length === 0 && !isLoading ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">No Products Found</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {pagination.productName ||
              pagination.minPrice ||
              pagination.maxPrice
                ? "No products match your search criteria. Try adjusting your filters."
                : "You don't have any products yet. Start selling by adding your first product."}
            </p>
          </div>
        ) : (
          <DataTable
            data={products}
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
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Product
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the product "{productToDelete?.productName}"? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              label="Cancel"
              onClick={handleDeleteCancel}
              className="bg-gray-200 text-gray-800"
              disabled={isRemoving}
            />
            <Button
              label={isRemoving ? "Deleting..." : "Delete"}
              onClick={handleDeleteConfirm}
              className="bg-red text-white"
              disabled={isRemoving}
            />
          </DialogActions>
        </Dialog>
      </>
    </SellerWrapper>
  );
};

export default SellerProductManage;

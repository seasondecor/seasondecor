import { Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import Button2 from "@/app/components/ui/Buttons/Button2";

const DataMapper = ({
  data,
  Component,
  componentProps = () => ({}),
  getKey,
  loading,
  isLoading,
  emptyStateComponent,
  // Pagination props
  pageSize,
  currentPage = 1,
  enforcePagination = false,
  onLoadMore = () => {},
  hasMoreData = false,
  // Mode control
  accumulativeMode = false, // When true, displays all items from multiple pages
  // Layout control
  useGrid = true, // Whether to use grid layout
  gridProps = { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }, // Custom grid props
}) => {
  // Check for loading from either prop
  const isLoadingData = loading || isLoading;

  if (isLoadingData) {
    return (
      <>
        <div className="flex flex-col">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      </>
    );
  }

  if (!data || data.length === 0) {
    return emptyStateComponent;
  }

  // Determine which items to render based on mode and pagination settings
  let itemsToRender = data;

  // Client-side pagination - only used when accumulativeMode is false
  if (!accumulativeMode && enforcePagination && pageSize) {
    // For strict pagination, slice the data based on current page and page size
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    itemsToRender = data.slice(startIndex, endIndex);
  }

  const renderItems = () => {
    if (useGrid) {
      return itemsToRender.map((item) => (
        <Grid item key={getKey(item)} size={gridProps}>
          <Component {...item} {...componentProps(item)} />
        </Grid>
      ));
    }

    return itemsToRender.map((item) => (
      <Component key={getKey(item)} {...item} {...componentProps(item)} />
    ));
  };

  return (
    <>
      {useGrid ? <>{renderItems()}</> : renderItems()}

      {/* Load More Button */}
      {enforcePagination && hasMoreData && (
        <div className="w-full flex justify-center mt-6 mb-4">
          <Button2
            onClick={onLoadMore}
            label="Show More"
            loading={isLoadingData}
          />
        </div>
      )}
    </>
  );
};

export default DataMapper;

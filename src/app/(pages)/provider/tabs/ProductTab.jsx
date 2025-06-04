"use client";

import * as React from "react";
import DataMapper from "@/app/components/DataMapper";
import { usePathname } from "next/navigation";
import { useGetProductByProvider } from "@/app/queries/list/product.list.query";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";
import { generateSlug } from "@/app/helpers";
import { Skeleton } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Grid from "@mui/material/Grid2";

const ProductsTab = () => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const { data: productList, isLoading: productLoading } =
    useGetProductByProvider(slug, pagination);

  const products = productList?.data || [];
  const totalCount = productList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Handle pagination change
  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  return (
    <div className="relative">
      <Grid container spacing={5} mt={2}>
        <DataMapper
          data={products}
          Component={ProductCard}
          emptyStateComponent={<EmptyState title="No products found" />}
          loading={productLoading}
          getKey={(item) => item.id}
          componentProps={(product) => ({
            image: product.imageUrls?.[0] || <Skeleton animation="wave" />,
            productName: product.productName,
            rate: product.rate,
            price: product.productPrice,
            designStyle: product.designs,
            href: `/products/${product.id}-${generateSlug(product.productName)}`,
          })}
        />
      </Grid>

      {totalCount > 0 && (
        <div className="flex justify-center mt-8 gap-4">
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
          <span className="flex items-center">
            Page {pagination.pageIndex} of {totalPages}
          </span>
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
        </div>
      )}
    </div>
  );
};

export default ProductsTab;

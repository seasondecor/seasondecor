"use client";

import * as React from "react";
import { BlackBgButton } from "../Buttons/Button2colors";
import Categories from "./components/Categories";
import ProductCard from "../card/ProductCard";
import Container from "../../layouts/Container";
import DataMapper from "../../DataMapper";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { useGetProductByCategoryId } from "@/app/queries/list/product.list.query";
import EmptyState from "../../EmptyState";
import { Skeleton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid2";
import Image from "next/image";

const ProductSection = () => {
  const params = useSearchParams();

  const selectedCategoryId = params?.get("categoryId");

  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 12,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data: productList, isLoading } = selectedCategoryId
    ? useGetProductByCategoryId(selectedCategoryId, pagination)
    : useGetListProduct(pagination);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const products = Array.isArray(productList?.data) ? productList.data : [];

  return (
    <Container>
      <Categories />
      <Grid container spacing={4} mt={4} position="relative">
        <DataMapper
          data={products}
          Component={ProductCard}
          loading={isLoading}
          emptyStateComponent={<EmptyState title="No products found" />}
          getKey={(product) => product.id}
          componentProps={(product) => ({
            image: product.imageUrls?.[0] || <Skeleton animation="wave" />,
            productName: product.productName,
            rate: product.rate,
            price: product.productPrice,
            totalSold: product.totalSold,
            id: product.id,
            href: `/products/${product.id}-${generateSlug(
              product.productName
            )}`,
          })}
          useGrid={true}
        />
        <div className="absolute inset-x-0 bottom-0 z-30 h-80 bg-gradient-to-t from-white to-transparent dark:from-black opacity-90 rounded-2xl"></div>
      </Grid>
      <div className="flex justify-center w-full">
        <BlackBgButton blackBtnlable="Browse products" href={"/products"} />
      </div>
    </Container>
  );
};

export default ProductSection;

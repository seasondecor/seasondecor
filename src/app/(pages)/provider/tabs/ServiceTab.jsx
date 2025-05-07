"use client";

import * as React from "react";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { useGetDecorServiceListForCustomer } from "@/app/queries/list/service.list.query";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import { generateSlug } from "@/app/helpers";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ServicesTab = ({ providerId }) => {
  const [pagination, setPagination] = React.useState({
    providerId: providerId,
    pageIndex: 1,
    pageSize: 10,
    style: "",
    subLocation: "",
    seasonId: "",
    decorCategory: "",
    sortBy: "",
    descending: false,
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading} =
    useGetDecorServiceListForCustomer(pagination);

  const services = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Handle pagination change
  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  return (
    <div className="relative mt-10">
     
        <DataMapper
          data={services}
          Component={ServiceCard}
          emptyStateComponent={<EmptyState title="No services found" />}
          loading={isLoading}
          getKey={(item) => item.id}
          componentProps={(service) => ({
            style: service.style,
            description: service.description,
            images: service.images,
            id: service.id,
            seasons: service.seasons,
            category: service.categoryName,
            province: service.sublocation,
            isAvailable: service.status,
            href: `/booking/${generateSlug(service.style)}`,
          })}
        />
    

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

export default ServicesTab;

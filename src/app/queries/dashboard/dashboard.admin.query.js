import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Dashboard`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  transactionType: "",
  sortBy: "",
  descending: false,
};

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: ["get_admin_dashboard"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getAdminDashboard`);
      return res.data;
    },
  });
}

export function useGetAdminMonthlyRevenue() {
  return useQuery({
    queryKey: ["get_admin_monthly_revenue"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getAdminMonthlyRevenue`);
      return res.data;
    },
  });
}

export function useGetTopProviderRating() {
  return useQuery({
    queryKey: ["get_top_provider_rating"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getTopProviderRatingRanking`);
      return res.data;
    },
  });
}

export function useGetPaginatedAdminTransactions(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["get_paginated_admin_transactions", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getAdminPaginatedPaymentTransaction`;

        url += `?PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.paymentType) url += `&PaymentType=${params.paymentType}`;

        if (params.transactionType) url += `&TransactionType=${params.transactionType}`;

        if (params.sortBy) url += `&SortBy=${params.sortBy}`;

        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const res = await BaseRequest.Get(url, false);

        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          }
        }
        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
        };
      } finally {
        nProgress.done();
      }
    },
    keepPreviousData: true,
    staleTime: 30000,
  });
}

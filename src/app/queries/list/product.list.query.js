import { useQuery} from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Product`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  productName: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "",
  descending: false,
  status: "",
};

export function useGetListProduct(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["product_list", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedList?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.productName) queryParams.push(`ProductName=${params.productName}`);
        if (params.minPrice) queryParams.push(`MinPrice=${params.minPrice}`);
        if (params.maxPrice) queryParams.push(`MaxPrice=${params.maxPrice}`);
        if (params.status) queryParams.push(`Status=${encodeURIComponent(params.status)}`);
        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined) queryParams.push(`Descending=${params.descending}`);

        url += queryParams.join('&');

        const res = await BaseRequest.Get(url, false);

        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize),
            };
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

export function useGetProductByCategoryId(categoryId, paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["product_list_by_category", categoryId, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListByCategory?CategoryId=${categoryId}`;

        url += `&PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.productName)
          url += `&ProductName=${encodeURIComponent(params.productName)}`;
        if (params.minPrice) url += `&MinPrice=${params.minPrice}`;
        if (params.maxPrice) url += `&MaxPrice=${params.maxPrice}`;
        if (params.status) url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;
        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const res = await BaseRequest.Get(url, false);

        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize),
            };
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

export function useGetProductByProvider(slug, paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["product_list_by_provider", slug, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListByProvider?Slug=${slug}`;

        url += `&PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.productName)
          url += `&ProductName=${encodeURIComponent(params.productName)}`;
        if (params.minPrice) url += `&MinPrice=${params.minPrice}`;
        if (params.maxPrice) url += `&MaxPrice=${params.maxPrice}`;
        if (params.status) url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;
        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const res = await BaseRequest.Get(url, false);

        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize),
            };
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
    enabled: !!slug,
    keepPreviousData: true,
    staleTime: 30000,
  });
}

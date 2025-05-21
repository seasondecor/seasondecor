import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;

export function useCreateDecorService() {
  return useMutation({
    mutationFn: async (formData) => {
      if (!formData) throw new Error("No product provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/add`, formData);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useReopenService() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No data provided");
      const { decorServiceId, startDate } = data;
      if (!decorServiceId) throw new Error("No service id provided");
      if (!startDate) throw new Error("No start date provided");
      
      return await BaseRequest.Put(`/${SUB_URL}/reOpen/${decorServiceId}`, { 
        startDate 
      });
    },
  });
}

export function useGetDecorServiceById(id) {
  return useQuery({
    queryKey: ["get_decor_service_by_id", id],
    queryFn: async () => {
      if (!id) throw new Error("No id provided");

      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/${id}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!id,
  });
}

export function useSearchDecorService(params) {
  return useQuery({
    queryKey: ["search-decor-service", params],
    queryFn: async () => {
      nProgress.start();
      
      try {
        if (!params) {
          const res = await BaseRequest.Get(`/${SUB_URL}/getPaginated`, false);
          return {
            data: res.data.data || [],
            total: res.data.data?.length || 0
          };
        }
        
        // Construct the query string with proper handling of arrays
        const queryParams = new URLSearchParams();
        
        // Handle sublocation parameter
        if (params.Sublocation) {
          queryParams.append("Sublocation", params.Sublocation);
        }
        
        // Handle category parameter
        if (params.CategoryName) {
          queryParams.append("CategoryName", params.CategoryName);
        }

        if (params.DesignName) {
          queryParams.append("DesignName", params.DesignName);
        }
        
        // Handle seasons as multiple separate parameters
        if (params.SeasonNames) {
          if (Array.isArray(params.SeasonNames)) {
            // If it's an array, add each season separately
            params.SeasonNames.forEach(season => {
              queryParams.append("SeasonNames", season);
            });
          } else if (typeof params.SeasonNames === 'string') {
            // If it's a single string, add it directly
            queryParams.append("SeasonNames", params.SeasonNames);
          }
        }
        
        const url = `/${SUB_URL}/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log("Search URL:", url);
        const res = await BaseRequest.Get(url, false);
        return res;
      } finally {
        nProgress.done();
      }
    },
    enabled: true,
  });
}

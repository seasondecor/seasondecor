import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Product`;

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No product provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/createProduct`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetProductById(id) {
  return useQuery({
    queryKey: ["product_by_id", id],
    queryFn: async () => {
      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getById/${id}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!id,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No product provided");

      // Get the product ID from the FormData
      const productId = data.get("id");
      
      if (!productId) throw new Error("Product ID is required for updating");

      nProgress.start();

      try {
        return await BaseRequest.Put(`/${SUB_URL}/updateProduct/${productId}`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useRemoveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await BaseRequest.Delete(`/${SUB_URL}/deleteProduct/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_list_by_provider"] });
    },
  });
}

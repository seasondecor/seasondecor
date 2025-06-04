import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Wallet`;

export function useGetWallet() {
  return useQuery({
    queryKey: ["get_wallet"],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `/${SUB_URL}/getWalletBalance`,
        false
      );
      return response.data;
    },
    staleTime: 300000, // Data stays fresh for 5 minutes
    cacheTime: 3600000, // Cache is kept for 1 hour
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false,
  });
}

export function useGetTransaction() {
  return useQuery({
    queryKey: ["get_transaction"],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `/${SUB_URL}/getTransactionsDetails`,
        false
      );
      return response.data;
    },
    staleTime: 300000, // Data stays fresh for 5 minutes
    cacheTime: 3600000, // Cache is kept for 1 hour
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false,
  });
}

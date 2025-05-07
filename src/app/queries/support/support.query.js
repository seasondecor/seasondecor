import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Support`;

export function useCreateTicket() {
  return useMutation({
    mutationFn: async (data) => {
      try {
        nProgress.start();
        return await BaseRequest.Post(`/${SUB_URL}/createTicket`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useReplyTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      try {
        nProgress.start();
        const supportId = data.get("TicketId");
        return await BaseRequest.Post(`/${SUB_URL}/replyTicket?supportId=${supportId}`, data);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket-for-provider"] });
    },
  });
}

export function useGetSupportTicketForCustomer() {
  return useQuery({
    queryKey: ["support-ticket-for-customer"],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `/${SUB_URL}/getPaginatedSupportTicketsForCustomer`,
        false
      );
      return response.data;
    },
  });
}

export function useGetSupportTicketForProvider() {
  return useQuery({
    queryKey: ["support-ticket-for-provider"],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `/${SUB_URL}/getPaginatedSupportTicketsForProvider`,
        false
      );
      return response.data;
    },
  });
}


export function useMarkAsSolved() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (supportId) => {
      return await BaseRequest.Post(`/${SUB_URL}/markAsSolved/${supportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket-for-provider"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";


const SUB_URL = `api/AccountManagement`;

export function useBanAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId) => {
      return await BaseRequest.Put(`${SUB_URL}/toggle-status/${accountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account_list"] });
    },
  });
}



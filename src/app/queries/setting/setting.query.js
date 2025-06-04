import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Setting`;

export function useGetListSetting() {
  return useQuery({
    queryKey: ["list_setting"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getList`, false);
      return res.data;
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const id = data.id;
      const res = await BaseRequest.Put(
        `${SUB_URL}/updateSetting?id=${id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list_setting"] });
    },
  });
}

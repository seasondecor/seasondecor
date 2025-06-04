import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/ScopeOfWork`;

export function useGetListWorkScope() {
  return useQuery({
    queryKey: ["get_list_work_scope"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getList`, false);
      return res.data;
    },
  });
}

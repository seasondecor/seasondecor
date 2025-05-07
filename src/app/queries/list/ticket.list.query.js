import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/TicketType`;

export function useGetListTicketType() {
  return useQuery({
    queryKey: ["get_list_ticket_type"],
    queryFn: async () => {
      const res = await BaseRequest.Get(SUB_URL, false);
      return res.data;
    },
  });
}

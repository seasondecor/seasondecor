import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/DecorService`;

export function useGetOfferingNStyle() {
  return useQuery({
    queryKey: ["get_offeringNStyle"],
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/${SUB_URL}/getAllOfferingAndStyles`,
        false
      );
      return res.data;
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/ZoomMeeting`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  status: "",
  sortBy: "",
  descending: true,
};

export function useGetMeetingListForProvider(
  bookingCode,
  paginationParams = {}
) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["meeting_list", bookingCode, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListForProvider?BookingCode=${bookingCode}`;

        url += `&PageIndex=${params.pageIndex}`;
        url += `&PageSize=${params.pageSize}`;

        if (params.status !== undefined && params.status !== "")
          url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;
        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const response = await BaseRequest.Get(url, false);

        if (response && typeof response === "object") {
          if (response.data) {
            return response.data;
          } else if (Array.isArray(response)) {
            return {
              data: response,
              totalCount: response.length,
              totalPages: Math.ceil(response.length / params.pageSize),
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
    enabled: !!bookingCode,
    keepPreviousData: true,
    staleTime: 30000,
  });
}

export function useGetMeetingListForCustomer(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useMutation({
    mutationFn: async (data = {}) => {
      nProgress.start();
      try {
        // Get bookingCode from data parameter or default to empty string
        const bookingCode = data?.bookingCode || "";

        let url = `/${SUB_URL}/getPaginatedListForCustomer?BookingCode=${bookingCode}`;

        url += `&PageIndex=${params.pageIndex}`;
        url += `&PageSize=${params.pageSize}`;

        if (params.status !== undefined && params.status !== "")
          url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;
        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const response = await BaseRequest.Post(url, data, false);

        if (response && typeof response === "object") {
          if (response.data) {
            return response.data;
          } else if (Array.isArray(response)) {
            return {
              data: response,
              totalCount: response.length,
              totalPages: Math.ceil(response.length / params.pageSize),
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
  });
}

export function useCreateMeetingRequest() {
  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(
          `/${SUB_URL}/createMeetingRequest/${data.bookingCode}`,
          { startTime: data.startTime }
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useAcceptMeetingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(
          `/${SUB_URL}/acceptingMeetingRequest/${data.bookingCode}?id=${data.id}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: async (_, variables) => {
      // Invalidate and refetch meeting list queries to update UI
      await queryClient.invalidateQueries([
        "meeting_list",
        variables.bookingCode,
      ]);
      await queryClient.invalidateQueries([
        "meeting_list_customer",
        variables.bookingCode,
      ]);
    },
  });
}

export function useRejectMeetingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/rejectMeetingRequest/${data.bookingCode}?id=${data.id}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: async (_, variables) => {
      // Invalidate and refetch meeting list queries to update UI
      await queryClient.invalidateQueries([
        "meeting_list",
        variables.bookingCode,
      ]);
      await queryClient.invalidateQueries([
        "meeting_list_customer",
        variables.bookingCode,
      ]);
    },
  });
}

export function useGetJoinInfo(id) {
  return useQuery({
    queryKey: ["join_info", id],
    queryFn: async () => {
      nProgress.start();
      try {
        const response = await BaseRequest.Get(
          `/${SUB_URL}/join-info/${id}`,
          false
        );
        return response.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetProviderMeetingForCustomer(bookingCode) {
  return useQuery({
    queryKey: ["provider_meeting_for_customer", bookingCode],
    queryFn: async () => {
      nProgress.start();
      try {
        const response = await BaseRequest.Get(
          `/${SUB_URL}/getProviderMeetingForCustomer?BookingCode=${bookingCode}`,
          false
        );
        return response.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Booking`;

export function useBookService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/create`, data);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-customer"],
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/cancel/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/status/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/reject/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}

export function useGetBookingDetailForProvider(bookingCode) {
  return useQuery({
    queryKey: ["booking-detail-for-provider", bookingCode],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/getBookingDetailsForProvider/${bookingCode}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useChangeBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/status/${bookingCode}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}

export function useCancelBookingRequest() {
  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        const { bookingCode, ...requestBody } = data;
        return await BaseRequest.Put(
          `/${SUB_URL}/requestCancel/${bookingCode}`,
          requestBody
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useDepositBooking() {
  return useMutation({
    mutationFn: async (bookingCode) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/deposit/${bookingCode}`);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function usePaymentBooking() {
  return useMutation({
    mutationFn: async (bookingCode) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/payment/${bookingCode}`);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetPendingCancelByBookingCode(
  bookingCode,
  shouldFetch = false
) {
  return useQuery({
    queryKey: ["pending-cancel-by-booking-code", bookingCode, shouldFetch],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/getPendingCancelBookingDetailByBookingCode/${bookingCode}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: shouldFetch,
  });
}

export function useApproveCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode) => {
      return await BaseRequest.Put(
        `/${SUB_URL}/approveCancellation/${bookingCode}`
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["booking-detail-for-provider"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["booking-list-for-provider"],
        }),
      ]);
    },
  });
}

export function useRevokeCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode) => {
      return await BaseRequest.Put(
        `/${SUB_URL}/revokeCancellation/${bookingCode}`
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["booking-detail-for-provider"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["booking-list-for-provider"],
        }),
      ]);
    },
  });
}

export function usePayCommitDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode) => {
      return await BaseRequest.Post(
        `/${SUB_URL}/processCommitDeposit/${bookingCode}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-customer"],
      });
    },
  });
}

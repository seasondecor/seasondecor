import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/contract`;

export function useCreateContractByQuotationCode() {
  return useMutation({
    mutationFn: async (data) => {
      const { quotationCode, ...contractData } = data;

      if (!quotationCode) throw new Error("No quotation code provided");

      nProgress.start();

      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/createByQuotationCode/${quotationCode}`,
          contractData
        );
        return res;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetContractFile(quotationCode) {
  return useQuery({
    queryKey: ["get_contract_file", quotationCode],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/getContractFile/${quotationCode}`,
          false
        );
        return res;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useSignContract() {
  return useMutation({
    mutationFn: async (contractCode) => {
      nProgress.start();
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/requestSignature/${contractCode}`
        );
        return res;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useVerifySignature() {
  return useMutation({
    mutationFn: async (token) => {
      nProgress.start();
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/verifySignature`,
          token,
          false
        );
        return res;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useRequestTerminationOtp() {
  return useMutation({
    mutationFn: async (contractCode) => {
      return await BaseRequest.Post(
        `/${SUB_URL}/requestTerminationOtp/${contractCode}`
      );
    },
  });
}

export function useTerminateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const { contractCode, otp } = data;
      return await BaseRequest.Put(
        `/${SUB_URL}/terminateContract/${contractCode}?otp=${otp}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_contract_file"] });
    },
  });
}

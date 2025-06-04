import { useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Auth`;

export function useRegisterCustomer() {
  return useMutation({
    mutationFn: async (userData) => {
      nProgress.start();
      console.log("Registering user:", userData);
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/register-customer`,
          userData
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (userData) => {
      nProgress.start();
      console.log("Verifying email:", userData);
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/verify-email`,
          userData
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

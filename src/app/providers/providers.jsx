"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./authprovider";
import { UserProvider } from "./userprovider";
import { Provider } from "react-redux";
import store from "../lib/redux/store";
import { Worker } from "@react-pdf-viewer/core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <AuthProvider>
              <UserProvider>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Toaster richColors position="bottom-right" />
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    {children}
                  </ThemeProvider>
                </Worker>
              </UserProvider>
            </AuthProvider>
          </QueryClientProvider>
        </Provider>
      </Suspense>
    </>
  );
}

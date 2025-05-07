"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import quotationSlice from "./reducers/quotationSlice";
import ticketSlice from "./reducers/ticketSlice";

const store = configureStore({
    reducer: {
        users: userSlice,
        quotation: quotationSlice,
        ticket: ticketSlice,
    },
    // Thêm middleware thunk
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  });

export default store;
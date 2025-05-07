"use client";

import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    ticketState: "",
  },
  reducers: {
    setTicketState: (state, action) => {
      state.ticketState = action.payload;
    },
    resetTicketState: (state) => {
      state.ticketState = "";
    },
  },
});

export const {
  setTicketState,
  resetTicketState,
} = ticketSlice.actions;
export default ticketSlice.reducer;

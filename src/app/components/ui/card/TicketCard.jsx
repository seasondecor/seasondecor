"use client";

import React from "react";
import { FootTypo } from "../Typography";

const TicketCard = ({ id, date, time, status, subject, reportedBy, onClick }) => {
  const getStatus = (status) => {
    if (status) {
      return (
        <FootTypo
          footlabel="Closed"
          className="bg-red text-white px-2 py-1 rounded-full"
        />
      );
    } else {
      // Default status display
      return (
        <FootTypo
          footlabel="Opened"
          className="bg-green text-white px-2 py-1 rounded-full"
        />
      );
    }
  };

  return (
    <div className="div h-auto min-h-[8em] w-full border border-gray-200 rounded-[1em] overflow-hidden relative group p-5 z-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-[#FF5800] group-hover:scale-[800%] duration-500 z-[-1] op"></div>

      <button className="text-[0.8em] absolute bottom-[1em] left-[1em] text-[#6C3082] group-hover:text-[white] duration-500">
        <i className="fa-solid fa-arrow-right"></i>
      </button>

      <h1 className="z-20 font-bold duration-500 text-[1.4em] mb-2">
        Ticket ID: {id}
      </h1>

      <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">
          Created: {date || "N/A"} {time ? `at ${time}` : ""}
        </p>
        <p className="text-sm font-medium">
          Reported by: <FootTypo footlabel={reportedBy || "You"} className="bg-primary px-2 py-1 rounded-full" />
        </p>
      </div>
        
        <div className="flex flex-col gap-2">
          <div className="ml-2">{getStatus(status)}</div>
          <button
            className="underline"
            onClick={onClick}
          >
            View Details
          </button>
        </div>
      </div>

      <p className="text-sm font-medium">Subject:</p>
      <p className="text-sm mb-3">{subject || "No subject provided"}</p>
    </div>
  );
};

export default TicketCard;

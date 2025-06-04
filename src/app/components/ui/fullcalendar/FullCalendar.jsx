"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import PropTypes from "prop-types";

const CustomFullCalendar = ({
  events = [],
  initialView = "dayGridMonth",
  height = "auto",
  eventClick,
  dateClick,
  headerToolbar = {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  eventContent,
  businessHours = {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: "08:00",
    endTime: "18:00",
  },
  slotMinTime = "08:00:00",
  slotMaxTime = "18:00:00",
  className = "",
  ...props
}) => {
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView,
    height,
    events,
    headerToolbar,
    eventClick,
    dateClick,
    eventContent,
    businessHours,
    slotMinTime,
    slotMaxTime,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: false,
    weekends: true,
    nowIndicator: true,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: true,
      hour12: true,
    },
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    eventDisplay: "block",
    eventOverlap: false,
    allDaySlot: false,
    moreLinkContent: (args) => {
      return `${args.num} requests`;
    },
    ...props,
  };

  return (
    <div className={`calendar-container ${className}`}>
      <style jsx global>{`
        .calendar-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fc {
          flex: 1;
          --fc-border-color: #e5e7eb;
          --fc-button-text-color: #374151;
          --fc-button-bg-color: #ffffff;
          --fc-button-border-color: #e5e7eb;
          --fc-button-hover-bg-color: #f3f4f6;
          --fc-button-hover-border-color: #2563eb;
          --fc-button-active-bg-color: #2563eb;
          --fc-button-active-border-color: #2563eb;
          --fc-event-bg-color: #2563eb;
          --fc-event-border-color: #2563eb;
          --fc-event-text-color: #ffffff;
          --fc-today-bg-color: #eff6ff;
          --fc-neutral-bg-color: #ffffff;
          --fc-list-event-hover-bg-color: #f3f4f6;
          --fc-highlight-color: #eff6ff;
          --fc-more-link-bg-color: #f3f4f6;
          --fc-more-link-text-color: #374151;
          font-family: inherit;
        }

        .dark .fc {
          --fc-border-color: #374151;
          --fc-button-text-color: #e5e7eb;
          --fc-button-bg-color: #1f2937;
          --fc-button-border-color: #374151;
          --fc-button-hover-bg-color: #374151;
          --fc-button-hover-border-color: #60a5fa;
          --fc-button-active-bg-color: #2563eb;
          --fc-button-active-border-color: #2563eb;
          --fc-today-bg-color: rgba(37, 99, 235, 0.1);
          --fc-neutral-bg-color: #1f2937;
          --fc-list-event-hover-bg-color: #374151;
          --fc-highlight-color: rgba(37, 99, 235, 0.1);
          --fc-more-link-bg-color: #374151;
          --fc-more-link-text-color: #e5e7eb;
          color: #e5e7eb;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600;
        }

        .fc .fc-button {
          text-transform: capitalize;
          padding: 0.5rem 1rem;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: all 200ms ease;
          box-shadow: none !important;
        }

        .fc .fc-button:focus {
          box-shadow: none;
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .fc .fc-button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .fc .fc-view-harness {
          background-color: var(--fc-neutral-bg-color);
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .fc .fc-scrollgrid {
          border: 1px solid var(--fc-border-color);
          border-radius: 0.75rem;
        }

        .fc .fc-scrollgrid-section-header > td {
          border-bottom: 2px solid var(--fc-border-color);
          background-color: var(--fc-neutral-bg-color);
        }

        .fc .fc-col-header-cell {
          padding: 1rem;
          background-color: var(--fc-neutral-bg-color);
          font-weight: 600;
        }

        .fc .fc-daygrid-day {
          transition: background-color 200ms ease;
        }

        .fc .fc-daygrid-day:hover {
          background-color: var(--fc-highlight-color);
        }

        .fc .fc-event {
          cursor: pointer;
          border-radius: 0.5rem;
          padding: 0.25rem;
          margin: 0.25rem 0;
          border: none;
          transition: all 200ms ease;
        }

        .fc .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                     0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .fc .fc-event-past {
          opacity: 0.75;
        }

        .fc .fc-popover {
          border: 1px solid var(--fc-border-color);
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                     0 4px 6px -2px rgba(0, 0, 0, 0.05);
          background-color: var(--fc-neutral-bg-color);
          max-width: 400px !important;
        }

        .fc .fc-popover-header {
          background-color: var(--fc-neutral-bg-color);
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--fc-border-color);
          font-weight: 500;
        }

        .fc .fc-popover-body {
          padding: 0.75rem;
          max-height: 300px !important;
          overflow-y: auto;
        }

        .fc .fc-popover-body::-webkit-scrollbar {
          width: 6px;
        }

        .fc .fc-popover-body::-webkit-scrollbar-track {
          background-color: var(--fc-highlight-color);
          border-radius: 3px;
        }

        .fc .fc-popover-body::-webkit-scrollbar-thumb {
          background-color: var(--fc-button-active-bg-color);
          border-radius: 3px;
        }

        .fc .fc-timegrid-now-indicator-line {
          border-color: #ef4444;
        }

        .fc .fc-timegrid-now-indicator-arrow {
          border-color: #ef4444;
          background-color: #ef4444;
        }

        .fc .fc-timegrid-slot {
          height: 3rem;
        }

        .fc .fc-list-empty {
          background-color: var(--fc-neutral-bg-color);
        }

        .fc .fc-list-event:hover td {
          background-color: var(--fc-highlight-color);
        }

        .fc .fc-daygrid-day-events {
          min-height: 0;
          padding: 2px;
        }

        .fc .fc-daygrid-more-link {
          margin: 4px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          background-color: var(--fc-more-link-bg-color);
          color: var(--fc-more-link-text-color);
          cursor: pointer;
          transition: all 200ms ease;
        }

        .fc .fc-daygrid-more-link:hover {
          background-color: var(--fc-button-hover-bg-color);
        }

        .fc .fc-daygrid-day-bottom {
          padding: 1px 2px;
        }

        .fc .fc-event {
          margin: 1px 2px;
          padding: 2px 4px;
          min-height: 24px;
        }
      `}</style>
      <FullCalendar {...calendarOptions} />
    </div>
  );
};

CustomFullCalendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      allDay: PropTypes.bool,
      color: PropTypes.string,
      textColor: PropTypes.string,
      extendedProps: PropTypes.object,
    })
  ),
  initialView: PropTypes.oneOf([
    "dayGridMonth",
    "timeGridWeek",
    "timeGridDay",
    "listWeek",
  ]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  eventClick: PropTypes.func,
  dateClick: PropTypes.func,
  headerToolbar: PropTypes.object,
  eventContent: PropTypes.func,
  businessHours: PropTypes.object,
  slotMinTime: PropTypes.string,
  slotMaxTime: PropTypes.string,
  className: PropTypes.string,
};

export default CustomFullCalendar;

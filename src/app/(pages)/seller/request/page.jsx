"use client";

import React, { useCallback, useState, useEffect } from "react";
import SellerWrapper from "../components/SellerWrapper";
import { useGetPaginatedBookingsForProvider } from "@/app/queries/list/booking.list.query";
import DataTable from "@/app/components/ui/table/DataTable";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Alert,
  Dialog,
  IconButton,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { FaCheck } from "react-icons/fa6";
import { MdCancel, MdClose } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRejectBooking } from "@/app/queries/book/book.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useApproveBooking } from "@/app/queries/book/book.query";
import { TbList, TbCalendar, TbReportAnalytics } from "react-icons/tb";
import { useChangeBookingStatus } from "@/app/queries/book/book.query";
import { MdOutlineEditNote } from "react-icons/md";
import { FootTypo } from "@/app/components/ui/Typography";
import { IoFilterOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { FaTruck } from "react-icons/fa";
import { IoBuild } from "react-icons/io5";
import { MdOutlineFileUpload, MdFilterListOff } from "react-icons/md";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import CustomFullCalendar from "@/app/components/ui/fullcalendar/FullCalendar";
import { useGetProviderMeetingForCustomer } from "@/app/queries/meeting/meeting.query";
import { STATUS_CONFIG } from "@/app/constant/statusConfig";

// Skeleton loader for the request table
const RequestTableSkeleton = () => {
  return (
    <Paper
      elevation={0}
      className="w-full overflow-hidden border dark:bg-gray-800 dark:border-gray-700"
    >
      <Box
        p={2}
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width={150} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="text" width={100} height={30} />
          <Skeleton variant="text" width={80} height={30} />
        </Box>
      </Box>

      <Box px={2}>
        <Box
          mb={2}
          display="flex"
          width="100%"
          sx={{ borderBottom: "1px solid #eee" }}
        >
          {[8, 12, 15, 15, 25, 15, 10].map((width, index) => (
            <Box key={index} width={`${width}%`} p={1.5}>
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          ))}
        </Box>

        {[...Array(5)].map((_, rowIndex) => (
          <Box
            key={rowIndex}
            display="flex"
            width="100%"
            sx={{ borderBottom: "1px solid #f5f5f5" }}
          >
            {[8, 12, 15, 15, 25, 15, 10].map((width, colIndex) => (
              <Box key={colIndex} width={`${width}%`} p={2}>
                {colIndex === 3 ? (
                  <Skeleton variant="rounded" width={90} height={30} />
                ) : colIndex === 4 ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="70%" height={24} />
                  </Box>
                ) : colIndex === 5 ? (
                  <Box display="flex" gap={1}>
                    <Skeleton variant="rounded" width={90} height={36} />
                    <Skeleton variant="rounded" width={90} height={36} />
                  </Box>
                ) : colIndex === 6 ? (
                  <Skeleton variant="text" width={60} height={24} />
                ) : (
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? "40%" : "80%"}
                    height={24}
                  />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Skeleton variant="text" width={100} height={30} />
        <Box display="flex" gap={2}>
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </Box>
    </Paper>
  );
};

const SellerOrderManage = () => {
  const router = useRouter();
  const [bookingLoading, setBookingLoading] = useState({});
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking();
  const { mutate: approveBooking, isPending: isApproving } =
    useApproveBooking();

  const { mutate: changeBookingStatus, isPending: isChangingStatus } =
    useChangeBookingStatus();

  const [filters, setFilters] = useState({
    status: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    descending: true,
  });

  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'calendar'
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    setViewMode("list");
  };

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useGetPaginatedBookingsForProvider(pagination);

  const bookings = bookingsData?.data || [];
  const totalCount = bookingsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const { data: meetingData, isPending: isMeetingLoading } =
    useGetProviderMeetingForCustomer();

  const meetings = meetingData?.data || [];

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Planning" },
    { id: "2", name: "Quoting" },
    { id: "3", name: "Contracting" },
    { id: "4", name: "Confirmed" },
    { id: "5", name: "Deposite Paid" },
    { id: "6", name: "Preparing" },
    { id: "7", name: "In Transit" },
    { id: "8", name: "Progressing" },
    { id: "9", name: "All Done" },
    { id: "10", name: "Final Paid" },
    { id: "11", name: "Completed" },
    { id: "12", name: "Pending Cancel" },
    { id: "13", name: "Cancelled" },
    { id: "14", name: "Rejected" },
  ];

  // Create a dedicated component for action buttons with clear status-based logic
  const ActionButtons = ({ booking }) => {
    const status = booking.status;
    const bookingCode = booking.bookingCode;
    const isLoading = bookingLoading[bookingCode] || false;
    const {
      customer,
      isQuoteExisted,
      isTracked,
      address,
      isCommitDepositPaid,
    } = booking;

    // Helper function to set loading state for this specific booking
    const setLoading = (isLoading) => {
      setBookingLoading((prev) => ({
        ...prev,
        [bookingCode]: isLoading,
      }));
    };

    // Helper function for routing to quotation creation
    const navigateToQuotation = () => {
      router.push(`/seller/quotation/create/${bookingCode}`);
    };

    // Helper function to handle status changes with loading state
    const handleStatusChange = (callback) => {
      setLoading(true);
      changeBookingStatus(bookingCode, {
        onSuccess: () => {
          setLoading(false);
          if (callback) callback();
        },
        onError: () => {
          setLoading(false);
        },
      });
    };

    // Helper function to handle approval with loading state
    const handleApprove = () => {
      setLoading(true);
      approveBooking(bookingCode, {
        onSuccess: () => setLoading(false),
        onError: () => setLoading(false),
      });
    };

    // Helper function to handle rejection with loading state
    const handleReject = () => {
      setLoading(true);
      rejectBooking(bookingCode, {
        onSuccess: () => setLoading(false),
        onError: () => setLoading(false),
      });
    };

    if (status === 11) {
      return (
        <FootTypo footlabel="Completed" className="text-green font-medium" />
      );
    }

    // Pending Cancel status
    if (status === 12) {
      return (
        <Button
          label="Preview request"
          onClick={() => router.push(`/seller/request/${bookingCode}`)}
          className="bg-primary"
          icon={<GoQuestion size={20} />}
          isLoading={isLoading}
        />
      );
    }

    // Pending Approval status (new booking)
    if (status === 0) {
      return (
        <div className="flex gap-2">
          <Button
            label="Approved"
            onClick={handleApprove}
            className="bg-green text-white"
            icon={<FaCheck size={20} />}
            isLoading={isLoading}
          />
          <Button
            label="Reject"
            onClick={handleReject}
            className="bg-red text-white"
            icon={<MdCancel size={20} />}
            isLoading={isLoading}
          />
        </div>
      );
    }

    // Planning status - Create quotation
    if (status === 1 && isCommitDepositPaid) {
      return (
        <Button
          label="Create Quotation"
          onClick={() => handleStatusChange(navigateToQuotation)}
          className="bg-yellow"
          icon={<TbReportAnalytics size={20} />}
          isLoading={isLoading}
        />
      );
    } else if (status === 1 && !isCommitDepositPaid) {
      return (
        <FootTypo footlabel="Waiting for deposit" className="font-medium" />
      );
    }
    // Quoting status - Edit quotation
    if (status === 2 && !isQuoteExisted) {
      return (
        <Button
          label="Edit Quotation"
          onClick={navigateToQuotation}
          className="bg-yellow"
          icon={<MdOutlineEditNote size={20} />}
          isLoading={isLoading}
        />
      );
    }

    // Contracting status with quote
    if (status === 3 && isQuoteExisted) {
      return (
        <Alert
          severity="info"
          variant="outlined"
          color="warning"
          sx={{
            paddingX: 1,
            paddingY: 0.2,
            borderRadius: 100,
            justifyContent: "start",
            width: "fit-content",
          }}
        >
          Contracting
        </Alert>
      );
    }

    if (status === 4) {
      return <FootTypo footlabel="Confirmed" className=" text-green" />;
    }

    // Deposit paid status
    if (status === 5) {
      return (
        <Button
          label="Preparing"
          className="bg-primary"
          onClick={() => handleStatusChange()}
          icon={<TbReportAnalytics size={20} />}
          isLoading={isLoading}
        />
      );
    }

    if (status === 6) {
      return (
        <Button
          label="In transit"
          className="bg-primary"
          onClick={() => handleStatusChange()}
          icon={<FaTruck size={20} />}
          isLoading={isLoading}
        />
      );
    }
    if (status === 7) {
      return (
        <Button
          label="Progress Start"
          className="bg-primary"
          onClick={() => handleStatusChange()}
          icon={<IoBuild size={20} />}
          isLoading={isLoading}
        />
      );
    }

    if (status === 9) {
      return (
        <FootTypo
          footlabel="Waiting for final payment"
          className="font-medium"
        />
      );
    }

    if (status === 10) {
      return (
        <Button
          label="Finish service"
          onClick={() => handleStatusChange()}
          className="bg-action text-white"
          icon={<FaCheck size={20} />}
          isLoading={isLoading}
        />
      );
    }

    if (isTracked) {
      return (
        <Button
          label="Update Progress"
          className="bg-primary"
          onClick={() => router.push(`/seller/tracking/${bookingCode}`)}
          icon={<MdOutlineFileUpload size={20} />}
          isLoading={isLoading}
        />
      );
    }

    if (status === 8) {
      return (
        <Button
          label="Progress Tracking"
          onClick={() => router.push(`/seller/tracking/${bookingCode}`)}
          icon={<MdOutlineFileUpload size={20} />}
          isLoading={isLoading}
        />
      );
    }

    // Cancelled status
    if (status === 13) {
      return <FootTypo footlabel="Cancelled" className="text-red" />;
    }

    // Quote exists but not yet confirmed
    if (isQuoteExisted) {
      return (
        <FootTypo footlabel="Confirmation pending" className="font-medium" />
      );
    }

    // Default - No specific action
    return <FootTypo footlabel="No action required" />;
  };

  // Update the columns definition to use the ActionButtons component
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <FootTypo footlabel={row.original.bookingId} />,
    },
    {
      header: "Code",
      accessorKey: "Code",
      cell: ({ row }) => (
        <FootTypo footlabel={row.original.bookingCode} fontWeight="bold" />
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <FootTypo
          footlabel={new Date(row.original.createdAt).toLocaleDateString(
            "vi-VN"
          )}
        />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <StatusChip status={row.original.status} isBooking={true} />
      ),
    },
    {
      header: "From",
      accessorKey: "from",
      cell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            userImg={row.original.customer.avatar}
            alt={row.original.customer.businessName}
            w={40}
            h={40}
          />
          <FootTypo footlabel={row.original.customer.fullName} />
        </Box>
      ),
    },

    {
      header: "Actions",
      cell: ({ row }) => <ActionButtons booking={row.original} />,
    },
    {
      header: "Detail",
      cell: ({ row }) => (
        <Box
          component="button"
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() =>
            router.push(`/seller/request/${row.original.bookingCode}`)
          }
          className="hover:underline"
        >
          <IoEyeOutline size={20} />
          View
        </Box>
      ),
    },
    {
      header: "Commit Deposit",
      cell: ({ row }) => {
        const isCommitted = row.original.isCommitDepositPaid;
        return (
          <div
            className={`${isCommitted ? "bg-success-light" : "bg-error-light"}`}
          >
            <Alert
              severity={isCommitted ? "success" : "error"}
              sx={{
                paddingX: 0,
                paddingY: 0.2,
                borderRadius: 100,
                justifyContent: "center",
              }}
            >
              {isCommitted ? "Committed" : "Not Committed"}
            </Alert>
          </div>
        );
      },
    },
  ];

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[250px] dark:text-white"
      >
        <InputLabel id="status-label" className="dark:text-white">
          Status
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="status-label"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          label="Status"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        icon={<MdFilterListOff size={20} />}
        label="Reset Filter"
        onClick={() =>
          setFilters({
            status: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  // Function to get event color based on status
  const getEventColor = (status) => {
    // Get the booking status config from StatusChip
    const bookingStatus = STATUS_CONFIG.booking[status];

    // MUI theme color mapping to hex values
    const colorMap = {
      success: "#4caf50", // Green
      warning: "#ff9800", // Orange
      primary: "#2196f3", // Blue
      error: "#f44336", // Red
      default: "#9e9e9e", // Grey
    };

    return bookingStatus ? colorMap[bookingStatus.color] : colorMap.default;
  };

  // Function to get status label
  const getStatusLabel = (status) => {
    return STATUS_CONFIG.booking[status]?.label || "Unknown";
  };

  // Function to format events for the calendar
  const formatEventsForCalendar = (bookings) => {
    // Group bookings by date
    const bookingsByDate = bookings.reduce((acc, booking) => {
      const date = new Date(booking.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {});

    // Create events array
    return Object.entries(bookingsByDate).flatMap(([date, dateBookings]) => {
      // Create individual events for each booking
      const events = dateBookings.map((booking) => ({
        id: booking.bookingCode,
        title: `Request #${booking.bookingId}`,
        start: booking.createdAt,
        backgroundColor: getEventColor(booking.status),
        borderColor: "transparent",
        textColor: "#fff",
        extendedProps: {
          status: booking.status,
          customerName: booking.customer.fullName,
          customerEmail: booking.customer.email,
          bookingCode: booking.bookingCode,
          avatar: booking.customer.avatar,
          statusLabel: getStatusLabel(booking.status),
          statusColor: getEventColor(booking.status),
          totalRequests: dateBookings.length,
        },
      }));

      return events;
    });
  };

  // Handle calendar event click
  const handleEventClick = (info) => {
    const { bookingCode } = info.event.extendedProps;
    router.push(`/seller/request/${bookingCode}`);
  };

  // Custom event content renderer
  const renderEventContent = (eventInfo) => ({
    html: `
      <div class="flex flex-col gap-1 p-1.5 w-full h-full">
        <div class="flex items-center gap-2">
          <img 
            src="${
              eventInfo.event.extendedProps.avatar || "/img/user-ava.jpg"
            }" 
            alt="${eventInfo.event.extendedProps.customerName || "User"}"
            class="w-5 h-5 rounded-full ring-1 ring-gray-300"
            onerror="this.onerror=null; this.src='/img/user-ava.jpg';"
          />
          <span class="font-medium text-sm truncate">
            ${eventInfo.event.title}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-xs truncate">
            ${eventInfo.event.extendedProps.customerName || "Unknown User"}
          </span>
          <span class="text-xs font-semibold ">
            ${eventInfo.event.extendedProps.statusLabel}
          </span>
        </div>
      </div>
    `,
  });

  return (
    <SellerWrapper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <h1 className="text-2xl font-bold">Request Management</h1>

          <ButtonGroup
            variant="outlined"
            size="small"
            sx={{
              gap: 1,
              "& .MuiButton-root": {
                borderColor: "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              },
            }}
          >
            <Tooltip title="List View">
              <Button
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-primary" : ""}
                icon={<TbList size={20} />}
                label="List"
              />
            </Tooltip>
            <Tooltip title="Calendar View">
              <Button
                onClick={() => {
                  setViewMode("calendar");
                  setIsCalendarOpen(true);
                }}
                className={
                  viewMode === "calendar" ? "!bg-primary !text-white" : ""
                }
                icon={<TbCalendar size={20} />}
                label="Calendar"
              />
            </Tooltip>
          </ButtonGroup>
        </Box>

        <RefreshButton
          onRefresh={refetch}
          isLoading={isLoading}
          tooltip="Refresh request list"
        />
      </Box>

      {/* Calendar Dialog */}
      <Dialog
        fullScreen
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "background.default",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            position: "relative",
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <h2 className="text-xl font-semibold">Request Calendar View</h2>
          </Box>
          <Tooltip title="Close">
            <IconButton
              onClick={handleCloseCalendar}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
            >
              <MdClose size={24} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            p: 3,
            height: "calc(100vh - 70px)",
          }}
        >
          <CustomFullCalendar
            events={formatEventsForCalendar(bookings)}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="100%"
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            eventClassNames="overflow-hidden hover:opacity-90 transition-opacity"
            dayCellClassNames="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            eventMinHeight={80}
            eventDisplay="block"
          />
        </Box>
      </Dialog>

      <FilterSelectors />

      {viewMode === "list" && (
        <>
          {isLoading && bookings.length === 0 ? (
            <RequestTableSkeleton />
          ) : bookings.length === 0 && !isLoading ? (
            <div className="">
              <h2 className="text-xl font-semibold mb-4">No Orders Found</h2>
              <p>
                {filters.status
                  ? "No requests match your filter criteria. Try adjusting your filters."
                  : "You don't have any requests at the moment."}
              </p>
            </div>
          ) : (
            <DataTable
              data={bookings}
              columns={columns}
              isLoading={isLoading}
              showPagination={true}
              pageSize={pagination.pageSize}
              initialPageIndex={tablePageIndex}
              manualPagination={true}
              manualSorting={false}
              pageCount={totalPages}
              onPaginationChange={handlePaginationChange}
              totalCount={totalCount}
            />
          )}
        </>
      )}
    </SellerWrapper>
  );
};

export default SellerOrderManage;

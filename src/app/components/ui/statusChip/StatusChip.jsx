"use client";

import { Chip } from "@mui/material";
import { STATUS_CONFIG } from "@/app/constant/statusConfig";

const StatusChip = ({
  status,
  className,
  isOrder = false,
  isBooking = false,
  isService = false,
  isQuotation = false,
  isContract = false,
}) => {
  // Determine which status type to use
  const getStatusType = () => {
    if (isService) return "service";
    if (isBooking) return "booking";
    if (isQuotation) return "quotation";
    if (isContract) return "contract";
    if (isOrder) return "order";
    return "booking"; // Default to booking if no type specified
  };

  const statusType = getStatusType();
  const statusConfig = STATUS_CONFIG[statusType]?.[status];

  if (!statusConfig) {
    return (
      <Chip
        size="medium"
        variant="filled"
        label="Unknown"
        color="default"
        className={className}
      />
    );
  }

  const Icon = statusConfig.icon;

  return (
    <Chip
      size="medium"
      variant="filled"
      label={statusConfig.label}
      color={statusConfig.color}
      icon={
        <Icon
          className={statusConfig.animate ? "animate-pulse" : ""}
        />
      }
      className={className}
    />
  );
};

export default StatusChip;

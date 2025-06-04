"use client";

import { Chip } from "@mui/material";
import { FaUser, FaUserShield } from "react-icons/fa";

const RoleChip = ({ status }) => {
  // Configuration for different role types
  const getRoleConfig = (status) => {
    switch (status) {
      case 2:
        return {
          label: "Provider",
          color: "primary",
          icon: FaUserShield,
        };
      case 3:
        return {
          label: "Customer",
          color: "default",
          icon: FaUser,
        };
      default:
        return {
          label: "Unknown",
          color: "default",
          icon: FaUser,
        };
    }
  };

  const roleConfig = getRoleConfig(status);
  const Icon = roleConfig.icon;

  return (
    <Chip
      label={roleConfig.label}
      color={roleConfig.color}
      variant="outlined"
      icon={<Icon />}
      size="medium"
      className="dark:text-white"
    />
  );
};

export default RoleChip;

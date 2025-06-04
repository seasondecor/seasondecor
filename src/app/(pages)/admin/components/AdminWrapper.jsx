"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/app/components/ui/sidebar/Sidebar";
import {
  IconReceipt,
  IconBrandTabler,
  IconChartBarPopular,
  IconSettings,
  IconFileInfo,
} from "@tabler/icons-react";
import { cn } from "@/app/utils/Utils";
import ScrollToTop from "@/app/components/ScrollToTop";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";

const SidebarLinkWithActiveState = ({ link }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(link.href);

  return (
    <SidebarLink
      link={link}
      className={cn(
        isActive &&
          "font-bold text-primary bg-primary/10 border-r-2 border-primary"
      )}
    />
  );
};

export default function AdminWrapper({ children }) {
  const links = [
    {
      label: "Overeview System",
      href: "/admin/dashboard",
      icon: <IconBrandTabler className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "User Management",
      href: "/admin/manage/account",
      icon: <IconReceipt className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Application Management",
      href: "/admin/manage/application",
      icon: <IconFileInfo className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Transaction Management",
      href: "/admin/manage/transaction",
      icon: <IconChartBarPopular className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/admin/setting",
      icon: <IconSettings className=" h-5 w-5 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full flex-col rounded-md md:flex-row overflow-x-clip"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <Box
            display="flex"
            flexDirection="column"
            flex={1}
            sx={{
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {links.map((link, idx) => (
                <SidebarLinkWithActiveState key={idx} link={link} />
              ))}
            </Box>
          </Box>
        </SidebarBody>
      </Sidebar>
      <ScrollToTop />
      <Dashboard props={children} />
    </div>
  );
}

// Dummy dashboard component with content
const Dashboard = ({ props }) => {
  return (
    <Box display="flex" flex={1}>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        borderLeft="1px solid #e0e0e0"
        borderRadius={2}
        p={4}
      >
        {props}
      </Box>
    </Box>
  );
};

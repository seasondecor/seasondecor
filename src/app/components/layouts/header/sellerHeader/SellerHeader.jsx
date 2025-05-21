"use client";

import { useState } from "react";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import { UserMenu } from "../UserMenu";
import { useSession } from "next-auth/react";
import { NotificationBtn } from "../components/indexBtn";
import AnchorDrawer from "@/app/components/ui/notification/Notifcation";
import Alert from '@mui/material/Alert';

const SellerHeader = () => {
  const { data } = useSession();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <header className="z-[50] sticky top-0 w-full border-b bg-white dark:bg-black border-neutral-200 dark:border-white/[0.1]">
      <div className="header-container px-8 flex items-center w-full mx-auto">
        <Logo />
        <Alert variant="outlined" severity="info">Welcome to Provider Dashboard <span className="font-bold">{data?.user?.name}</span></Alert>

        <div className="right-wrapper flex flex-1 items-center justify-end gap-5 sm:gap-3 md:justify-end">
          <ThemeSwitch />/
          <NotificationBtn toggleDrawer={toggleDrawer} />
          <AnchorDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
          {data?.user && (
            <>
              <UserMenu />
            </>
          )}
          {!data?.user && "not allow"}
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;

"use client";

import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import ShinyText from "./ui/animated/ShinyText";
import { usePathname } from "next/navigation";
import { useUser } from "../providers/userprovider";
import { Box } from "@mui/material";

const Logo = ({ outsideStyle, insideStyle }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const isSeller = pathname.startsWith("/seller/");
  const isAdmin = pathname.startsWith("/admin/");

  const destination = user?.isProvider ? "/seller/dashboard" : "/";

  return (
    <div className={clsx("center-wrapper hidden md:flex mr-4", outsideStyle)}>
      <div
        className={clsx(
          "flex items-center justify-center space-x-2 text-2xl font-bold py-4 text-center text-neutral-600 dark:text-gray-100 selection:bg-emerald-500 mr-10",
          insideStyle
        )}
      >
        <Link href={destination} className="relative flex items-center">
          {/* Logo Image */}
          <div className="relative h-8 w-8 md:h-6 md:w-6 bg-black border border-slate-800 text-white flex items-center justify-center rounded-md text-sm antialiased">
            <div className="absolute h-10 w-full bg-white/[0.2] -top-10 inset-x-0 rounded-full blur-xl"></div>
            <div className="text-sm text-emerald-500 relative z-20">
              <Image
                src={"/logo/logo-black.png"}
                alt="Logo"
                loading="lazy"
                width={50}
                height={50}
                decoding="async"
                className="block dark:hidden"
                style={{ color: "transparent" }}
              />
              <Image
                src={"/logo/logo-white.png"}
                alt="Logo"
                loading="lazy"
                width={50}
                height={50}
                decoding="async"
                className="hidden dark:block"
                style={{ color: "transparent" }}
              />
            </div>
          </div>

          {/* Text Container */}
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" position="relative" ml={1}>
            {isSeller && (
              <Box position="absolute" top={-20} right={-30}>
                <ShinyText
                  text="Provider"
                  disabled={false}
                  speed={3}
                  className="text-xs font-semibold font-tertiary"
                />
              </Box>
            )}

            {isAdmin && (
              <Box position="absolute" top={-20} right={-30}>
                <ShinyText
                  text="Administrator"
                  disabled={false}
                  speed={3}
                  className="text-xs font-semibold font-tertiary"
                />
              </Box>
            )}
            <h1 className="text-black dark:text-white font-tertiary">SeasonDecor</h1>
          </Box>
        </Link>
      </div>
    </div>
  );
};

export default Logo;

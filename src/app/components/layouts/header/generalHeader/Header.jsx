"use client";

import { useState, useEffect, useCallback } from "react";

import { TfiMoreAlt } from "react-icons/tfi";
import ThemeSwitch from "../../../ThemeSwitch";
import Logo from "../../../Logo";
import RightWrapper from "../RightWrapper";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "../UserMenu";
import { CartBtn, NotificationBtn } from "../components/indexBtn";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";
import { ColourfulText } from "@/app/components/ui/animated/ColorfulText";
import { scroller } from "react-scroll";
import Notifcation from "@/app/components/ui/notification/Notifcation";
import { notificationService } from "@/app/services/notificationService";
import { toast } from "sonner";
import { createMarkup } from "@/app/helpers";
import { Container as MuiContainer, Paper } from "@mui/material";

export default function Header() {
  const { user } = useUser();
  const { data: session } = useSession();
  const mutationChangeStatus = useChangeStatus();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  // console.log(session)

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Initialize notification service connection
  useEffect(() => {
    if (user?.id) {
      // Track connection attempts to prevent excessive retries
      let retryCount = 0;
      const maxRetries = 3;

      const connectNotificationService = async () => {
        try {
          if (!notificationService.isConnected()) {
            // console.log("Attempting to connect to notification service...");
            await notificationService.startConnection(user.id);
            // console.log("Successfully connected to notification service");
            retryCount = 0; // Reset retry count on success
          }
        } catch (error) {
          console.error("Failed to connect to notification service:", error);

          // Only retry if we haven't exceeded max retries
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = 2000 * retryCount; // Increase delay with each retry

            //console.log(
            //  `Retry attempt ${retryCount}/${maxRetries} in ${delay}ms`
            //);
            setTimeout(() => {
              if (user?.id && !notificationService.isConnected()) {
                connectNotificationService();
              }
            }, delay);
          } else {
            console.error(
              `Max retries (${maxRetries}) reached. Giving up on notification connection.`
            );
          }
        }
      };

      // Initialize connection with a small delay to ensure all dependencies are properly loaded
      const initTimeout = setTimeout(() => {
        connectNotificationService();
      }, 1000);

      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, [user?.id]);

  // Set up notification event listener
  useEffect(() => {
    if (!user?.id) return;

    // Use a Set to track notifications we've already shown toasts for
    // to prevent duplicate toast notifications
    const shownNotifications = new Set();

    // Listen for new notifications and show toast
    const handleNewNotification = (notification) => {
      // Skip notifications we've already shown
      if (shownNotifications.has(notification.id)) {
        return;
      }

      // Add this notification ID to our shown set
      shownNotifications.add(notification.id);

      // Show toast notification only if the drawer is not open
      if (!isDrawerOpen) {
        toast.info(
          <div className="flex items-start cursor-pointer">
            <div>
              <div className="font-semibold">{notification.title}</div>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={createMarkup(
                  notification.message || notification.content || ""
                )}
              />
            </div>
          </div>,
          {
            duration: 5000,
            onDismiss: () => {},
            onAutoClose: () => {},
            onClick: () => {
              // Handle click on toast notification
              if (notification.url) {
                router.push(notification.url);
              } else {
                toggleDrawer(true)();
              }
            },
          }
        );
      }
    };

    // Register listener
    notificationService.onNotificationReceived(handleNewNotification);

    // Cleanup listener
    return () => {
      notificationService.offNotificationReceived(handleNewNotification);
    };
  }, [user?.id, isDrawerOpen, router, toggleDrawer]);

  const onChangeStatus = useCallback(() => {
    mutationChangeStatus.mutate(true, {
      onSuccess: () => {
        router.push("/seller/dashboard");
      },
      onError: (error) => {
        if (pathname === "/authen/login") {
          return;
        }
        if (error) {
          router.push("/authen/login");
        }

        if (session && !user?.isProvider) {
          if (pathname !== "/") {
            router.push("/");
            setTimeout(() => {
              scroller.scrollTo("providerSection", {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                offset: -50,
              });
            }, 1000);
          } else {
            scroller.scrollTo("providerSection", {
              duration: 800,
              delay: 0,
              smooth: "easeInOutQuart",
              offset: -50,
            });
          }
        }
      },
    });
  }, [mutationChangeStatus, router, pathname, session, user]);

  return (
    <header
      className={`z-[50] fixed top-0 w-full transition-all ${
        isScrolled ? "bg-white dark:bg-black shadow-md dark:shadow-white" : ""
      }`}
      tabIndex="-1"
    >
      <MuiContainer maxWidth="xl">
        <div className="hidden lg:block">
          <div className="header container mx-auto">
            <nav className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center">
                <Logo />
              </div>

              {/* Center Navigation */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center gap-4 transition-all ">
                  <ColourfulText
                    colors={[
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                    ]}
                    animationSpeed={3}
                    showBorder={true}
                    className="p-2 text-sm font-semibold"
                    onClick={onChangeStatus}
                  >
                    PROVIDER CENTRE
                  </ColourfulText>
                </div>
                <Link
                  href="/provider"
                  className="text-sm font-semibold text-white/70 hover:text-primary "
                >
                  PROVIDERS
                </Link>

                <Link
                  href="/products"
                  className="text-sm font-semibold text-white/70 hover:text-primary"
                >
                  SHOP
                </Link>
                <Link
                  href="/support"
                  className="text-sm font-semibold text-white/70 hover:text-primary "
                >
                  SUPPORT
                </Link>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <ThemeSwitch />
                <span>/</span>
                <CartBtn cartClick={() => router.push("/cart")} />
                <NotificationBtn
                  toggleDrawer={toggleDrawer}
                  isDrawerOpen={isDrawerOpen}
                />
                {user && (
                  <>
                    <UserMenu />
                  </>
                )}
                {!user && <RightWrapper />}
              </div>
            </nav>
          </div>
        </div>
      </MuiContainer>

      {/* Mobile Header */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <button className="text-white">
            <TfiMoreAlt size={20} />
          </button>
        </div>
      </div>

      {/* Notification Drawer */}
      <Notifcation isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </header>
  );
}

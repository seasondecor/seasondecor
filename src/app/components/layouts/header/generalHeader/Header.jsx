"use client";

import { useState, useEffect, useCallback } from "react";
import ThemeSwitch from "../../../ThemeSwitch";
import Logo from "../../../Logo";
import RightWrapper from "../RightWrapper";
import { useSession } from "next-auth/react";
import { UserMenu } from "../UserMenu";
import { CartBtn, NotificationBtn } from "../components/indexBtn";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";
import { scroller } from "react-scroll";
import Notifcation from "@/app/components/ui/notification/Notifcation";
import { notificationService } from "@/app/services/notificationService";
import { toast } from "sonner";
import { createMarkup } from "@/app/helpers";
import { Container as MuiContainer } from "@mui/material";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/app/components/ui/animated/ResizableNav";
import { Box } from "@mui/material";

export default function Header() {
  const { user } = useUser();
  const { data: session } = useSession();
  const mutationChangeStatus = useChangeStatus();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

   //console.log(session)

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
          <Box display="flex" alignItems="start" cursor="pointer">
            <div>
              <div className="font-semibold">{notification.title}</div>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={createMarkup(
                  notification.message || notification.content || ""
                )}
              />
            </div>
          </Box>,
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
    <header className="z-[60] fixed top-0 w-full transition-all" tabIndex="-1">
      <MuiContainer maxWidth="xl">
        {/* Desktop Navigation */}
        <Navbar className="hidden lg:block">
          <NavBody>
            {/* Logo Section */}
            <Logo />

            {/* Center Navigation */}
            <NavItems
              items={[
                {
                  name: "PROVIDER CENTRE",
                  onClick: onChangeStatus,
                  isSpecial: true,
                },
                { name: "PROVIDERS", onClick: () => router.push("/provider") },
                { name: "SHOP", onClick: () => router.push("/products") },
                { name: "SUPPORT", onClick: () => router.push("/support") },
              ]}
              className="!relative"
            />

            {/* Right Section */}
            <Box display="flex" alignItems="center" flexDirection="row" gap={2}>
              <ThemeSwitch />
              <CartBtn cartClick={() => router.push("/cart")} />
              <NotificationBtn
                toggleDrawer={toggleDrawer}
                isDrawerOpen={isDrawerOpen}
              />
              {user && <UserMenu />}
              {!user && <RightWrapper />}
            </Box>
          </NavBody>
        </Navbar>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <MobileNav>
            <MobileNavHeader>
              <Logo />
              <MobileNavToggle
                isOpen={isDrawerOpen}
                onClick={toggleDrawer(!isDrawerOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu isOpen={isDrawerOpen} onClose={toggleDrawer(false)}>
              <Box display="flex" flexDirection="column" width="100%" gap={2}>
                <Box
                  onClick={() => {
                    onChangeStatus();
                    toggleDrawer(false)();
                  }}
                >
                  PROVIDER CENTRE
                </Box>
                <Box
                  onClick={() => {
                    router.push("/provider");
                    toggleDrawer(false)();
                  }}
                >
                  PROVIDERS
                </Box>
                <Box
                  onClick={() => {
                    router.push("/products");
                    toggleDrawer(false)();
                  }}
                >
                  SHOP
                </Box>
                <Box
                  onClick={() => {
                    router.push("/support");
                    toggleDrawer(false)();
                  }}
                >
                  SUPPORT
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                  <ThemeSwitch />
                  <CartBtn
                    cartClick={() => {
                      router.push("/cart");
                      toggleDrawer(false)();
                    }}
                  />
                  <NotificationBtn
                    toggleDrawer={toggleDrawer}
                    isDrawerOpen={isDrawerOpen}
                  />
                </Box>
                {user && <UserMenu />}
                {!user && <RightWrapper />}
              </Box>
            </MobileNavMenu>
          </MobileNav>
        </div>
      </MuiContainer>

      {/* Notification Drawer */}
      <Notifcation isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </header>
  );
}

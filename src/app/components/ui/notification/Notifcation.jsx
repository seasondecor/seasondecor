import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { createMarkup } from "@/app/helpers";
import Typography from "@mui/material/Typography";
import { formatTimeAgo } from "@/app/helpers";
import {
  IoNotificationsSharp,
  IoCheckmarkDoneSharp,
  IoLogInOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoCardOutline,
} from "react-icons/io5";
import { useUser } from "@/app/providers/userprovider";
import { useGetNotifications } from "@/app/queries/list/notification.list.query";
import { notificationService } from "@/app/services/notificationService";
import {
  CircularProgress,
  Paper,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../Buttons/Button";

export default function Notifcation({ isOpen, toggleDrawer }) {
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading, refetch } = useGetNotifications();
  const [readingId, setReadingId] = React.useState(null);
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Initialize SignalR connection when component mounts and user is authenticated
  React.useEffect(() => {
    const initializeConnection = async () => {
      if (!user?.id || notificationService.isConnected()) return;

      try {
        setIsConnecting(true);
        await notificationService.startConnection(user.id);
      } catch (error) {
        // Connection error is handled internally in notificationService
      } finally {
        setIsConnecting(false);
      }
    };

    if (user?.id) {
      initializeConnection();
    }

    // Cleanup on unmount
    return () => {
      // Don't disconnect on component unmount as other components may need the connection
    };
  }, [user?.id]);

  React.useEffect(() => {
    if (!user?.id || !isOpen) return;

    // Make sure we have the latest notifications when drawer opens
    refetch();
  }, [isOpen, refetch, user?.id]);

  // Set up notification event listeners
  React.useEffect(() => {
    if (!user?.id) return;

    // Listen for notification read events
    const handleNotificationRead = (notificationId) => {
      // Only invalidate queries, don't make additional API calls
      queryClient.invalidateQueries(["notifications"], { exact: true });
    };

    // Listen for all notifications read events
    const handleAllNotificationsRead = () => {
      // Only invalidate queries, don't make additional API calls
      queryClient.invalidateQueries(["notifications"], { exact: true });
    };

    // Listen for new notifications to update the cache
    const handleNewNotification = () => {
      // Just refresh notifications list without showing toast (toast is handled in Header.jsx)
      queryClient.invalidateQueries(["notifications"], { exact: true });
    };

    // Register listeners
    notificationService.onNotificationReceived(handleNewNotification);
    notificationService.onNotificationRead(handleNotificationRead);
    notificationService.onNotificationsUpdated(handleAllNotificationsRead);

    // Cleanup listeners
    return () => {
      notificationService.offNotificationReceived(handleNewNotification);
      notificationService.offNotificationRead(handleNotificationRead);
      notificationService.offNotificationsUpdated(handleAllNotificationsRead);
    };
  }, [user?.id, queryClient]);

  const ensureConnection = async () => {
    if (!user?.id) return false;

    if (!notificationService.isConnected()) {
      try {
        setIsConnecting(true);
        await notificationService.startConnection(user.id);
        setIsConnecting(false);
        return true;
      } catch (error) {
        console.error("Failed to establish SignalR connection:", error);
        setIsConnecting(false);
        return false;
      }
    }

    return true;
  };

  const markAsRead = async (notificationId) => {
    try {
      if (!user?.id) return; // Skip if not logged in

      // Prevent duplicate calls if already marking this notification as read
      if (readingId === notificationId) return;

      setReadingId(notificationId);

      // Ensure connection before attempting to use SignalR
      const isConnected = await ensureConnection();

      if (isConnected) {
        // Use the new SignalR method to mark as read
        await notificationService.markAsRead(notificationId);

        // Let the SignalR event handlers update the cache
        // No need to invalidate queries here
      } else {
        // Fallback to REST API if SignalR connection failed
        await notificationService.markNotificationAsRead(notificationId);

        // Only if using REST API directly, invalidate queries
        queryClient.invalidateQueries(["notifications"], { exact: true });
      }

      setReadingId(null);
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Fallback to REST API if SignalR failed
      try {
        await notificationService.markNotificationAsRead(notificationId);
        queryClient.invalidateQueries(["notifications"], { exact: true });
      } catch (fallbackError) {
        console.error("Fallback REST API also failed:", fallbackError);
      }

      setReadingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user?.id) return; // Skip if not logged in

      // Prevent duplicate calls if already marking all as read
      if (readingId === "all") return;

      setReadingId("all");

      // Ensure connection before attempting to use SignalR
      const isConnected = await ensureConnection();

      if (isConnected) {
        // Use the new SignalR method to mark all as read
        await notificationService.markAllAsRead();

        // Let the SignalR event handlers update the cache
        // No need to invalidate queries here
      } else {
        // Fallback to REST API if SignalR connection failed
        await notificationService.markAllNotificationsAsRead();

        // Only if using REST API directly, invalidate queries
        queryClient.invalidateQueries(["notifications"], { exact: true });
      }

      setReadingId(null);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);

      // Fallback to REST API if SignalR failed
      try {
        await notificationService.markAllNotificationsAsRead();
        queryClient.invalidateQueries(["notifications"], { exact: true });
      } catch (fallbackError) {
        console.error("Fallback REST API also failed:", fallbackError);
      }

      setReadingId(null);
    }
  };

  const handleNotificationClick = (notification) => {
    // Skip if not logged in
    if (!user?.id) {
      router.push("/authen/login");
      toggleDrawer(false)();
      return;
    }

    // Skip if already read
    if (notification.isRead) {
      return;
    }

    // Mark as read
    markAsRead(notification.id);
  };

  // Function to handle Link component click
  const handleLinkClick = (e, notification) => {
    // Skip if already read
    if (notification.isRead) {
      return;
    }

    // Mark notification as read when clicking on a link
    markAsRead(notification.id);
  };

  // Function to get appropriate icon for notification based on content
  const getNotificationIcon = (notification) => {
    if (notification.title.includes("Approved")) {
      return <IoCheckmarkCircleOutline className="text-green" size={24} />;
    } else if (notification.title.includes("Rejected")) {
      return <IoCloseCircleOutline className="text-red" size={24} />;
    } else if (notification.title.includes("Payment")) {
      return <IoCardOutline className="text-purple" size={24} />;
    } else if (notification.title.includes("Submitted")) {
      return <IoWarningOutline className="text-yellow" size={24} />;
    } else {
      return <IoNotificationsSharp className="text-blue" size={24} />;
    }
  };

  // Login prompt for guest users - updated with nicer styling
  const guestContent = (
    <Box sx={{ width: 550 }} role="presentation">
      <Box className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <Typography
          variant="h6"
          className="font-semibold text-indigo-700 dark:text-indigo-300"
        >
          Notifications
        </Typography>
      </Box>

      <Box className="flex flex-col justify-center items-center p-10 text-center h-[400px] space-y-5 bg-white dark:bg-gray-900">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <IoNotificationsSharp
            size={70}
            className="text-blue-400 dark:text-blue-300"
          />
        </div>
        <Typography
          variant="h5"
          component="div"
          className="text-gray-700 dark:text-gray-200 font-medium"
        >
          Stay Updated
        </Typography>
        <Typography
          variant="body1"
          component="div"
          className="text-gray-500 dark:text-gray-400 max-w-xs"
        >
          Please log in to view your notifications and stay informed about your
          account activities
        </Typography>
        <Button
          icon={<IoLogInOutline />}
          label="Log In"
          onClick={() => {
            router.push("/authen/login");
            toggleDrawer(false)();
          }}
          className="mt-8 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all"
        />
      </Box>
    </Box>
  );

  // Function to render the notification content that will be used in both Link and ListItemButton
  const renderNotificationContent = (notification) => (
    <div className="flex items-start w-full gap-3">
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification)}
      </div>
      <div className="flex-grow min-w-0">
        <Typography
          variant="body1"
          component="div"
          className={`${
            notification.isRead
              ? "font-normal text-gray-700"
              : "font-semibold text-gray-900"
          } mb-1.5 dark:text-gray-100 line-clamp-2`}
        >
          {notification.title}
        </Typography>

        <div
          className={`${
            notification.isRead ? "text-gray-500" : "text-gray-600"
          } dark:text-gray-300 text-sm mb-2 line-clamp-2 break-words`}
          dangerouslySetInnerHTML={createMarkup(notification.content)}
        />

        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
          <IoTimeOutline className="mr-1" size={14} />
          {formatTimeAgo(notification.notifiedAt)}
        </div>
      </div>

      {!notification.isRead && (
        <div className="ml-2 flex-shrink-0 pt-2">
          {readingId === notification.id ? (
            <CircularProgress size={8} className="text-primary" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          )}
        </div>
      )}
    </div>
  );

  const notificationsList = (
    <Box sx={{ width: 550 }} role="presentation" className="dark:bg-gray-800">
      <Paper
        elevation={2}
        className="sticky top-0 z-10 bg-transparent dark:bg-gray-800"
      >
        <Box className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Typography
            variant="h6"
            className="font-semibold flex items-center gap-3"
          >
            <Badge
              badgeContent={notifications?.filter((n) => !n.isRead).length || 0}
              color="primary"
            >
              <IoNotificationsSharp size={22} />
            </Badge>
            Notifications
            {isConnecting && (
              <CircularProgress size={16} className="text-primary" />
            )}
          </Typography>
          {notifications?.length > 0 && (
            <Tooltip title="Mark all as read">
              <Button
                label="Mark all as read"
                onClick={markAllAsRead}
                disabled={readingId === "all" || isConnecting}
                className="text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1.5"
                icon={
                  readingId === "all" ? (
                    <CircularProgress size={14} className="text-primary" />
                  ) : (
                    <IoCheckmarkDoneSharp size={16} />
                  )
                }
              />
            </Tooltip>
          )}
        </Box>
      </Paper>

      {isLoading || isConnecting ? (
        <Box className="flex flex-col justify-center items-center p-8 min-h-[200px]">
          <CircularProgress size={32} className="text-primary mb-3" />
          <Typography
            variant="body2"
            className="text-gray-500 dark:text-gray-400"
          >
            Loading notifications...
          </Typography>
        </Box>
      ) : notifications?.length > 0 ? (
        <List
          sx={{ pt: 0 }}
          className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
        >
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              disablePadding
              component="div"
              className={
                notification.isRead
                  ? "bg-white dark:bg-gray-800"
                  : "bg-white dark:bg-gray-800"
              }
            >
              {notification.url ? (
                <div
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    if (!notification.isRead) {
                      handleLinkClick(e, notification);
                    }
                    toggleDrawer(false)();
                    setTimeout(() => {
                      router.push(notification.url);
                    }, 100);
                  }}
                >
                  <ListItemButton className="transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 py-4 px-4 w-full">
                    {renderNotificationContent(notification)}
                  </ListItemButton>
                </div>
              ) : (
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  className="transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 py-4 px-4"
                >
                  {renderNotificationContent(notification)}
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Box className="flex flex-col justify-center items-center p-12 text-center min-h-[400px]">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full mb-6">
            <IoNotificationsSharp
              size={70}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <Typography
            variant="h5"
            component="div"
            className="text-gray-700 dark:text-gray-200 font-medium mb-2"
          >
            No notifications yet
          </Typography>
          <Typography
            variant="body2"
            component="div"
            className="text-gray-500 dark:text-gray-400 max-w-xs"
          >
            We'll notify you when something important happens
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleDrawer(false)}
      slotProps={{
        paper: {
          sx: {
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            borderRadius: { xs: "0", sm: "16px 0 0 16px" },
            backgroundColor: "white",
          },
        },
      }}
    >
      {!user ? guestContent : notificationsList}
    </Drawer>
  );
}

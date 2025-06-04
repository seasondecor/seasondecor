"use client";

import React, { useState } from "react";
import SellerWrapper from "../components/SellerWrapper";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FootTypo } from "@/app/components/ui/Typography";
import {
  MdDashboard,
  MdOutlineInventory2,
  MdOutlineAnalytics,
} from "react-icons/md";
import {
  useGetProviderDashboard,
  useGetMonthlyRevenue,
  useGeTopCustomerSpending,
} from "@/app/queries/dashboard/dashboard.provider.query";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/app/helpers";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Skeleton } from "@mui/material";
import { CiClock1 } from "react-icons/ci";
import CountUp from "@/app/components/ui/animated/CountUp";
import EmptyState from "@/app/components/EmptyState";
import DataMapper from "@/app/components/DataMapper";
import { useGetSupportTicketForProvider } from "@/app/queries/support/support.query";
import TicketCard from "@/app/components/ui/card/TicketCard";
import {
  useReplyTicket,
  useMarkAsSolved,
} from "@/app/queries/support/support.query";
import { formatDateTime } from "@/app/helpers";
import { TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { renderAttachment } from "@/app/helpers";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Button from "@/app/components/ui/Buttons/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Box } from "@mui/material";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  People,
  BookOnline,
  CheckCircle,
  ArrowUpward,
  ArrowDownward,
  MonetizationOn,
  ShoppingCart,
  Assignment,
} from "@mui/icons-material";

// Register ChartJS components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({
  title,
  value,
  icon,
  color,
  isLoading,
  trend,
  subtitle,
}) => (
  <Card
    sx={{
      height: "100%",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
    }}
    className="dark:text-white"
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className="dark:text-white"
          >
            {title}
          </Typography>
          {isLoading ? (
            <Skeleton width={100} height={40} />
          ) : (
            <Typography variant="h4" sx={{ mt: 1 }}>
              <CountUp to={value} duration={1} separator="." />
            </Typography>
          )}
        </Box>
        <IconButton sx={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </IconButton>
      </Box>
      {trend !== undefined && (
        <Box display="flex" alignItems="center" mt={2}>
          {trend > 0 ? (
            <ArrowUpward sx={{ color: "success.main", fontSize: 16 }} />
          ) : (
            <ArrowDownward sx={{ color: "error.main", fontSize: 16 }} />
          )}
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {Math.abs(trend)}% from last week
          </Typography>
        </Box>
      )}
      {subtitle && (
        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          mt={1}
          className="dark:text-white"
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children, height = 400 }) => (
  <Card
    sx={{
      height: "100%",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
    }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom className="dark:text-white">
        {title}
      </Typography>
      <Box height={height}>{children}</Box>
    </CardContent>
  </Card>
);

const AnalyticsCard = ({ title, value, icon, color }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" >
    <Box display="flex" alignItems="center" gap={1} >
      <IconButton size="small" sx={{ color: color }}>
        {icon}
      </IconButton>
      <Typography variant="body1">{title}</Typography>
    </Box>
    <Typography variant="h6" sx={{ color: color }}>
      <CountUp to={value || 0} duration={1} />
    </Typography>
  </Box>
);

const SellerDashboard = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyImages, setReplyImages] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data: providerDashboard, isLoading: isProviderDashboardLoading } =
    useGetProviderDashboard();
  const { data: monthlyRevenue, isLoading: isMonthlyRevenueLoading } =
    useGetMonthlyRevenue();
  const { data: topCustomerSpending, isLoading: isTopCustomerSpendingLoading } =
    useGeTopCustomerSpending();
  const { data: supportTickets, isLoading: isSupportTicketsLoading } =
    useGetSupportTicketForProvider();

  const { mutate: replyTicket, isLoading: isReplyTicketLoading } =
    useReplyTicket();

  const { mutate: markAsSolved, isLoading: isMarkAsSolvedLoading } =
    useMarkAsSolved();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to calculate percentage growth
  const calculateGrowth = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0) {
      return currentValue > 0 ? 100 : 0; // If previous was 0, and current has value, it's 100% growth
    }

    const difference = currentValue - previousValue;
    const percentageChange = (difference / previousValue) * 100;

    return Math.round(percentageChange);
  };

  // Growth indicators for different metrics

  const revenueGrowth = calculateGrowth(
    providerDashboard?.thisWeekTotalRevenue || 0,
    providerDashboard?.lastWeekTotalRevenue || 0
  );

  const orderGrowth = calculateGrowth(
    providerDashboard?.thisWeekOrders || 0,
    providerDashboard?.lastWeekOrders || 0
  );

  const bookingGrowth = calculateGrowth(
    providerDashboard?.thisWeekBookings || 0,
    providerDashboard?.lastWeekBookings || 0
  );

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue in 2025",
        color: isDark ? "#fff" : "#666",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return formatCurrency(context.raw);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "#374151" : "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          callback: function (value) {
            return formatCurrency(value);
          },
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Prepare chart data
  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: Array(12)
          .fill(0)
          .map((_, index) => {
            const monthData = monthlyRevenue?.find(
              (item) => item.month === index + 1
            );
            return monthData?.totalRevenue || 0;
          }),
        backgroundColor: isDark
          ? "rgba(0, 216, 255, 0.5)"
          : "rgba(0, 216, 255, 0.8)",
        hoverBackgroundColor: "#00d8ff",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "#00d8ff",
      },
    ],
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setShowReplyForm(false);
  };

  const handleCloseTicketDetails = () => {
    setSelectedTicket(null);
    setShowReplyForm(false);
  };

  const handleImageChange = (files) => {
    setReplyImages(files);
  };

  const toggleReplyForm = () => {
    setShowReplyForm((prev) => !prev);
    if (!showReplyForm) {
      setReplyMessage("");
      setReplyImages([]);
    }
  };

  const handleSubmitReply = () => {
    if (!replyMessage.trim() || !selectedTicket?.id) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("Description", replyMessage);
      formData.append("TicketId", selectedTicket.id);

      // Add images to formData if any
      if (replyImages && replyImages.length > 0) {
        replyImages.forEach((file, index) => {
          formData.append(`Attachments`, file);
        });
      }

      replyTicket(formData, {
        onSuccess: () => {
          setReplyMessage("");
          setReplyImages([]);
          setShowReplyForm(false);

          // Manually update the UI with the new reply while we wait for the refetch
          const now = new Date();
          const newReply = {
            description: replyMessage,
            createdAt: now.toISOString(),
            attachmentUrls:
              replyImages.length > 0
                ? replyImages.map((file) => URL.createObjectURL(file))
                : [],
          };

          // Create a new ticket object with the reply appended
          const updatedTicket = {
            ...selectedTicket,
            replies: [...(selectedTicket.replies || []), newReply],
          };

          // Update the selected ticket
          setSelectedTicket(updatedTicket);
        },
      });
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SellerWrapper>
      <Box className="w-full px-2 py-4 sm:px-0">
        <TabGroup>
          <TabList className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdDashboard size={20} />
                <FootTypo footlabel="Overview" />
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdOutlineInventory2 size={20} />
                <FootTypo footlabel="Analytics" />
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ease-in-out
              ${
                selected
                  ? "bg-white dark:bg-gray-900 text-primary shadow"
                  : "hover:bg-white/[0.12] hover:text-primary"
              }`
              }
            >
              <div className="flex items-center justify-center gap-2">
                <MdOutlineAnalytics size={20} />
                <FootTypo footlabel="Reports" />
              </div>
            </Tab>
          </TabList>
          <TabPanels className="mt-5 font-semibold relative">
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <StatCard
                    title="Total Revenue"
                    value={providerDashboard?.totalRevenue}
                    icon={<MonetizationOn />}
                    color="#00d8ff"
                    isLoading={isProviderDashboardLoading}
                    trend={revenueGrowth}
                    subtitle={`+${formatCurrency(
                      providerDashboard?.thisWeekTotalRevenue || 0
                    )} this week`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <StatCard
                    title="Subscriptions"
                    value={providerDashboard?.totalFollowers}
                    icon={<People />}
                    color="#3f51b5"
                    isLoading={isProviderDashboardLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <StatCard
                    title="Bookings"
                    value={providerDashboard?.totalBookings}
                    icon={<BookOnline />}
                    color="#4caf50"
                    isLoading={isProviderDashboardLoading}
                    trend={bookingGrowth}
                    subtitle={`+${
                      providerDashboard?.thisWeekBookings || 0
                    } this week`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <StatCard
                    title="Orders"
                    value={providerDashboard?.totalOrders}
                    icon={<ShoppingCart />}
                    color="#ff9800"
                    isLoading={isProviderDashboardLoading}
                    trend={orderGrowth}
                    subtitle={`+${
                      providerDashboard?.thisWeekOrders || 0
                    } this week`}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <ChartCard title="Revenue Analysis">
                    {!isMonthlyRevenueLoading && (
                      <Bar options={options} data={chartData} />
                    )}
                  </ChartCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom className="dark:text-white">
                        Top Contributing Users
                      </Typography>
                      <Box className="space-y-4 dark:text-white">
                    {topCustomerSpending?.map((item, index) => (
                          <Box
                            key={item.customerId}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography
                                variant="h4"
                                sx={{ color: "#ffd700", width: 40 }}
                              >
                            {index + 1}
                              </Typography>
                            <Avatar userImg={item.avatar} w={36} h={36} />
                              <Box>
                                <Typography variant="subtitle2">
                                  {item.fullName}
                                </Typography>
                                <Typography variant="caption">
                                  {item.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="subtitle1" color="primary">
                              {formatCurrency(item.totalSpending)}
                            </Typography>
                          </Box>
                        ))}
                        {isTopCustomerSpendingLoading &&
                          [...Array(5)].map((_, i) => (
                            <Box
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <Box className="flex items-center gap-3">
                                <Skeleton variant="text" width={40} />
                              <Skeleton
                                variant="circular"
                                width={36}
                                height={36}
                              />
                                <Box>
                                  <Skeleton variant="text" width={120} />
                                  <Skeleton variant="text" width={80} />
                                </Box>
                              </Box>
                              <Skeleton variant="text" width={80} />
                            </Box>
                          ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Detail Analytics
                    </Typography>
                    <Box className="space-y-4 dark:text-white">
                      <AnalyticsCard
                        title="Total Services"
                        value={providerDashboard?.totalServices}
                        icon={<Assignment />}
                        color="#00d8ff"
                      />
                      <AnalyticsCard
                        title="On Going Services"
                        value={providerDashboard?.processingBookings}
                        icon={<CiClock1 />}
                        color="#ffd700"
                      />
                      <AnalyticsCard
                        title="Services Available"
                        value={providerDashboard?.completedBookings}
                        icon={<CheckCircle />}
                        color="#4caf50"
                      />
                      <AnalyticsCard
                        title="Total Products"
                        value={providerDashboard?.totalProducts}
                        icon={<ShoppingCart />}
                        color="#9c27b0"
                      />
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Weekly Booking Comparison
                    </Typography>
                    <div className="h-[300px]">
                      <Line
                        data={{
                          labels: ["Last Week", "This Week"],
                          datasets: [
                            {
                              label: "Bookings",
                              data: [
                                providerDashboard?.lastWeekBookings || 0,
                                providerDashboard?.thisWeekBookings || 0
                              ],
                              borderColor: "rgb(75, 192, 192)",
                              backgroundColor: "rgba(75, 192, 192, 0.1)",
                              borderWidth: 2,
                              fill: true,
                              tension: 0.4,
                              pointBackgroundColor: "rgb(75, 192, 192)",
                              pointBorderColor: "#fff",
                              pointBorderWidth: 2,
                              pointRadius: 6,
                              pointHoverRadius: 8,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                              labels: {
                                color: isDark ? "#fff" : "#666",
                                font: {
                                  size: 12,
                                },
                              },
                            },
                            title: {
                              display: true,
                              text: `Booking Growth: ${bookingGrowth > 0 ? '+' : ''}${bookingGrowth}%`,
                              color: isDark ? "#fff" : "#666",
                              font: {
                                size: 14,
                                weight: "bold",
                              },
                            },
                            tooltip: {
                              backgroundColor: isDark ? "#374151" : "#fff",
                              titleColor: isDark ? "#fff" : "#000",
                              bodyColor: isDark ? "#fff" : "#000",
                              borderColor: isDark ? "#4B5563" : "#E5E7EB",
                              borderWidth: 1,
                              displayColors: false,
                              callbacks: {
                                label: function(context) {
                                  return `Bookings: ${context.raw}`;
                                }
                              }
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: isDark ? "#374151" : "#f0f0f0",
                                drawBorder: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: isDark ? "#9CA3AF" : "#666",
                                font: {
                                  size: 11,
                                },
                              },
                              border: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Top Services
                    </Typography>
                    <Box className="space-y-4 dark:text-white">
                      {providerDashboard?.topServices?.map((item, index) => (
                        <Box
                          key={item.serviceId}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="h4"
                              sx={{ color: "#ffd700", width: 40 }}
                            >
                              {index + 1}
                            </Typography>
                            <Typography variant="body1">
                              {item.style}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" color="primary">
                            {item.favoriteCount} liked
                          </Typography>
                        </Box>
                      ))}
                      {!providerDashboard?.topServices?.length && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          textAlign="center"
                        >
                          No top services data available
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Best Selling Products
                    </Typography>
                    <Box className="space-y-4 dark:text-white">
                      {providerDashboard?.topProducts?.map((item, index) => (
                        <Box
                          key={item.productId}
                          className="flex items-center justify-between"
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="h4"
                              sx={{ color: "#ffd700", width: 40 }}
                            >
                              {index + 1}
                            </Typography>
                            <Typography variant="body1">
                              {item.productName}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" color="primary">
                            {item.soldQuantity} sold
                          </Typography>
                        </Box>
                      ))}
                      {!providerDashboard?.topProducts?.length && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          textAlign="center"
                        >
                          No top products data available
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Booking Analytics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Completed
                          </Typography>
                          <Typography variant="h4" color="success.main">
                          <CountUp
                            to={providerDashboard?.completedBookings || 0}
                              duration={1}
                              separator="."
                            />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Pending
                          </Typography>
                          <Typography variant="h4" sx={{ color: "#ffd700" }}>
                          <CountUp
                            to={providerDashboard?.pendingBookings || 0}
                              duration={1}
                              separator="."
                            />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Cancelled
                          </Typography>
                          <Typography variant="h4" color="error.main">
                          <CountUp
                            to={providerDashboard?.canceledBookings || 0}
                              duration={1}
                              separator="."
                            />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Total
                          </Typography>
                          <Typography variant="h4" color="primary">
                          <CountUp
                            to={providerDashboard?.totalBookings || 0}
                              duration={1}
                              separator="."
                            />
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      
                    }}
                  >
                    <Typography variant="h6" gutterBottom className="dark:text-white">
                      Revenue Breakdown
                    </Typography>
                    <Box className="space-y-4 dark:text-white">
                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="subtitle2">This Week</Typography>
                          <Typography variant="h6">
                            {formatCurrency(
                              providerDashboard?.thisWeekTotalRevenue || 0
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            bgcolor: "grey",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(
                                100,
                                (providerDashboard?.thisWeekTotalRevenue /
                                  providerDashboard?.totalRevenue) *
                                  100 || 0
                              )}%`,
                              height: 8,
                              background:
                                "linear-gradient(90deg, #00d8ff 0%, #00ff88 100%)",
                            }}
                          />
                        </Box>
                      </Box>

                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="subtitle2">Last Week</Typography>
                          <Typography variant="h6">
                            {formatCurrency(
                              providerDashboard?.lastWeekTotalRevenue || 0
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            bgcolor: "grey",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(
                                100,
                                (providerDashboard?.lastWeekTotalRevenue /
                                  providerDashboard?.totalRevenue) *
                                  100 || 0
                              )}%`,
                              height: 8,
                              background:
                                "linear-gradient(90deg, #ffd700 0%, #ff9800 100%)",
                            }}
                          />
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Typography variant="subtitle2">Growth Rate</Typography>
                        <Typography
                          variant="h6"
                          color={
                            providerDashboard?.thisWeekTotalRevenue >
                            providerDashboard?.lastWeekTotalRevenue
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {providerDashboard?.thisWeekTotalRevenue >
                          providerDashboard?.lastWeekTotalRevenue
                            ? "+"
                            : ""}
                          {(
                            (((providerDashboard?.thisWeekTotalRevenue || 0) -
                              (providerDashboard?.lastWeekTotalRevenue || 0)) /
                              (providerDashboard?.lastWeekTotalRevenue || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel className="bg-transparent space-y-5 animate-tab-fade-in">
              <div className="w-full">
                <FootTypo footlabel="All Tickets" />
                <div className="mt-4">
                  <DataMapper
                    data={supportTickets?.data || []}
                    Component={TicketCard}
                    emptyStateComponent={
                      <EmptyState title="No tickets found" />
                    }
                    loading={isSupportTicketsLoading}
                    getKey={(item) => item.id}
                    componentProps={(ticket) => {
                      const { date, time } = formatDateTime(ticket.createAt);

                      return {
                        id: ticket.id,
                        date: date,
                        time: time,
                        status: ticket.isSolved,
                        subject: ticket.subject,
                        reportedBy: ticket.customerName,
                        onClick: () => handleTicketSelect(ticket),
                      };
                    }}
                  />
                </div>
              </div>

              {/* Ticket Details Dialog */}
              <Dialog 
                open={!!selectedTicket} 
                onClose={handleCloseTicketDetails}
                maxWidth="md"
                fullWidth
              >
                {selectedTicket && (
                  <>
                    <DialogTitle>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <FootTypo
                            footlabel={`Ticket #${selectedTicket.id}`}
                            fontWeight="bold"
                            fontSize="24px"
                          />
                          <FootTypo
                            footlabel={`Subject: ${
                              selectedTicket.subject || "No subject"
                            }`}
                            fontWeight="bold"
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={handleCloseTicketDetails}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </DialogTitle>

                    <DialogContent dividers>
                      <Box className="space-y-4">
                        <Box>
                          <FootTypo
                            footlabel="Description"
                            fontWeight="bold"
                            mb={1}
                          />
                          <Box className="border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                            <FootTypo
                              footlabel={
                                selectedTicket.description ||
                                "No description provided"
                              }
                            />
                          </Box>
                        </Box>

                        <Box className="flex justify-between text-sm text-gray-500">
                          <span>
                            Created:{" "}
                            {formatDateTime(selectedTicket.createAt).date} at{" "}
                            {formatDateTime(selectedTicket.createAt).time}
                          </span>
                          {selectedTicket.bookingCode && (
                            <span>Booking: {selectedTicket.bookingCode}</span>
                          )}
                        </Box>

                        {selectedTicket.attachmentUrls &&
                          selectedTicket.attachmentUrls.length > 0 && (
                          <Box>
                              <FootTypo
                                footlabel="Attachments"
                                fontWeight="bold"
                                mb={1}
                              />
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                {selectedTicket.attachmentUrls.map(
                                  (url, index) => (
                                    <div key={index}>
                                      {renderAttachment(url)}
                                    </div>
                                  )
                                )}
                            </Box>
                          </Box>
                        )}

                        {selectedTicket.replies &&
                          selectedTicket.replies.length > 0 && (
                          <Box>
                              <FootTypo
                                footlabel="Your Replies"
                                fontWeight="bold"
                                mb={1}
                              />
                            <Box className="space-y-3">
                              {selectedTicket.replies.map((reply, index) => (
                                <Box
                                  key={index}
                                  className="p-3 rounded-md bg-gray-100 dark:bg-gray-700"
                                >
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      mb={1}
                                    >
                                    <FootTypo
                                      footlabel={
                                        formatDateTime(reply.createAt).date +
                                        " at " +
                                        formatDateTime(reply.createAt).time
                                      }
                                    />
                                  </Box>
                                  <FootTypo footlabel={reply.description} />

                                    {reply.attachmentUrls &&
                                      reply.attachmentUrls.length > 0 && (
                                    <Box mt={2}>
                                          <FootTypo footlabel="Attachments:" />
                                          <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={2}
                                          >
                                            {reply.attachmentUrls.map(
                                              (url, idx) => (
                                                <div key={idx}>
                                                  {renderAttachment(url)}
                                                </div>
                                              )
                                            )}
                                      </Box>
                                    </Box>
                                  )}

                                    {reply.attachmentUrlIs &&
                                      reply.attachmentUrlIs.length > 0 && (
                                    <Box mt={2}>
                                      <FootTypo footlabel="Attachments:" />
                                          <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={2}
                                          >
                                            {reply.attachmentUrlIs.map(
                                              (item, idx) => (
                                          <div key={idx}>
                                                  {item.url &&
                                                    renderAttachment(item.url)}
                                          </div>
                                              )
                                            )}
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </DialogContent>

                    {!selectedTicket.isSolved && (
                      <DialogActions
                        sx={{
                          p: 2.5,
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {showReplyForm ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                            width="100%"
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <FootTypo
                                footlabel="Reply to Customer"
                                fontWeight="bold"
                              />
                              <Button
                                label="Cancel"
                                onClick={toggleReplyForm}
                              />
                            </Box>

                            <TextField
                              fullWidth
                              placeholder="Type your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              multiline
                              rows={3}
                              variant="outlined"
                              size="small"
                              className="dark:bg-white"
                            />

                            <Box mb={2}>
                              <FootTypo footlabel="Attachments (optional)" />
                              <ImageUpload onImageChange={handleImageChange} />
                            </Box>

                            <Box
                              display="flex"
                              justifyContent="flex-end"
                              gap={1}
                            >
                              <Button
                                label={
                                  isSubmitting ? "Sending..." : "Send Reply"
                                }
                                className="bg-action text-white"
                                onClick={handleSubmitReply}
                                isLoading={isSubmitting}
                                disabled={isSubmitting || !replyMessage.trim()}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box display="flex" gap={1}>
                            <Button
                              label="Reply to Customer"
                              className="bg-action text-white"
                              onClick={toggleReplyForm}
                            />
                            <Button
                              label="Mark as Solved"
                              onClick={() => markAsSolved(selectedTicket.id)}
                              isLoading={isMarkAsSolvedLoading}
                            />
                          </Box>
                        )}
                      </DialogActions>
                    )}
                  </>
                )}
              </Dialog>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Box>
    </SellerWrapper>
  );
};

export default SellerDashboard;

"use client";

import React, { useMemo } from "react";
import AdminWrapper from "../components/AdminWrapper";
import {
  useGetAdminDashboard,
  useGetAdminMonthlyRevenue,
  useGetTopProviderRating,
} from "@/app/queries/dashboard/dashboard.admin.query";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/app/helpers";
import CountUp from "@/app/components/ui/animated/CountUp";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  TrendingUp,
  People,
  BookOnline,
  CheckCircle,
  Cancel,
  AccountBalance,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color, isLoading, trend }) => (
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
          <Typography variant="subtitle2" className="dark:text-white">
            {title}
          </Typography>
          {isLoading ? (
            <Skeleton width={100} height={40} />
          ) : (
            <Typography variant="h4" sx={{ mt: 1}}>
              <CountUp to={value} duration={1} separator="." />
            </Typography>
          )}
        </Box>
        <IconButton sx={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </IconButton>
      </Box>
      {trend && (
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

const AdminDashboard = () => {
  const { data: adminDashboard, isLoading: isLoadingAdminDashboard } =
    useGetAdminDashboard();
  const { data: adminMonthlyRevenue, isLoading: isLoadingAdminMonthlyRevenue } =
    useGetAdminMonthlyRevenue();
  const { data: topProviderRating, isLoading: isLoadingTopProviderRating } =
    useGetTopProviderRating();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get the total revenue from all months
  const totalRevenue = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) return 0;
    return adminMonthlyRevenue.reduce(
      (sum, month) => sum + (month.totalRevenue || 0),
      0
    );
  }, [adminMonthlyRevenue]);

  // Month names for the chart
  const monthNames = [
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
  ];

  // Prepare chart data from the monthly revenue
  const chartData = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) {
      return {
        labels: monthNames,
        datasets: [
          {
            label: "Monthly Revenue",
            data: Array(12).fill(0),
            backgroundColor: isDark
              ? "rgba(0, 216, 255, 0.5)"
              : "rgba(0, 216, 255, 0.8)",
            borderColor: "#00d8ff",
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: "#00d8ff",
          },
        ],
      };
    }

    // Create an array of 12 zeros (for 12 months)
    const monthlyData = Array(12).fill(0);

    // Fill in the data for months that have revenue
    adminMonthlyRevenue.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        monthlyData[item.month - 1] = item.totalRevenue || 0;
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Monthly Revenue",
          data: monthlyData,
          backgroundColor: isDark
            ? "rgba(0, 216, 255, 0.5)"
            : "rgba(0, 216, 255, 0.8)",
          borderColor: "#00d8ff",
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: "#00d8ff",
        },
      ],
    };
  }, [adminMonthlyRevenue, isDark]);

  // Line chart data for trend analysis
  const lineChartData = useMemo(() => {
    if (!adminMonthlyRevenue || !Array.isArray(adminMonthlyRevenue)) {
      return {
        labels: monthNames,
        datasets: [
          {
            label: "Revenue Trend",
            data: Array(12).fill(0),
            borderColor: "#00d8ff",
            backgroundColor: "rgba(0, 216, 255, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#00d8ff",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#00d8ff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    // Create an array of 12 zeros (for 12 months)
    const monthlyData = Array(12).fill(0);

    // Fill in the data for months that have revenue
    adminMonthlyRevenue.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        monthlyData[item.month - 1] = item.totalRevenue || 0;
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Revenue Trend",
          data: monthlyData,
          borderColor: "#00d8ff",
          backgroundColor: "rgba(0, 216, 255, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#00d8ff",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#00d8ff",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [adminMonthlyRevenue, isDark]);

  // Pie chart data for customers vs providers
  const pieChartData = useMemo(() => {
    const totalCustomers = adminDashboard?.totalCustomers || 0;
    const totalProviders = adminDashboard?.totalProviders || 0;

    return {
      labels: ["Customers", "Providers"],
      datasets: [
        {
          data: [totalCustomers, totalProviders],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  }, [adminDashboard]);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDark ? "#fff" : "#666",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Monthly Revenue in 2025",
        color: isDark ? "#fff" : "#666",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 20 },
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
            return formatNumber(context.raw) + " ₫";
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
            return formatNumber(value) + " ₫";
          },
          font: { size: 12 },
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          font: { size: 12 },
        },
        border: { display: false },
      },
    },
  };

  const lineChartOptions = {
    ...barChartOptions,
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDark ? "#fff" : "#666",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "All Users",
        color: isDark ? "#fff" : "#666",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Find the highest revenue month
  const highestRevenueMonth = useMemo(() => {
    if (
      !adminMonthlyRevenue ||
      !Array.isArray(adminMonthlyRevenue) ||
      adminMonthlyRevenue.length === 0
    ) {
      return { month: 0, totalRevenue: 0 };
    }

    return adminMonthlyRevenue.reduce(
      (highest, current) => {
        return current.totalRevenue > highest.totalRevenue ? current : highest;
      },
      { month: 0, totalRevenue: 0 }
    );
  }, [adminMonthlyRevenue]);

  // Add this function to format numbers with dot separators
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <AdminWrapper>
      <Box sx={{ overflowX: "hidden"}}>
        <Grid container spacing={3}>
          {/* Revenue Stats */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Total Revenue"
              value={totalRevenue}
              icon={<AccountBalance />}
              color="#00d8ff"
              isLoading={isLoadingAdminMonthlyRevenue}
              trend={5.2}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Total Accounts"
              value={adminDashboard?.totalAccounts || 0}
              icon={<People />}
              color="#3f51b5"
              isLoading={isLoadingAdminDashboard}
              trend={2.4}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Total Bookings"
              value={adminDashboard?.totalBookings || 0}
              icon={<BookOnline />}
              color="#4caf50"
              isLoading={isLoadingAdminDashboard}
              trend={-1.5}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <StatCard
              title="Completed Bookings"
              value={adminDashboard?.completedBookings || 0}
              icon={<CheckCircle />}
              color="#ff9800"
              isLoading={isLoadingAdminDashboard}
              trend={3.8}
            />
          </Grid>

          {/* Charts */}
          <Grid size={{ xs: 12, md: 8 }}>
            <ChartCard title="Revenue Analysis">
              {!isLoadingAdminMonthlyRevenue && (
                <Bar options={barChartOptions} data={chartData} />
              )}
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard title="User Distribution" height={300}>
              {!isLoadingAdminDashboard && (
                <Pie options={pieChartOptions} data={pieChartData} />
              )}
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <ChartCard title="Revenue Trend" height={250}>
              {!isLoadingAdminMonthlyRevenue && (
                <Line options={lineChartOptions} data={lineChartData} />
              )}
            </ChartCard>
          </Grid>

          {/* Additional Stats */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Cancelled Bookings"
              value={adminDashboard?.canceledBookings || 0}
              icon={<Cancel />}
              color="#f44336"
              isLoading={isLoadingAdminDashboard}
              trend={-2.1}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Revenue Growth"
              value={adminDashboard?.revenueGrowthPercentage || 0}
              icon={<TrendingUp />}
              color="#2196f3"
              isLoading={isLoadingAdminDashboard}
              trend={1.7}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard
              title="Active Users"
              value={
                (adminDashboard?.totalCustomers || 0) +
                (adminDashboard?.totalProviders || 0)
              }
              icon={<People />}
              color="#9c27b0"
              isLoading={isLoadingAdminDashboard}
              trend={4.3}
            />
          </Grid>
        </Grid>
      </Box>
    </AdminWrapper>
  );
};

export default AdminDashboard;

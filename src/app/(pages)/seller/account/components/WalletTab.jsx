"use client";

import React, { useMemo, useState } from "react";
import { Typography, Skeleton, Box } from "@mui/material";
import {
  FaCreditCard,
  FaArrowUp,
  FaExchangeAlt,
  FaRegEye,
  FaPlus,
  FaMinus,
  FaHistory,
} from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Button from "@/app/components/ui/Buttons/Button";
import { useUser } from "@/app/providers/userprovider";
import {
  useGetWallet,
  useGetTransaction,
} from "@/app/queries/wallet/wallet.query";
import { formatCurrency, formatDateTime } from "@/app/helpers";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid2";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoMdTrendingUp } from "react-icons/io";

const WalletTab = () => {
  const { user } = useUser();
  const { data: wallet, isFetching: isFetchingWallet } = useGetWallet();
  const { data: transactionData, isLoading: isLoadingTransaction } =
    useGetTransaction();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get the 3 latest transactions
  const latestTransactions = useMemo(() => {
    if (!transactionData || !Array.isArray(transactionData)) return [];
    return [...transactionData]
      .sort((a, b) => {
        const dateA = new Date(a.transactionDate || a.date || 0);
        const dateB = new Date(b.transactionDate || b.date || 0);
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [transactionData]);

  const allTransactions = useMemo(() => {
    if (!transactionData || !Array.isArray(transactionData)) return [];
    return [...transactionData].sort((a, b) => {
      const dateA = new Date(a.transactionDate || a.date || 0);
      const dateB = new Date(b.transactionDate || b.date || 0);
      return dateB - dateA;
    });
  }, [transactionData]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--action) 100%)",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)",
              },
            }}
          >
            {/* Card Content */}
            <Box sx={{ p: 4, position: "relative" }}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <MdAccountBalanceWallet size={24} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Wallet Balance
                  </Typography>
                </Box>
              </Box>

              {/* Balance Amount */}
              <Box mb={4}>
                {isFetchingWallet ? (
                  <Skeleton
                    width={200}
                    height={60}
                    sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                  />
                ) : (
                  <Typography
                    variant="h3"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {formatCurrency(wallet?.balance || 0)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Recent Transactions */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Recent Transactions
              </Typography>
            </Box>

            <Box>
              {isLoadingTransaction ? (
                [...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box>
                          <Skeleton width={150} />
                          <Skeleton width={100} />
                        </Box>
                      </Box>
                      <Skeleton width={80} />
                    </Box>
                  </Box>
                ))
              ) : !latestTransactions?.length ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No recent transactions
                  </Typography>
                </Box>
              ) : (
                latestTransactions.map((transaction) => {
                  const { date, time } = formatDateTime(
                    transaction.transactionDate || transaction.date
                  );
                  return (
                    <Box
                      key={transaction.id || transaction.transactionId}
                      sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        "&:last-child": {
                          borderBottom: 0,
                        },
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              color:
                                transaction.amount > 0
                                  ? "success.main"
                                  : "error.main",
                            }}
                          >
                            {transaction.amount > 0 ? (
                              <FaPlus size={18} />
                            ) : (
                              <FaMinus size={18} />
                            )}
                          </Box>
                          <Box>
                            <Typography fontWeight="medium">
                              {transaction.transactionType || "Transaction"}
                            </Typography>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              color="text.secondary"
                            >
                              <Typography variant="body2">{date}</Typography>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                                ml={1}
                              >
                                <BsClock size={14} />
                                <Typography variant="body2">{time}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Typography
                          fontWeight="medium"
                          color={
                            transaction.amount > 0
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
              {latestTransactions?.length > 0 && (
                <Box
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Button
                    label="View All Transactions"
                    icon={<FaRegEye size={20} />}
                    onClick={() => setDialogOpen(true)}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Transactions Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <FaHistory size={20} />
              <Typography variant="h6">All Transactions</Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <IoClose />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
            {!allTransactions?.length ? (
              <Typography color="text.secondary" textAlign="center">
                No transactions found
              </Typography>
            ) : (
              allTransactions.map((transaction) => {
                const { date, time } = formatDateTime(
                  transaction.transactionDate || transaction.date
                );
                return (
                  <Box
                    key={transaction.id || transaction.transactionId}
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                      "&:last-child": {
                        borderBottom: 0,
                      },
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "50%",
                            color:
                              transaction.amount > 0
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {transaction.amount > 0 ? (
                            <FaPlus size={18} />
                          ) : (
                            <FaMinus size={18} />
                          )}
                        </Box>
                        <Box>
                          <Typography fontWeight="bold">
                            {transaction.transactionType || "Transaction"}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            color="text.secondary"
                          >
                            <Typography variant="body2">{date}</Typography>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={0.5}
                              ml={1}
                            >
                              <BsClock size={14} />
                              <Typography variant="body2">{time}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Typography
                        fontWeight="medium"
                        color={
                          transaction.amount > 0 ? "success.main" : "error.main"
                        }
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(transaction.amount || 0)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button label="Close" onClick={() => setDialogOpen(false)} />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletTab;

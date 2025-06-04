"use client";

import React, { useMemo, useState } from "react";
import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { FaRegEye, FaWallet, FaHistory, FaPlus, FaMinus } from "react-icons/fa";
import ShinyCard from "@/app/components/ui/animated/ShinyCard";
import { MdPayments } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { useGetTransaction } from "@/app/queries/wallet/wallet.query";
import { encryptWalletId } from "@/app/helpers";
import { formatCurrency } from "@/app/helpers";
import { BsClock } from "react-icons/bs";
import { formatDateTime } from "@/app/helpers";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { IoClose } from "react-icons/io5";
import { Box } from "@mui/material";

const UserWallet = () => {
  const router = useRouter();
  const { data: walletData, isLoading: isLoadingWallet } = useGetWallet();
  const { data: transactionData, isLoading: isLoadingTransaction } =
    useGetTransaction();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get the 3 latest transactions
  const latestTransactions = useMemo(() => {
    if (!transactionData || !Array.isArray(transactionData)) return [];

    // Sort transactions by date (newest first)
    return [...transactionData]
      .sort((a, b) => {
        const dateA = new Date(a.transactionDate || a.date || 0);
        const dateB = new Date(b.transactionDate || b.date || 0);
        return dateB - dateA;
      })
      .slice(0, 3); // Take only the first 3
  }, [transactionData]);

  // All transactions for the dialog
  const allTransactions = useMemo(() => {
    if (!transactionData || !Array.isArray(transactionData)) return [];

    // Sort transactions by date (newest first)
    return [...transactionData].sort((a, b) => {
      const dateA = new Date(a.transactionDate || a.date || 0);
      const dateB = new Date(b.transactionDate || b.date || 0);
      return dateB - dateA;
    });
  }, [transactionData]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (isLoadingWallet || isLoadingTransaction) {
    return (
      <UserWrapper>
        <div className="flex-grow ml-6 relative">
          <div>Loading...</div>
        </div>
      </UserWrapper>
    );
  }

  return (
    <UserWrapper>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={2}
        position="relative"
        p={2}
      >
        <Box display="flex" flexDirection="column" gap={3}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <FaWallet size={20}/>
              <BodyTypo bodylabel="My Wallet" />
            </Box>
          </Box>

          {/* Balance Card */}
          <ShinyCard
            className="max-w-full md:max-w-[600px] relative overflow-hidden"
            spotlightColor="rgba(120, 119, 198, 0.3)"
          >
            <div className="flex flex-col h-full justify-center space-y-4">
              <FootTypo footlabel="Current Balance" className="text-white" />

              <Box display="flex" flexDirection="row" alignItems="center" gap={2} mb={2}>
                <FootTypo
                  footlabel={formatCurrency(walletData?.balance || 0)}
                  className="text-white"
                  fontSize="36px"
                />
              </Box>

              <Box display="flex" flexDirection="column" gap={2} mb={2}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <FootTypo footlabel="Wallet ID" className="text-white" />
                  <FootTypo footlabel={`#${encryptWalletId(walletData?.walletId)}`} className="text-white" />
                </Box>
              </Box>

              <Box display="flex" gap={2}>
                <Button
                  label="Top up"
                  icon={<MdPayments size={20} />}
                  onClick={() => router.push("/user/account/topup")}
                  className="bg-primary"
                />
              </Box>
            </div>
          </ShinyCard>

          {/* Recent Transactions - Only showing 3 latest */}
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <FootTypo footlabel="Recent Transactions" fontWeight="bold" />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              {!latestTransactions || latestTransactions.length === 0 ? (
                <FootTypo footlabel="No transactions found" />
              ) : (
                latestTransactions.map((transaction) => {
                  const { date, time } = formatDateTime(
                    transaction.transactionDate || transaction.date
                  );
                  return (
                    <Box
                      key={transaction.id || transaction.transactionId}
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap={2}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            transaction.amount > 0 ? "text-green" : "text-red"
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <FaPlus size={18} />
                          ) : (
                            <FaMinus size={18} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {transaction.transactionType || "Transaction"}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FootTypo footlabel={date} />
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              gap={1}
                            >
                              <BsClock size={14} />
                              <FootTypo footlabel={time} />
                            </Box>
                          </div>
                        </div>
                      </Box>
                      <div
                        className={`font-medium ${
                          transaction.amount > 0 ? "text-green" : "text-red"
                        }`}
                      >
                        <FootTypo
                          footlabel={`${
                            transaction.amount > 0 ? "+" : ""
                          }${formatCurrency(transaction.amount || 0)}`}
                        />
                      </div>
                    </Box>
                  );
                })
              )}

              {latestTransactions && latestTransactions.length > 0 && (
                <div className="p-3 text-center border-t dark:border-gray-700">
                  <Button
                    label="View All Transactions"
                    icon={<FaRegEye size={20} />}
                    onClick={handleDialogOpen}
                    className=""
                  />
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* All Transactions Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaHistory size={20} />
            <BodyTypo bodylabel="All Transactions" />
          </div>
          <IconButton onClick={handleDialogClose} aria-label="close">
            <IoClose />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="max-h-[70vh] overflow-y-auto">
          {!allTransactions || allTransactions.length === 0 ? (
            <FootTypo footlabel="No transactions found" />
          ) : (
            allTransactions.map((transaction) => {
              const { date, time } = formatDateTime(
                transaction.transactionDate || transaction.date
              );
              return (
                <div
                  key={transaction.id || transaction.transactionId}
                  className="flex justify-between items-center p-4 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.amount > 0 ? "text-green" : "text-red"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <FaPlus size={18} />
                      ) : (
                        <FaMinus size={18} />
                      )}
                    </div>
                    <div>
                      <FootTypo
                        footlabel={transaction.transactionType || "Transaction"}
                        fontWeight="bold"
                      />
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FootTypo footlabel={date} />
                        <div className="flex items-center gap-1 ml-2">
                          <BsClock size={14} />
                          <FootTypo footlabel={time} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      transaction.amount > 0 ? "text-green" : "text-red"
                    }`}
                  >
                    <FootTypo
                      footlabel={`${
                        transaction.amount > 0 ? "+" : ""
                      }${formatCurrency(transaction.amount || 0)}`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </DialogContent>

        <DialogActions>
          <Button label="Close" onClick={handleDialogClose} />
        </DialogActions>
      </Dialog>
    </UserWrapper>
  );
};

export default UserWallet;

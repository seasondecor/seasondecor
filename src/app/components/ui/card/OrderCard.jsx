"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateVN } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { TbCreditCardPay } from "react-icons/tb";
import { TbCancel } from "react-icons/tb";
import ReviewButton from "../Buttons/ReviewButton";
import { Box } from "@mui/material";

const OrderCard = ({
  code,
  price,
  status,
  orderDate,
  isPending,
  detailClick,
  cancelClick,
  procceedClick,
  isPaid,
  rateClick,
}) => {
  return (
    <div className="bg-transparent rounded-lg shadow-lg p-5 border dark:border-gray-50">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="between"
          gap={2}
          fontWeight="semibold"
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FootTypo footlabel="Order Code" fontWeight="bold" />
            <FootTypo footlabel={code} className="bg-primary p-1 rounded-md" />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FootTypo footlabel="Total Price" fontWeight="bold" />
            <FootTypo footlabel={formatCurrency(price)} className="underline" />
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FootTypo footlabel="Order Date" fontWeight="bold" />
            <FootTypo footlabel={formatDateVN(orderDate)} />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FootTypo footlabel="Status" fontWeight="bold" />
            <StatusChip status={status} isOrder={true} />
          </Box>

          <button
            className="text-sm underline self-start"
            onClick={detailClick}
          >
            View Details
          </button>
        </Box>

        {isPending && (
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Button
              label="Procceed"
              className="bg-action text-white"
              onClick={procceedClick}
              icon={<TbCreditCardPay size={20} />}
            />
            <Button
              label="Cancel"
              onClick={cancelClick}
              className="bg-red text-white"
              icon={<TbCancel size={20} />}
            />
          </Box>
        )}

        {isPaid && <ReviewButton onClick={rateClick} />}
      </Box>
    </div>
  );
};

export default OrderCard;

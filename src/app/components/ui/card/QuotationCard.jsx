"use client";

import { FootTypo } from "../Typography";
import { formatDateVN } from "@/app/helpers";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { BorderBox } from "../BorderBox";
import { MdChevronRight } from "react-icons/md";
import StatusChip from "../statusChip/StatusChip";
import { FaBarcode } from "react-icons/fa";
import { LuBadgeCheck } from "react-icons/lu";
import Folder from "../animated/Folder";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Box, Alert } from "@mui/material";
import { Highlight } from "../animated/HeroHighlight";

const QuotationCard = ({
  quotationCode,
  createdDate,
  status,
  onClick,
  isQuoteExisted,
  isContractExist,
  viewContract,
  serviceName,
  isSigned,
  hasTerminated,
}) => {
  return (
    <section className="py-4">
      <BorderBox className="w-full font-semibold relative">
        <Box position="absolute" top={-25} left={10}>
          <FootTypo footlabel={formatDateVN(createdDate)} />
        </Box>

        {hasTerminated && (
          <Box position="absolute" top={-10} right={10}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Alert severity="error">
                <FootTypo
                  footlabel="Quotation is closed due to contract termination!"
                  fontWeight="bold"
                />
              </Alert>
              <Folder
                size={0.4}
                color="#00d8ff"
                className="hover:scale-110 transition-transform duration-200"
                onClick={viewContract}
              />
            </Box>
          </Box>
        )}

        {!hasTerminated &&
          isQuoteExisted &&
          !isContractExist &&
          status !== 4 && (
            <Box position="absolute" top={-10} right={4}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
              >
                <MdOutlineKeyboardDoubleArrowRight
                  className="text-primary flex-shrink-0 animate-pulse"
                  size={20}
                />
                <FootTypo footlabel="Your quotation is ready" />
              </Box>
            </Box>
          )}

        {!hasTerminated && isContractExist && (
          <>
            {isSigned ? (
              <Box position="absolute" top={-10} right={4}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
                >
                  <LuBadgeCheck
                    className="text-green flex-shrink-0"
                    size={30}
                  />
                  <FootTypo footlabel="Contract Signed" fontWeight="bold" />
                  <Folder
                    size={0.4}
                    color="#00d8ff"
                    className="hover:scale-110 transition-transform duration-200"
                    onClick={viewContract}
                  />
                </Box>
              </Box>
            ) : (
              <Box position="absolute" top={-10} right={4}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
                >
                  <Highlight>
                    <FootTypo footlabel="Your Contract is ready !" fontWeight="bold" />
                  </Highlight>
                  <Folder
                    size={0.4}
                    color="#00d8ff"
                    className="hover:scale-110 transition-transform duration-200"
                    onClick={viewContract}
                  />
                </Box>
              </Box>
            )}
          </>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <FaBarcode className="text-primary flex-shrink-0" size={20} />
            <FootTypo footlabel="Quotation Code" />
            <FootTypo
              footlabel={quotationCode}
              fontWeight="bold"
              className="underline"
            />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <TbFileInvoice className="text-primary flex-shrink-0" size={20} />
            <FootTypo footlabel="Service name" />
            <FootTypo footlabel={serviceName} fontWeight="bold" />
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <HiOutlineStatusOnline
              className="text-primary flex-shrink-0"
              size={20}
            />
            <FootTypo footlabel="Status" />
            <StatusChip status={status} isQuotation={true} />
          </Box>
        </Box>
        <button
          onClick={onClick}
          className="flex flex-row gap-2 items-center text-sm hover:translate-x-3 transition-all duration-300"
        >
          View Quotation
          <MdChevronRight size={20} />
        </button>
      </BorderBox>
    </section>
  );
};

export default QuotationCard;

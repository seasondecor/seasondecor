import {
  FaMoneyBill,
  FaTools,
  FaFileContract,
  FaClock,
  FaTruck,
  FaSignature,
  FaCheckCircle
} from "react-icons/fa";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { GrInProgress } from "react-icons/gr";
import { CgUnavailable } from "react-icons/cg";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { MdCancel, MdOutlineChecklist } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

// Status configuration object
export const STATUS_CONFIG = {
  order: {
    0: { label: "Pending", color: "warning", icon: FaClock },
    1: { label: "Paid", color: "success", icon: FaCheckCircle },
    2: { label: "Canceled", color: "error", icon: MdCancel }, 
  },
  service: {
    0: { label: "Available", color: "success", icon: GoDotFill, animate: true },
    1: { label: "Unavailable", color: "error", icon: CgUnavailable },
    2: { label: "Pending", color: "warning", icon: FaClock },
  },
  booking: {
    0: { label: "Pending", color: "warning", icon: FaClock },
    1: { label: "Planning", color: "primary", icon: LuClipboardList },
    2: { label: "Quoting", color: "warning", icon: BiSolidQuoteLeft },
    3: { label: "Contracting", color: "default", icon: FaFileContract },
    4: { label: "Confirmed", color: "success", icon: IoCheckmarkDoneSharp },
    5: { label: "Deposit Paid", color: "success", icon: FaMoneyBill },
    6: { label: "Preparing", color: "primary", icon: FaTools },
    7: { label: "In Transit", color: "warning", icon: FaTruck },
    8: { label: "Progressing", color: "warning", icon: GrInProgress },
    9: { label: "All Done", color: "success", icon: MdOutlineChecklist },
    10: { label: "Final Paid", color: "success", icon: FaMoneyBill },
    11: { label: "Completed", color: "success", icon: IoCheckmarkDoneSharp },
    12: { label: "Pending Cancel", color: "warning", icon: FaClock },
    13: { label: "Cancelled", color: "error", icon: MdCancel },
    14: { label: "Rejected", color: "error", icon: MdCancel },
  },
  quotation: {
    0: { label: "Pending", color: "warning", icon: FaClock },
    1: { label: "Confirmed", color: "success", icon: IoCheckmarkDoneSharp },
    2: { label: "Pending Change", color: "warning", icon: FaClock },
    3: { label: "Pending Cancel", color: "warning", icon: FaClock },
    4: { label: "Closed", color: "error", icon: MdCancel },
  },
  contract: {
    0: { label: "Pending", color: "warning", icon: FaClock },
    1: { label: "Signed", color: "success", icon: FaSignature },
    3: { label: "Pending to cancel", color: "warning", icon: FaClock },
    4: { label: "Cancelled", color: "error", icon: MdCancel },
  },
}; 
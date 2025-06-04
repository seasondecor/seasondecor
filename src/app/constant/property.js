import { FaBuilding, FaHouseUser } from "react-icons/fa";
import { MdApartment, MdOtherHouses } from "react-icons/md";
import { BiSolidBuildings } from "react-icons/bi";

export const propertyTypes = [
  {
    id: 1,
    name: "Apartment",
    icon: MdApartment,
  },
  {
    id: 2,
    name: "Villa / House",
    icon: FaHouseUser,
  },
  {
    id: 3,
    name: "Studio",
    icon: FaBuilding,
  },
  {
    id: 4,
    name: "Office",
    icon: BiSolidBuildings,
  },
  {
    id: 5,
    name: "Other",
    icon: MdOtherHouses,
  },
];

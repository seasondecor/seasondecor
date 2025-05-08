"use client";

import * as React from "react";
import { BorderBox } from "../BorderBox";
import Image from "next/image";
import Link from "next/link";
import { LuBox } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import ExampleNumberField from "../Select/NumberField";
import { formatCurrency } from "@/app/helpers";

const CartItem = ({
  id,
  image,
  productName,
  quantity,
  price,
  onDelete,
  onChangeQuantity,
}) => {
  const [localQuantity, setLocalQuantity] = React.useState(quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity !== localQuantity) {
      setLocalQuantity(newQuantity);
      onChangeQuantity(newQuantity);
    }
  };

  return (
    <BorderBox>
      <div id={id} className="rounded-lg border border-gray-300 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Product Image */}
          <Link href="#" className="shrink-0 md:order-1">
            <Image
              src={image}
              width={120}
              height={120}
              priority
              alt="Product image"
              className="rounded-lg object-cover w-full"
            />
          </Link>

          {/* Product Details */}
          <div className="flex-1 space-y-4 text-center md:text-left md:order-2">
            <Link
              href="#"
              className="text-lg font-semibold text-gray-900 hover:underline dark:text-white block border-b-[1px] pb-5"
            >
              {productName}
            </Link>
            <div className="flex items-center justify-end">
              <FaTrashAlt
                size={20}
                className="cursor-pointer"
                color="red"
                onClick={onDelete}
              />
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="flex flex-col gap-2 items-center justify-center md:flex-row md:gap-4 md:order-3">
            <ExampleNumberField
              value={localQuantity}
              onChange={handleQuantityChange}
            />
            <p className="text-xl font-bold text-gray-900 dark:text-white inline-flex items-center">
              {formatCurrency(price)}
            </p>
          </div>
        </div>
      </div>
    </BorderBox>
  );
};

export default CartItem;

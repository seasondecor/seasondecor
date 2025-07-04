"use client";

import { useTheme } from "next-themes";
import clsx from "clsx";
import { ClipLoader } from "react-spinners";
import { FootTypo } from "../Typography";

const Button = ({
  onClick,
  icon,
  label,
  disabled,
  isLoading,
  link,
  className,
}) => {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) {
    // Prevent rendering until theme is resolved
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        "flex flex-row items-center rounded-md border px-3 py-2 transition duration-200",
        {
          "cursor-not-allowed opacity-50": isLoading,
          "border-gray-400 bg-gray-200 text-gray-400": disabled,
          "border-white text-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)]":
            !disabled && resolvedTheme === "dark",
          "border-black text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]":
            !disabled && resolvedTheme === "light",
        },
        className
      )}
    >
      {isLoading ? (
        <>
          <ClipLoader
            size={15}
            color={resolvedTheme === "dark" ? "#fff" : "#000"}
            className="mr-2"
          />
          {label}
        </>
      ) : (
        <>
       
          {icon && <span className="md:mr-2">{icon}</span>} 
          <FootTypo footlabel={label} className="hidden md:block"/>
        </>
      )}
    </button>
  );
};

export default Button;

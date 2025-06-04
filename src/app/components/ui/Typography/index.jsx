"use client"

import clsx from "clsx";
import { Typography } from '@mui/material';


export const HeadTypo = ({label}) => {
    return(
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
            {label}
          </p>
    )
}

export const BodyTypo = ({ bodylabel, ...props }) => {
    return (
      <Typography variant="h5" component="h1" fontWeight="bold" {...props}>
        {bodylabel}
      </Typography>
    );
  };

  export const FootTypo = ({footlabel, className, fontWeight, fontSize , ...props}) => {
    return (
      <Typography variant="body2" fontWeight={fontWeight} fontSize={fontSize} className={clsx("", className)} {...props}>
        {footlabel}
      </Typography>
    );
  };
"use client";

import React from "react";
import { FootTypo } from "../Typography";
import { Box, Chip, Card, CardContent, Button } from "@mui/material";

const TicketCard = ({
  id,
  date,
  time,
  status,
  subject,
  reportedBy,
  onClick,
  isProvider = false,
}) => {
  const getStatus = (status) => {
    return (
      <Chip
        label={status ? "Closed" : "Opened"}
        color={status ? "error" : "success"}
        size="small"
        sx={{
          color: "white",
          fontWeight: 500,
          "&.MuiChip-colorError": {
            backgroundColor: "rgb(239 68 68)",
          },
          "&.MuiChip-colorSuccess": {
            backgroundColor: "rgb(34 197 94)",
          },
        }}
      />
    );
  };

  return (
    <Card
      sx={{
        minHeight: "8em",
        borderRadius: "1em",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: "1px solid rgb(229 231 235)",
        "&:hover": {
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          height: "5em",
          width: "5em",
          top: "-2.5em",
          right: "-2.5em",
          borderRadius: "50%",
          backgroundColor: "#FF5800",
          transition: "transform 0.5s ease",
          zIndex: 0,
        },
        "&:hover::before": {
          transform: "scale(8)",
        },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 1, p: 2.5 }}>
        <FootTypo
          footlabel={`Ticket ID: ${id}`}
          className="z-20 duration-500"
          fontWeight="bold"
          fontSize="1.4em"
          mb={2}
        />
        <Box position="absolute" bottom={10} right={10}>
          <Button
            onClick={onClick}
            sx={{
              textTransform: "none",
              textDecoration: "underline",
              minWidth: "auto",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            View Details
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <FootTypo footlabel="Created on:" fontWeight="bold" mb={0.5} />
            <FootTypo
              footlabel={`${date || "N/A"} ${time ? `at ${time}` : ""}`}
            />
            {isProvider && (
              <FootTypo footlabel={`Reported by: ${reportedBy || "You"}`} />
            )}
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="flex-end"
          >
            {getStatus(status)}
          </Box>
        </Box>

        <Box>
          <FootTypo footlabel="Subject:" fontWeight="bold" mb={0.5} />
          <FootTypo footlabel={subject || "No subject provided"} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;

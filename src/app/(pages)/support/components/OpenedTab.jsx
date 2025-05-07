import React, { useState } from "react";
import { useGetSupportTicketForCustomer } from "@/app/queries/support/support.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import TicketCard from "@/app/components/ui/card/TicketCard";
import { formatDateTime } from "@/app/helpers";
import {
  Modal,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { TbTicket } from "react-icons/tb";
import CloseIcon from "@mui/icons-material/Close";

const OpenedTab = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: dataSupportTicketForCustomer, isPending } =
    useGetSupportTicketForCustomer();

  const ticketList = dataSupportTicketForCustomer?.data || [];


  const handleOpenModal = (ticket) => {
    setIsLoading(true);
    setSelectedTicket(ticket);
    setIsModalOpen(true);

    // Simulate loading of additional ticket details
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset selected ticket after modal animation completes
    setTimeout(() => {
      setSelectedTicket(null);
    }, 300);
  };

  const getAttachmentType = (url) => {
    if (!url) return "unknown";
    const extension = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return "image";
    } else if (["pdf"].includes(extension)) {
      return "pdf";
    } else if (["doc", "docx"].includes(extension)) {
      return "doc";
    } else {
      return "file";
    }
  };

  const renderAttachment = (url, index) => {
    const type = getAttachmentType(url);

    if (type === "image") {
      return (
        <Box
          key={index}
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "block",
            width: 100,
            height: 100,
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 1,
            border: "1px solid #eee",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      );
    } else {
      // For non-image files
      return (
        <Button
          key={index}
          variant="outlined"
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={
            type === "pdf" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                  fill="#FF5722"
                />
                <path
                  d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z"
                  fill="#FF5722"
                />
                <path
                  d="M10 12H18V14H10V12ZM10 8H18V10H10V8ZM10 16H14V18H10V16Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                  fill="#2196F3"
                />
                <path d="M14 2V8H20L14 2Z" fill="#90CAF9" />
                <path
                  d="M16 13H8V15H16V13ZM16 17H8V19H16V17ZM10 9H8V11H10V9Z"
                  fill="white"
                />
              </svg>
            )
          }
          sx={{
            textTransform: "none",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {url.split("/").pop()}
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 overflow-y-auto h-full">
      {ticketList.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Total: {ticketList.length}
            {ticketList.length >= 3 ? " (Maximum reached)" : ""}
          </span>
        </div>
      )}

      <DataMapper
        data={ticketList}
        Component={TicketCard}
        loading={isPending}
        emptyStateComponent={<EmptyState title="No tickets found" />}
        getKey={(item) => item.id}
        componentProps={(ticket) => {
          const { date, time } = formatDateTime(ticket.createAt);

          return {
            id: ticket.id,
            date: date,
            time: time,
            status: ticket.isSolved,
            subject: ticket.subject,
            onClick: () => handleOpenModal(ticket),
          };
        }}
      />

      {/* Ticket Details Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="ticket-details-modal"
        aria-describedby="detailed-view-of-support-ticket"
        className="dark:text-black"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "60%" },
            maxWidth: "700px",
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            selectedTicket && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <BodyTypo
                    bodylabel={`Ticket #${selectedTicket.id}`}
                    className="text-xl font-bold"
                  />
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FootTypo footlabel="Status" className="font-medium" />
                  <Chip
                    label={selectedTicket.isSolved ? "Closed" : "Open"}
                    sx={{
                      bgcolor: selectedTicket.isSolved ? "red" : "green",
                    }}
                  />
                </Box>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <FootTypo
                      footlabel="Created on"
                      className="font-medium mb-1"
                    />
                    <FootTypo
                      footlabel={`${
                        formatDateTime(selectedTicket.createAt).date
                      } at ${formatDateTime(selectedTicket.createAt).time}`}
                    />
                  </div>

                  {selectedTicket.bookingCode && (
                    <div className="flex flex-col">
                      <FootTypo
                        footlabel="Booking Code"
                        className="font-medium mb-1"
                      />
                      <FootTypo footlabel={selectedTicket.bookingCode} />
                    </div>
                  )}

                  {selectedTicket.ticketType && (
                    <div className="flex flex-col">
                      <FootTypo
                        footlabel="Ticket Type"
                        className="font-medium mb-1"
                      />
                      <div className="flex items-center gap-2">
                        <TbTicket size={16} className="text-primary" />
                        <FootTypo footlabel={selectedTicket.ticketType} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <FootTypo footlabel="Subject" className="font-medium mb-1" />
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                    <FootTypo
                      footlabel={
                        selectedTicket.subject || "No subject provided"
                      }
                      className="text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <FootTypo
                    footlabel="Description"
                    className="font-medium mb-1"
                  />
                  <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-800 min-h-[100px]">
                    <FootTypo
                      footlabel={
                        selectedTicket.description || "No description provided"
                      }
                      className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                    />
                  </div>
                </div>

                {selectedTicket.attachmentUrls &&
                  selectedTicket.attachmentUrls.length > 0 && (
                    <div className="mb-6">
                      <FootTypo
                        footlabel="Attachments"
                        className="font-medium mb-2"
                      />
                      <div className="flex flex-wrap gap-3 border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                        {selectedTicket.attachmentUrls.map((url, index) =>
                          renderAttachment(url, index)
                        )}
                      </div>
                    </div>
                  )}

                {selectedTicket.replies &&
                  selectedTicket.replies.length > 0 && (
                    <div className="mb-4">
                      <FootTypo
                        footlabel="Conversation"
                        className="font-medium mb-2"
                      />
                      <div className="flex flex-col gap-3">
                        {selectedTicket.replies.map((reply, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-md ${
                              reply.isFromAdmin
                                ? "bg-gray-100 dark:bg-gray-700 ml-auto"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                            style={{
                              maxWidth: "80%",
                              alignSelf: reply.isFromAdmin
                                ? "flex-end"
                                : "flex-start",
                            }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <FootTypo
                                footlabel={formatDateTime(reply.createAt).date}
                                className="text-xs text-gray-500"
                              />
                            </div>
                            <FootTypo
                              footlabel={reply.description}
                              className="whitespace-pre-wrap"
                            />
                            {reply.attachments &&
                              reply.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {reply.attachments.map((url, attachIndex) =>
                                    renderAttachment(
                                      url,
                                      `reply-${index}-${attachIndex}`
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default OpenedTab;

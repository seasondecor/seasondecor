import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

const SuccessCheckmark = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
    }}
  >
    <IoCheckmarkCircle 
      size={40} 
      className="text-emerald-500"
    />
  </motion.div>
);

const ErrorIcon = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
    }}
  >
    <IoCloseCircle 
      size={40} 
      className="text-red-500" 
    />
  </motion.div>
);

const ResultModal = ({
  open,
  onClose,
  title,
  message,
  type = "success",
  confirmText = "Okay",
  onConfirm,
  showActions = true,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="result-dialog-title"
          PaperProps={{
            className: "rounded-lg",
            sx: {
              minWidth: { xs: '90%', sm: '400px' },
              maxWidth: '400px',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              p: 3,
            },
            component: motion.div,
            initial: { opacity: 0, y: 20, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 20, scale: 0.95 },
            transition: { duration: 0.2 },
          }}
        >
          <DialogContent>
            <Box className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                {type === "success" ? <SuccessCheckmark /> : <ErrorIcon />}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium text-gray-900 mb-2"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6"
              >
                {message}
              </motion.p>

              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <Button
                    onClick={handleConfirm}
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      py: 1,
                      bgcolor: 'rgb(16 185 129)',
                      '&:hover': {
                        bgcolor: 'rgb(4 120 87)',
                      },
                    }}
                    variant="contained"
                  >
                    {confirmText}
                  </Button>
                </motion.div>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;

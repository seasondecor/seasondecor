"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FootTypo } from "@/app/components/ui/Typography";
import { IoIosAdd } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import {
  Chip,
  Box,
  Modal,
  IconButton,
  Typography,
  TextField,
  Rating,
} from "@mui/material";
import { FaStar, FaEye, FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import ImageSlider from "@/app/components/ui/slider/ImageSlider";
import { IoMdRemove, IoMdAdd, IoIosMore } from "react-icons/io";
import Button from "@/app/components/ui/Buttons/Button";
import { MdDelete } from "react-icons/md";

const AdditionalCard = ({
  id,
  productId,
  image,
  productName,
  price,
  totalSold,
  totalQuantity,
  rate,
  category,
  description,
  isAvailable = true,
  onAddProduct,
  onUpdateQuantity,
  onRemoveProduct,
  relatedProducts = [], // Array of related products
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Find if this product is in relatedProducts using productId
  const addedProduct = React.useMemo(() => {
    return relatedProducts.find(p => p.productId === productId);
  }, [relatedProducts, productId]);

  const isAdded = !!addedProduct;

  const processedImages = React.useMemo(() => {
    if (!image) return [];
    if (typeof image === "string") return [image];
    if (Array.isArray(image)) return image;
    if (image.imageUrls && Array.isArray(image.imageUrls))
      return image.imageUrls;
    return [];
  }, [image]);

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -3 },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const buttonVariants = {
    initial: { opacity: 0.95, scale: 1 },
    hover: { 
      opacity: 1, 
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (isAdded) {
      onUpdateQuantity(productId, addedProduct.quantity + 1);
    } else {
      setQuantity((prev) => Math.min(prev + 1, totalQuantity));
    }
  };

  const decreaseQuantity = () => {
    if (isAdded) {
      if (addedProduct.quantity > 1) {
        onUpdateQuantity(productId, addedProduct.quantity - 1);
      }
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleRemove = () => {
    onRemoveProduct(productId);
  };

  const handleAddToCart = () => {
    if (onAddProduct && productId) {
      onAddProduct(productId, quantity);
      setIsModalOpen(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "600px", md: "800px" },
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: 24,
    p: 0,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <>
      <motion.div
        className={`rounded-xl overflow-hidden bg-white shadow-lg max-w-sm w-full ${
          isAdded ? 'border-2 border-blue-500' : ''
        }`}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        animate={isHovered ? "hover" : "initial"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-64 overflow-hidden">
          {isAdded && (
            <motion.div 
              className="absolute top-4 right-4 z-10 bg-blue-500 rounded-full p-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <FaCheck className="text-white" size={16} />
            </motion.div>
          )}
          <motion.div
            className="w-full h-full"
            variants={imageVariants}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={processedImages[0] || "/placeholder-product.jpg"}
              alt={productName}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 400px"
              quality={90}
            />
          </motion.div>

          {category && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Chip
                label={category}
                variant="outlined"
                sx={{ backgroundColor: "white", color: "black" }}
              />
            </motion.div>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <FootTypo variant="h6" color="white">
                Out of Stock
              </FootTypo>
            </div>
          )}
        </div>

        <div className="p-5">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <FootTypo
              footlabel={productName}
              variant="h6"
              color="gray-800"
              className="max-w-[150px] truncate"
            />
            <Box display="flex" alignItems="center" gap={1}>
              {rate} <FaStar size={18} />
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <FootTypo
              footlabel={`${formatCurrency(price)}`}
              variant="h6"
              color="gray-900"
            />

            {isAdded ? (
              <Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={decreaseQuantity}
                      size="small"
                      disabled={addedProduct.quantity <= 1}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "4px",
                      }}
                    >
                      <IoMdRemove size={16} />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {addedProduct.quantity}
                    </Typography>
                    <IconButton
                      onClick={increaseQuantity}
                      size="small"
                      disabled={addedProduct.quantity >= totalQuantity}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "4px",
                      }}
                    >
                      <IoMdAdd size={16} />
                    </IconButton>
                  </Box>
                  <IconButton
                    onClick={handleRemove}
                    size="small"
                    sx={{
                      color: "error.main",
                      "&:hover": { backgroundColor: "error.light" },
                    }}
                  >
                    <MdDelete size={20} />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <motion.button
                onClick={isAvailable ? handleOpenModal : undefined}
                className={`flex w-fit items-center gap-2 px-4 py-2 rounded-full ${
                  isAvailable
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
                whileTap={{ scale: 0.98 }}
                variants={buttonVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                transition={{ duration: 0.2 }}
              >
                <FaEye />
                {isAvailable ? "View" : "Unavailable"}
              </motion.button>
            )}
          </Box>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="product-detail-modal"
        aria-describedby="product-detail-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            borderBottom="1px solid #e0e0e0"
          >
            <Typography
              id="product-detail-modal"
              variant="h5"
              component="h2"
              fontWeight="600"
            >
              {productName}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <MdClose size={22} />
            </IconButton>
          </Box>

          <Box p={2} fontWeight="semibold">
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={6}>
              {/* Left column: Image slider */}
              <Box className="overflow-hidden rounded-lg col-span-2">
                <ImageSlider img={processedImages} />
              </Box>

              {/* Right column: Product info */}
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Quantity selector */}
                <Box className="py-1">
                  <FootTypo footlabel="Quantity" />
                  <Box display="flex" alignItems="center" mt={1}>
                    <IconButton
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      size="small"
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "6px",
                        color: "text.secondary",
                      }}
                    >
                      <IoMdRemove size={18} />
                    </IconButton>

                    <TextField
                      value={quantity}
                      onChange={handleQuantityChange}
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{
                        min: 1,
                        style: {
                          textAlign: "center",
                          padding: "6px 0",
                          fontSize: "14px",
                        },
                      }}
                      sx={{
                        width: "60px",
                        mx: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                        },
                      }}
                    />

                    <IconButton
                      onClick={increaseQuantity}
                      size="small"
                      disabled={quantity >= totalQuantity}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "6px",
                        color: "text.secondary",
                      }}
                    >
                      <IoMdAdd size={18} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Total */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <FootTypo
                    footlabel={`Total: ${formatCurrency(price * quantity)}`}
                    className="mb-2"
                  />
                </div>

                {/* Action buttons */}
                <Box className="flex gap-3 mt-auto">
                  <Button
                    icon={<IoMdAdd />}
                    label="Add"
                    className="bg-action text-white"
                    onClick={handleAddToCart}
                    disabled={!onAddProduct || !id}
                  />

                  <Button
                    icon={<IoIosMore />}
                    label="Browse more"
                    onClick={() => router.push("/products")}
                  />
                </Box>
              </Box>
              <Box className="p-5 rounded-lg">
                <FootTypo
                  footlabel={formatCurrency(price)}
                  fontWeight="bold"
                  fontSize="1.3rem"
                />

                <Box display="flex" alignItems="center" my={0.5} gap={1}>
                  <Rating
                    value={rate || 4.8}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <FootTypo
                    footlabel={`${totalSold} sold`}
                    className="text-sm"
                  />
                </Box>

                <FootTypo
                  footlabel={`${totalQuantity} pieces available`}
                  className="text-sm"
                />
              </Box>
            </Box>

            {/* Product Description */}
            <div className="mt-8 border-t border-gray-100 pt-5">
              <Typography variant="h6" fontWeight="600" className="mb-3">
                Description
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AdditionalCard;

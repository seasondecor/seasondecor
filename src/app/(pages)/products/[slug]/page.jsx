"use client";

import React, { useEffect, useState } from "react";
import Container from "@/app/components/layouts/Container";
import ImageSlider from "@/app/components/ui/slider/ImageSlider";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { AiOutlineShop } from "react-icons/ai";
import { BorderBox } from "@/app/components/ui/BorderBox";
import DescrriptionSection from "../components/sections/DescriptionSection";
import ExampleNumberField from "@/app/components/ui/Select/NumberField";
import ReviewSection from "@/app/components/ui/review/ReviewSection";
import { formatCurrency, getBgColorForSeason } from "@/app/helpers";
import { BsCartPlus } from "react-icons/bs";
import { useParams } from "next/navigation";
import { FcShipped } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { useGetProductById } from "@/app/queries/product/product.query";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { scroller } from "react-scroll";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useAddToCart } from "@/app/queries/cart/cart.query";
import { useUser } from "@/app/providers/userprovider";
import { useRouter } from "next/navigation";
import { IoIosStar } from "react-icons/io";
import { useAddContact } from "@/app/queries/contact/contact.query";
import { useQueryClient } from "@tanstack/react-query";
import useChat from "@/app/hooks/useChat";
import useChatBox from "@/app/hooks/useChatBox";
import { toast } from "sonner";
import { generateSlug } from "@/app/helpers";
import { useAddFavoriteDecorProduct } from "@/app/queries/favorite/favorit.query";
import { useGetListFavoriteProduct } from "@/app/queries/list/favorite.list.query";
import { useGetListReviewByProduct } from "@/app/queries/list/review.list.query";
import { Box, Skeleton, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import OverallRating from "@/app/components/ui/review/OverallRating";
import ReviewCard from "@/app/components/ui/card/ReviewCard";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { seasons } from "@/app/constant/season";

const ProductDetailSkeleton = () => {
  return (
    <>
      <Box mb={2}>
        <Skeleton variant="text" width={300} height={30} />
      </Box>
      <BorderBox>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex flex-col w-full gap-6 h-fit items-center pt-10">
            <Skeleton variant="rectangular" height={400} width="100%" />
            <Skeleton variant="text" width={150} height={24} />
          </div>
          <div className="flex-flex-col w-full p-10">
            <div className="flex flex-col justify-start">
              <Skeleton variant="text" width="80%" height={50} />
              <Box my={2}>
                <Skeleton variant="text" width="60%" height={30} />
              </Box>
              <Skeleton
                variant="rectangular"
                height={70}
                width="100%"
                sx={{ my: 2 }}
              />
              <Stack spacing={2} my={3}>
                <Box display="flex" alignItems="center">
                  <Skeleton variant="text" width={140} height={30} />
                  <Skeleton
                    variant="text"
                    width={200}
                    height={30}
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <Skeleton variant="text" width={140} height={30} />
                  <Skeleton
                    variant="text"
                    width={200}
                    height={30}
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <Skeleton variant="text" width={140} height={30} />
                  <Skeleton
                    variant="text"
                    width={200}
                    height={30}
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Box display="flex" alignItems="center" my={4}>
                  <Skeleton variant="text" width={140} height={30} />
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={40}
                    sx={{ ml: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width={150}
                    height={30}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </Stack>
              <Box display="flex" gap={2}>
                <Skeleton variant="rectangular" width={140} height={45} />
                <Skeleton variant="rectangular" width={140} height={45} />
              </Box>
            </div>
          </div>
        </div>
      </BorderBox>

      <BorderBox className="my-5">
        <Box p={3}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={96} height={96} />
              <Box>
                <Skeleton variant="text" width={180} height={30} />
                <Box mt={2} display="flex" gap={2}>
                  <Skeleton variant="rectangular" width={110} height={40} />
                  <Skeleton variant="rectangular" width={110} height={40} />
                </Box>
              </Box>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
            <Box flexGrow={1} pl={{ xs: 0, md: 3 }}>
              <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={2}>
                {[...Array(6)].map((_, i) => (
                  <Box key={i} display="flex" justifyContent="space-between">
                    <Skeleton variant="text" width={70} />
                    <Skeleton variant="text" width={40} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </BorderBox>

      <BorderBox className="my-5">
        <Box p={3}>
          <Skeleton variant="text" width={180} height={30} />
          <Skeleton
            variant="rectangular"
            height={250}
            width="100%"
            sx={{ mt: 2 }}
          />
        </Box>
      </BorderBox>
    </>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const { setSelectedReceiver } = useChat();
  const { onOpen } = useChatBox();
  const router = useRouter();
  const addContactMutation = useAddContact();
  const queryClient = useQueryClient();
  const { data: favorites } = useGetListFavoriteProduct();
  const { mutate: addFavoriteDecorProduct } = useAddFavoriteDecorProduct();

  const { data: productsData } = useGetListProduct();
  const [productId, setProductId] = useState(null);
  const { data: productDetail, isLoading } = useGetProductById(productId);

  const { mutate: addToCart, isPending } = useAddToCart();

  const [quantity, setQuantity] = useState(1);

  // Check if the product is already in favorites
  const isInFavorites = React.useMemo(() => {
    if (!favorites || !productId) return false;
    // Convert both IDs to strings for comparison
    const currentProductId = String(productId);
    return favorites.some((fav) => String(fav.productDetail.id) === currentProductId);
  }, [favorites, productId]);

  const { data: reviewData, isLoading: isReviewsLoading } =
    useGetListReviewByProduct(
      productId,
      {
        pageIndex: 1,
        pageSize: 12,
      },
      {
        enabled: !!productId,
      }
    );

  const reviews = reviewData?.data || [];

  useEffect(() => {
    if (slug) {
      // Extract product ID from the beginning of the slug (before the first dash)
      const idMatch = slug.match(/^([^-]+)/);
      if (idMatch && idMatch[1]) {
        // Set the product ID directly from the URL
        setProductId(idMatch[1]);
      } else if (
        productsData &&
        productsData.data &&
        Array.isArray(productsData.data)
      ) {
        // Fallback to old method (looking up by name slug) for backward compatibility
        const matchedProduct = productsData.data.find(
          (p) => generateSlug(p.productName) === slug
        );
        if (matchedProduct) {
          setProductId(matchedProduct.id);
        }
      }
    }
  }, [productsData, slug]);

  if (isLoading || !productId) {
    return (
      <Container>
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (!productDetail) {
    return (
      <Box className="flex flex-col items-center justify-center h-screen">
        <BodyTypo bodylabel="Product not found" fontWeight="bold" />
        <Button
          label="Go to home"
          className="bg-primary"
          onClick={() => router.push("/")}
        />
      </Box>
    );
  }

  const handleAddToCart = () => {
    if (!user?.id) {
      toast.info("Please login first");
      router.push("/authen/login");
      return;
    }

    addToCart(
      {
        accountId: user.id,
        productId: productDetail.id,
        quantity: quantity,
      },
      {
        onError: (error) => {
          console.error("Failed to add to cart:", error);
          alert("Failed to add product to cart.");
        },
      }
    );
  };

  const handleAddToFavorites = () => {
    if (isInFavorites) return;

    if (!user?.id) {
      toast.info("Please login first");
      router.push("/authen/login");
      return;
    }

    addFavoriteDecorProduct(productId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get_list_favorite_product"],
        });
      },
      onError: (error) => {
        console.log("Error adding to favorite:", error);
      },
    });
  };

  const handleRatingClick = () => {
    scroller.scrollTo("reviewSection", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50,
    });
  };

  const handleChatClick = (receiver) => {
    const receiverData = {
      contactId: receiver.id,
      contactName: receiver.businessName,
      avatar: receiver.avatar,
    };
    addContactMutation.mutate(receiver.id, {
      onSuccess: () => {
        setSelectedReceiver(receiverData);
        onOpen();
        queryClient.invalidateQueries(["get_list_contact"]);
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

  return (
    <>
      <Container>
        <div className="my-7">
          <MuiBreadcrumbs />
        </div>
        <BorderBox>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
          >
            <div className="flex flex-col w-full gap-6  h-fit items-center pt-10">
              <ImageSlider
                img={productDetail.imageUrls || []}
                loading={isLoading}
              />
              <span className="inline-flex items-center gap-2">
                <MdFavoriteBorder /> People liked (
                {productDetail.favoriteCount || "..."})
              </span>
            </div>
            {/* INFO */}
            <div className="flex-flex-col w-full p-10 dark:text-white">
              <Box display="flex" flexDirection="column" justifyContent="start">
                <Box display="flex" justifyContent="start" mb={2}>
                  <BodyTypo
                    bodylabel={productDetail.productName}
                    fontWeight="bold"
                  />
                </Box>
                <Box display="flex" justifyContent="start" mb={2}>
                  <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                    borderLeft="1px solid #e0e0e0"
                    px={2}
                  >
                    <button className="underline" onClick={handleRatingClick}>
                      {productDetail?.totalCount === 0
                        ? "No Rating Yet"
                        : `${reviewData?.totalCount} Ratings`}
                    </button>
                  </Box>
                  <Box className="flex gap-2 items-center border-l-[1px] px-5">
                    <span className="underline">
                      {productDetail?.totalSold
                        ? `${productDetail?.totalSold} Solds`
                        : "No product sold"}
                    </span>
                  </Box>
                </Box>
              </Box>

              <span className="bg-gray-50 w-full dark:bg-zinc-800 p-5 gap-2 inline-flex text-red">
                <FootTypo
                  footlabel={formatCurrency(productDetail.productPrice)}
                  fontWeight="bold"
                  fontSize="22px"
                />
              </span>
              <Box display="flex" flexDirection="column" gap={5} mt={1}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FootTypo footlabel="Made In" className="w-40" />
                  {productDetail.madeIn}
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <FootTypo footlabel="Ship From" className="w-40" />
                  <FcShipped size={20} />
                  {productDetail.shipFrom}
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <FootTypo footlabel="Shopping Guarantee" className="w-40" />
                  <FcApproval size={20} />
                  15-Day Free Returns
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <FootTypo footlabel="Decorated for" className="w-40" />
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {productDetail.seasons?.map((seasonValue, index) => {
                      const seasonInfo = seasons.find(s => s.value.toLowerCase() === seasonValue.toLowerCase());
                      return (
                        <Box
                          key={index}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${getBgColorForSeason(seasonValue)} inline-flex items-center gap-1.5`}
                        >
                          {seasonInfo?.icon}
                          <span>{seasonInfo?.label || seasonValue}</span>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <FootTypo footlabel="Quantity" className="w-40" />
                  {user?.id !== productDetail.provider.id && (
                    <ExampleNumberField
                      value={quantity}
                      onChange={(value) => setQuantity(value)}
                    />
                  )}

                  <FootTypo
                    footlabel={`${productDetail.quantity} pieces available`}
                    className="pl-5"
                  />
                </Box>

                <Box className="inline-flex items-center gap-4">
                  {user?.id !== productDetail.provider.id && (
                    <>
                      <Button
                        label="Add to cart"
                        className="bg-primary"
                        icon={<BsCartPlus size={20} />}
                        onClick={handleAddToCart}
                      />
                      <Button
                        label={
                          isInFavorites ? "In your wishlist" : "Add to Wishlist"
                        }
                        className={
                          isInFavorites ? "bg-rose-600" : "bg-rose-500"
                        }
                        icon={
                          isInFavorites ? (
                            <MdFavorite size={20} />
                          ) : (
                            <MdFavoriteBorder size={20} />
                          )
                        }
                        onClick={handleAddToFavorites}
                        disabled={isInFavorites || isPending}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </div>
          </Box>
        </BorderBox>

        <BorderBox className="my-5">
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            className="my-7 px-6 py-5 "
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              alignItems="center"
              gap={2}
            >
              <Avatar
                userImg={productDetail.provider.avatar}
                w={70}
                h={70}
                className="cursor-pointer"
              />
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                sx={{
                  xs: { alignItems: "center" },
                  md: { alignItems: "start" },
                }}
              >
                <BodyTypo
                  bodylabel={productDetail.provider.businessName}
                  fontWeight="bold"
                />
                <Box display="flex" justifyContent="space-between" gap={1}>
                  {user?.id === productDetail.provider.id ? (
                    <Button
                      label="Go to your shop"
                      icon={<AiOutlineShop />}
                      className="bg-primary"
                      onClick={() =>
                        router.push(`/provider/${productDetail.provider.slug}`)
                      }
                    />
                  ) : (
                    <>
                      <Button
                        label="Chat Now"
                        icon={<IoChatboxEllipsesOutline />}
                        className="bg-primary"
                        onClick={() => handleChatClick(productDetail.provider)}
                      />
                      <Button
                        label="Browse Shop"
                        icon={<AiOutlineShop />}
                        onClick={() =>
                          router.push(
                            `/provider/${productDetail.provider.slug}`
                          )
                        }
                      />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              flexGrow={1}
              borderLeft="1px solid #e0e0e0"
              pl={6}
            >
              <Box
                display="grid"
                gridTemplateColumns={["repeat(3,auto)", "repeat(3,auto)"]}
                gap={7}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  outline="none"
                  overflow="visible"
                  position="relative"
                >
                  <FootTypo footlabel="Rating" className="text-sm !mx-0" />
                  <div className="flex items-center text-red font-semibold">
                    <FootTypo
                      footlabel={productDetail.provider.totalRate}
                      className="mr-1"
                    />
                    <IoIosStar />
                  </div>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  outline="none"
                  overflow="visible"
                  position="relative"
                >
                  <FootTypo footlabel="Product" className="text-sm" />
                  <FootTypo
                    footlabel={productDetail.provider.totalProduct}
                    className="text-red"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  outline="none"
                  overflow="visible"
                  position="relative"
                >
                  <FootTypo footlabel="Followers" className="text-sm" />
                  <FootTypo
                    footlabel={productDetail.provider.followersCount}
                    className="text-red"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  outline="none"
                  overflow="visible"
                  position="relative"
                >
                  <FootTypo footlabel="Response time" className="text-sm" />
                  <FootTypo footlabel="80 %" className="text-red" />
                </Box>
              </Box>
            </Box>
          </Box>
        </BorderBox>
        <DescrriptionSection description={productDetail.description} />

        {/* Ratings and Reviews Section */}
        <section className="mt-16 border-t pt-8 relative">
          <BodyTypo
            bodylabel="Ratings, reviews, and reliability"
            className="pb-6"
          />

          {/* Ratings Overview */}
          {isReviewsLoading ? (
            <Box className="w-full my-6 pb-6 text-sm border-b border-gray-200 dark:border-gray-700">
              <Skeleton
                variant="rectangular"
                height={180}
                className="rounded-lg"
              />
            </Box>
          ) : (
            <OverallRating
              overallRating={reviewData?.averageRate || 0}
              rateCount={{
                5: reviewData?.rateCount?.[5] || 0,
                4: reviewData?.rateCount?.[4] || 0,
                3: reviewData?.rateCount?.[3] || 0,
                2: reviewData?.rateCount?.[2] || 0,
                1: reviewData?.rateCount?.[1] || 0,
              }}
              totalReviews={reviewData?.totalCount || 0}
            />
          )}
        </section>

        {/* Overview ReviewSection */}
        <div className="mt-10">
          {isReviewsLoading ? (
            <Box mb={4}>
              <Skeleton
                variant="rectangular"
                height={120}
                className="rounded-lg"
              />
            </Box>
          ) : (
            <ReviewSection
              averageRating={reviewData?.averageRate || 0}
              totalReviews={reviewData?.totalCount || 0}
            />
          )}
        </div>

        {/* Individual Reviews */}
        <Box
          display={{ xs: "block", md: "grid" }}
          gridTemplateColumns={["repeat(1,1fr)", "repeat(2,1fr)"]}
          mt={8}
        >
          {isReviewsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Grid item key={i}>
                  <Box className="mb-6">
                    <Box className="flex items-center gap-3 mb-3">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width={100} className="mb-2" />
                    <Skeleton
                      variant="rectangular"
                      height={60}
                      className="rounded-lg"
                    />
                  </Box>
                </Grid>
              ))}
            </>
          ) : (
            <DataMapper
              data={reviews}
              Component={ReviewCard}
              useGrid={false}
              emptyStateComponent={<EmptyState title="No reviews yet" />}
              getKey={(review) => review.id}
              componentProps={(review) => ({
                id: review.id,
                comment: review.comment,
                rate: review.rate,
                createAt: review.createAt,
                images: review.images?.map((img) => img) || [],
                username: review.name || "User",
                userAvatar: review.avatar || "",
              })}
            />
          )}
        </Box>
      </Container>
    </>
  );
};

export default ProductDetail;

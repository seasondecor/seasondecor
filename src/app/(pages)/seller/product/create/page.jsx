"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import { TbCurrencyDong } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { Field } from "@headlessui/react";
import { useGetProviderBySlug } from "@/app/queries/user/provider.query";
import { useGetListProductCategory } from "@/app/queries/list/category.list.query";
import { useUser } from "@/app/providers/userprovider";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { useCreateProduct } from "@/app/queries/product/product.query";
import { useRouter } from "next/navigation";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import ExampleNumberField from "@/app/components/ui/Select/NumberField";
import { toast } from "sonner";
import { Divider } from "@mui/material";
import { useGetListSeason } from "@/app/queries/list/category.list.query";
import MultiSelectChip from "@/app/components/ui/chip/Chip";
import { TextField, InputAdornment } from "@mui/material";

const ProductCreate = () => {
  const { user } = useUser();
  const router = useRouter();

  const [quantity, setQuantity] = React.useState(1);
  const [images, setImages] = React.useState([]);

  const { data: dataSeason } = useGetListSeason();
  const { data: dataCategory } = useGetListProductCategory();
  const [selectedSeasons, setSelectedSeasons] = React.useState([]);
  const { data: dataProvider } = useGetProviderBySlug(user.slug);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);
  const { mutate: mutationCreate, isPending } = useCreateProduct();

  const handleImageUpload = (files) => {
    const imageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(imageFiles);
  };

  const handleImageDelete = (indexToRemove) => {
    setImages(prevImages => {
      // Revoke the URL of the image being removed
      if (prevImages[indexToRemove]?.preview) {
        URL.revokeObjectURL(prevImages[indexToRemove].preview);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const CategoryOptions =
    dataCategory?.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })) || [];

  const handleSeasonChange = (selectedIds) => {
    setSelectedSeasons(selectedIds);
    setValue("seasonTagsId", selectedIds);
  };

  const handleCategoryChange = (selected) => {
    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryId(selected.value);
      setValue("categoryId", selected.value);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      images: [],
      name: "",
      price: "",
      description: "",
      quantity: quantity,
      madein: "",
      shipForm: dataProvider?.address,
      categoryId: "",
      providerId: "",
    },
  });
  

  const providerId = dataProvider?.id;

  const onSubmit = React.useCallback(
    async (data) => {
      if (!selectedCategoryId) {
        toast.warning("Please select a category before proceeding.");
        return;
      }

      if (images.length === 0) {
        toast.warning("Please upload at least one image.");
        return;
      }

      const formData = new FormData();
      formData.append("ProductName", data.name);
      formData.append("Description", data.description);
      // Convert price string to number by removing commas and converting to integer
      const cleanPrice = data.price.replace(/[,\.]/g, '');
      formData.append("ProductPrice", cleanPrice);
      formData.append("Quantity", quantity);
      formData.append("MadeIn", data.madein);
      formData.append("ShipFrom", data.shipForm);
      formData.append("CategoryId", selectedCategoryId);
      formData.append("ProviderId", providerId);
      formData.append("AccountId", user.id);

      // Append each image file
      images.forEach((img) => {
        formData.append("Images", img.file);
      });

      // Handle season tags
      if (selectedSeasons.length > 0) {
        selectedSeasons.forEach((seasonIds) => {
          formData.append("SeasonIds", seasonIds);
        });
      }

      mutationCreate(formData, {
        onSuccess: () => {
          router.push("/seller/product");
        },
        onError: (error) => {
          console.error("Error creating product:", error);
        },
      });
    },
    [selectedCategoryId, images, mutationCreate, providerId, user.id, router, quantity, selectedSeasons]
  );

  const productName = watch("name");
  const price = watch("price");
  const description = watch("description");

  const madein = watch("madein");
  const shipForm = watch("shipForm");
  const categoryId = watch("categoryId");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (!productName?.trim() || !price?.trim() || !description?.trim()) {
        toast.warning("Please fill in all fields before proceeding.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !quantity ||
        !madein?.trim() ||
        !shipForm?.trim() ||
        !selectedCategoryId ||
        images.length === 0
      ) {
        toast.warning("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };

  return (
    <SellerWrapper>
      <BodyTypo bodylabel="Provide product details" fontWeight="bold" />
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        validateStep={validateStep}
      >
        <Step validateStep={validateStep}>
          <div className="step-1 form-detail">
            <BodyTypo bodylabel="Basic information" fontWeight="bold" />
            <div className="space-y-6 mt-3">
              <div className="form flex flex-col gap-2">
                <FootTypo footlabel="Product Name" />
                <TextField
                  placeholder="Product name"
                  size="small"
                  {...register("name", { required: "Product name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </div>

              <Divider
                textAlign="left"
                sx={{
                  "&::before, &::after": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <FootTypo footlabel="Price & Description" fontWeight="bold" />
              </Divider>

              <div className="form flex flex-col gap-2">
                <FootTypo footlabel="Product Price" />
                <TextField
                  placeholder="Price"
                  size="small"
                  type="text"
                  {...register("price", { 
                    required: "Price is required",
                    validate: {
                      positive: (value) => {
                        // Remove commas and convert to number
                        const numValue = Number(value.replace(/[,\.]/g, ''));
                        return numValue > 0 || "Price must be greater than 0";
                      }
                    }
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TbCurrencyDong size={20} />
                      </InputAdornment>
                    ),
                    inputMode: 'numeric',
                    onChange: (e) => {
                      // Remove non-numeric characters except commas
                      const value = e.target.value.replace(/[^\d]/g, '');
                      if (value) {
                        const formattedValue = new Intl.NumberFormat('vi-VN').format(value);
                        setValue("price", formattedValue);
                      } else {
                        setValue("price", "");
                      }
                    }
                  }}
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </div>

              <div className="form flex flex-col gap-2">
                <FootTypo footlabel="Descriptions" />
                <div className="w-full">
                  <Field>
                    <TipTapEditor
                      value={watch("description") || ""}
                      onChange={(html) => setValue("description", html)}
                      placeholder="Write a detailed description of your product..."
                      className="min-h-[250px] border border-black dark:border-gray-600 rounded-lg"
                    />
                    <input type="hidden" {...register("description")} />
                  </Field>
                  {errors.description && (
                    <p className="text-red text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-2 form space-y-6">
            <Divider
              textAlign="left"
              sx={{
                "&::before, &::after": {
                  borderColor: "primary.main",
                },
              }}
            >
              <FootTypo footlabel="Additional information" fontWeight="bold" />
            </Divider>

            <div className="form flex flex-col gap-2">
              <FootTypo footlabel="Quantity" />
              <div className="w-full max-w-[300px]">
                <ExampleNumberField
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                />
              </div>
            </div>

            <div className="form flex flex-col gap-2">
              <FootTypo footlabel="Origin" />
              <TextField
                placeholder="Made in"
                size="small"
                {...register("madein", { required: "Origin is required" })}
                error={!!errors.madein}
                helperText={errors.madein?.message}
                sx={{
                  width: "100%",
                  maxWidth: "300px",
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </div>

            <div className="form flex flex-col gap-2">
              <FootTypo footlabel="Ship From" />
              <div className="flex flex-col gap-1">
                <TextField
                  defaultValue={dataProvider?.address}
                  size="small"
                  disabled
                  {...register("shipForm", { required: true })}
                  sx={{
                    width: "100%",
                    maxWidth: "300px",
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <FootTypo
                  footlabel="Note: If this is not your address, please update your profile"
                  className="text-gray-500"
                  fontStyle="italic"
                />
              </div>
            </div>

            <div className="form flex flex-col gap-2">
              <FootTypo footlabel="Season Tags" />
              <div className="w-full">
                {dataSeason ? (
                  <MultiSelectChip
                    options={dataSeason.map((season) => ({
                      id: season.id,
                      name: season.seasonName,
                    }))}
                    onChange={handleSeasonChange}
                    label=""
                  />
                ) : (
                  <p>Loading seasons...</p>
                )}
              </div>
            </div>

            <div className="form flex flex-col gap-2">
              <FootTypo footlabel="Category" />
              <div className="w-full max-w-[300px]">
                <DropdownSelectReturnObj
                  options={CategoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  labelKey="label"
                  valueKey="value"
                  returnObject={true}
                  lisboxClassName="mt-10"
                />
              </div>
            </div>

            <Divider
              textAlign="left"
              sx={{
                "&::before, &::after": {
                  borderColor: "primary.main",
                },
              }}
            >
              <FootTypo footlabel="Product Images" fontWeight="bold" />
            </Divider>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full  my-5">
              <FootTypo footlabel="Product Images :" className="sm:w-40" />
              <ImageUpload 
                onImageChange={handleImageUpload}
                onImageDelete={handleImageDelete}
                existingImages={images.map(img => ({
                  dataURL: img.preview,
                  file: img.file
                }))}
              />
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-3 form flex flex-col items-center justify-center p-5">
            <FootTypo footlabel="Our Policy" className="pt-10 pb-5" />

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg w-full shadow-md space-y-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Product Listing Policy
              </h3>
              <p className="text-sm">
                Before creating a product, please ensure that:
              </p>
              <ul className="list-disc text-sm ml-5 mt-2 space-y-5">
                <li>Your product complies with all legal regulations.</li>
                <li>All provided information is accurate and up to date.</li>
                <li>You agree to follow marketplace policies.</li>
                <li>Failure to comply may result in account suspension.</li>
              </ul>
            </div>

            <div className="flex items-center mt-10">
              <input
                type="checkbox"
                {...register("agreePolicy", { required: true })}
                className="mr-2 w-5 h-5"
              />
              <FootTypo footlabel="I have read and agree to the marketplace policies." />
            </div>

            {errors.agreePolicy && (
              <FootTypo
                footlabel="You must agree to proceed."
                className="text-red"
              />
            )}

            <Button2
              onClick={handleSubmit(onSubmit)}
              label="Accept & Procceed"
              btnClass="my-10"
              loading={isPending}
            />
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default ProductCreate;

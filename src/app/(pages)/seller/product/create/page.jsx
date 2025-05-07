"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Input from "@/app/components/ui/Inputs/Input";
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
import { TextField, IconButton } from "@mui/material";
import { FiMinus, FiPlus } from "react-icons/fi";

const ProductCreate = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data: dataCategory } = useGetListProductCategory();

  const { data: dataProvider } = useGetProviderBySlug(user.slug);
  const [images, setImages] = React.useState([]);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

  const { mutate: mutationCreate, isPending } = useCreateProduct();

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
    setValue(
      "images",
      uploadedImages.map((img) => img.url)
    );
    //console.log("Uploaded Images:", uploadedImages);
  };

  const CategoryOptions =
    dataCategory?.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })) || [];

  //console.log("Dropdown Options:", CategoryOptions);

  const handleCategoryChange = (selected) => {
    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryId(selected.value);
      setValue("categoryId", selected.value);
      console.log("Selected Category ID:", selected.value);
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
      quantity: 1,
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
        alert("Please select a category before proceeding.");
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      const formData = new FormData();
      formData.append("ProductName", data.name);
      formData.append("Description", data.description);
      formData.append("ProductPrice", data.price);
      formData.append("Quantity", data.quantity);
      formData.append("MadeIn", data.madein);
      formData.append("ShipFrom", data.shipForm);
      formData.append("CategoryId", selectedCategoryId);
      formData.append("ProviderId", providerId);
      formData.append("AccountId", user.id);

      // ✅ Append each image as a File
      images.forEach((img) => {
        formData.append("Images", img);
      });

      console.log("Submitting FormData:", formData);

      mutationCreate(formData, {
        onSuccess: (response) => {
          console.log("Product created successfully:", response);
          router.push("/seller/product");
        },
        onError: (error) => {
          console.error("Error creating product:", error);
        },
      });
    },
    [selectedCategoryId, images, mutationCreate, providerId, user.id, router]
  );

  const productName = watch("name");
  const price = watch("price");
  const description = watch("description");

  const quantity = watch("quantity");
  const madein = watch("madein");
  const shipForm = watch("shipForm");
  const categoryId = watch("categoryId");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (
        !productName?.trim() ||
        !price?.trim() ||
        !description?.trim() ||
        images.length === 0
      ) {
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !quantity ||
        !madein?.trim() ||
        !shipForm?.trim() ||
        !selectedCategoryId
      ) {
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1) {
      setValue("quantity", numValue);
    }
  };

  const incrementQuantity = () => {
    const currentQuantity = watch("quantity") || 1;
    setValue("quantity", currentQuantity + 1);
  };

  const decrementQuantity = () => {
    const currentQuantity = watch("quantity") || 1;
    if (currentQuantity > 1) {
      setValue("quantity", currentQuantity - 1);
    }
  };

  return (
    <SellerWrapper>
      <FootTypo
        footlabel="Provide product details"
        className="text-lg font-semibold"
      />
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
            <FootTypo
              footlabel="Basic information"
              className="text-2xl font-semibold pt-10 pb-5"
            />
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Product Images :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <ImageUpload onImageChange={handleImageUpload} />
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Product Name :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <Input
                id="name"
                placeholder="Product name"
                required
                className="pl-3 w-full"
                register={register}
              />
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Price :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <Input
                id="price"
                placeholder="Price"
                required
                icon={<TbCurrencyDong size={20} />}
                formatPrice
                control={control}
                register={register}
                className="w-full"
              />
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-start w-full gap-5 my-5">
              <FootTypo
                footlabel="Descriptions :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
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
        </Step>
        <Step>
          <div className="step-2 form space-y-10">
            <FootTypo
              footlabel="Additional information"
              className="text-2xl font-semibold pt-10 pb-5"
            />
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel=" Quantity :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <div className="flex items-center">
                <IconButton 
                  onClick={decrementQuantity} 
                  disabled={watch("quantity") <= 1}
                  size="small"
                >
                  <FiMinus size={16} />
                </IconButton>
                <TextField
                  value={watch("quantity") || 1}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  type="number"
                  variant="outlined"
                  size="small"
                  inputProps={{ 
                    min: 1,
                    style: { textAlign: 'center', padding: '8px 0' } 
                  }}
                  sx={{ 
                    width: '80px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                    '& fieldset': {
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderTop: 'none',
                      borderBottom: '1px solid #e0e0e0'
                    }
                  }}
                />
                <IconButton 
                  onClick={incrementQuantity}
                  size="small"
                >
                  <FiPlus size={16} />
                </IconButton>
              </div>
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel=" Origin :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <Input
                id="madein"
                placeholder="Made in"
                type="text"
                required
                register={register}
                className="pl-3"
              />
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Ship From :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2">
                <Input
                  id="shipForm"
                  placeholder=""
                  defaultValue={dataProvider?.address}
                  disabled={true}
                  required
                  register={register}
                  className="pl-3"
                />
                <FootTypo
                  footlabel="Note: If this is not your address, please update your profile"
                  className="!m-0 text-xs text-gray-500 italic"
                />
              </div>
            </div>
            <div className="form flex flex-col sm:flex-row sm:items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Category :"
                className="!m-0 text-lg font-semibold sm:w-40"
              />
              <DropdownSelectReturnObj
                options={CategoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                labelKey="label"
                valueKey="value"
                returnObject={true}
                lisboxClassName="mt-10"
                className="w-full"
              />
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-3 form flex flex-col items-center justify-center p-5">
            <FootTypo
              footlabel="Our Policy"
              className="text-2xl font-semibold pt-10 pb-5"
            />

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
              <label className="text-sm">
                I have read and agree to the marketplace policies.
              </label>
            </div>

            {errors.agreePolicy && (
              <p className="text-red text-sm mt-2">
                You must agree to proceed.
              </p>
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

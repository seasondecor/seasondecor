"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Input from "@/app/components/ui/Inputs/Input";
import { useForm } from "react-hook-form";
import { Field } from "@headlessui/react";
import { useGetListDecorCategory } from "@/app/queries/list/category.list.query";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { useCreateDecorService } from "@/app/queries/service/service.query";
import { useRouter } from "next/navigation";
import ProvinceDistrictWardSelect from "@/app/(pages)/user/components/ProvinceDropdown";
import { useGetListSeason } from "@/app/queries/list/category.list.query";
import MultiSelectChip from "@/app/components/ui/chip/Chip";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";

const ServiceCreate = () => {
  const router = useRouter();

  const { data: dataCategory } = useGetListDecorCategory();

  const { data: dataSeason } = useGetListSeason();

  const [images, setImages] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [showCalendar, setShowCalendar] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

  const { mutate: mutationCreate, isPending } = useCreateDecorService();

  const [selectedSeasons, setSelectedSeasons] = React.useState([]);

  const handleDateSelect = (date) => {
    // Create a new date object to avoid timezone issues
    const selectedDate = new Date(date);
    //console.log("Selected date:", selectedDate.toDateString());
    setStartDate(selectedDate);
    setValue("startDate", selectedDate);
    setShowCalendar(false);
  };

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
    setValue(
      "images",
      uploadedImages.map((img) => img.url)
    );
    console.log("Uploaded Images:", uploadedImages);
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
      //name: "",
      style: "",
      description: "",
      province: "",
      categoryId: "",
      seasonIds: [],
      startDate: new Date(),
    },
  });

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
      formData.append("Style", data.style);
      formData.append("Description", data.description);

      // Province field contains the combined province and district
      console.log("Sending location to API:", data.province);
      formData.append("Sublocation", data.province);

      formData.append("DecorCategoryId", selectedCategoryId);

      // Add start date to form data
      if (data.startDate) {
        // Fix timezone issue by creating a date with the local date parts
        const localDate = new Date(data.startDate);
        const year = localDate.getFullYear();
        const month = localDate.getMonth() + 1; // getMonth() is 0-indexed
        const day = localDate.getDate();
        
        // Format as YYYY-MM-DD with proper padding
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        console.log("Sending start date to API:", formattedDate);
        formData.append("StartDate", formattedDate);
      }

      // Handle season tags - append each selected season ID
      if (selectedSeasons.length > 0) {
        console.log("Sending season tags to API:", selectedSeasons);
        selectedSeasons.forEach((seasonIds) => {
          formData.append("SeasonIds", seasonIds);
        });
      }

      images.forEach((img) => {
        formData.append("Images", img);
      });

      console.log("Submitting FormData:", formData);

      mutationCreate(formData, {
        onSuccess: (response) => {
          console.log("Service created successfully:", response);
          router.push("/seller/service");
        },
        onError: (error) => {
          console.error("Error creating service:", error);
          alert("Failed to create service. Please try again.");
        },
      });
    },
    [selectedCategoryId, images, mutationCreate, router, selectedSeasons]
  );

  const serviceStyle = watch("style");
  const serviceDescription = watch("description");
  const serviceProvince = watch("province");

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (
        !serviceStyle?.trim() ||
        !serviceProvince?.trim() ||
        !selectedCategoryId ||
        images.length === 0 
      ) {
        console.log(
          "Validation failed",
          serviceStyle,
          serviceProvince,
          selectedCategoryId,
          images.length,
        );
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }

    if (step === 2) {
      if (!serviceDescription?.trim() || !startDate) {
        alert("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };


  const handleSeasonChange = (selectedIds) => {
    setSelectedSeasons(selectedIds);
    setValue("seasonTagsId", selectedIds);
    console.log("Selected Season IDs:", selectedIds);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SellerWrapper>
      <FootTypo
        footlabel="Provide service details"
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
              footlabel="Basic service information"
              className="text-2xl font-semibold pt-10 pb-5"
            />
            <div className="form inline-flex items-center w-full h-full gap-5 my-5">
              <FootTypo
                footlabel="Service Images :"
                className="!m-0 text-lg font-semibold"
              />
              <ImageUpload onImageChange={handleImageUpload} />
            </div>
            
            {/* Two-column grid layout for Style and Available at */}
            <div className="grid grid-cols-2 gap-8 my-5">
              <div className="form flex items-center gap-5">
                <FootTypo
                  footlabel="Service Style :"
                  className="!m-0 text-lg font-semibold w-40"
                />
                <Input
                  id="style"
                  placeholder="Service's style"
                  required
                  className="pl-3 w-full"
                  register={register}
                />
              </div>
              
              <div className="form flex items-center gap-5">
                <FootTypo
                  footlabel="Available at :"
                  className="!m-0 text-lg font-semibold w-40"
                />
                <div className="w-full">
                  <ProvinceDistrictWardSelect
                    setValue={setValue}
                    register={register}
                    combineAsString={true}
                    onChange={(locationString) => {
                      if (typeof locationString === "string") {
                        setValue("province", locationString);
                        console.log("Combined location set to:", locationString);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="form flex items-center w-full gap-5 my-5">
              <FootTypo
                footlabel="Category :"
                className="!m-0 text-lg font-semibold w-40"
              />
              <div className="w-[300px]">
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
          </div>
        </Step>
        <Step>
          <div className="form inline-flex items-start w-full h-full gap-5 my-5">
            <FootTypo
              footlabel="Season Tags :"
              className="!m-0 text-lg font-semibold w-40"
            />
            <div className="w-full">
              {dataSeason ? (
                <MultiSelectChip
                  options={dataSeason.map((season) => ({
                    id: season.id,
                    name: season.seasonName,
                  }))}
                  onChange={handleSeasonChange}
                  label="Select applicable seasons"
                />
              ) : (
                <p>Loading seasons...</p>
              )}
            </div>
          </div>
          <div className="form inline-flex items-start w-full h-full gap-5 my-5">
            <FootTypo
              footlabel="Start Date :"
              className="!m-0 text-lg font-semibold w-40"
            />
            <div className="relative w-[300px]">
              <div
                className="cursor-pointer border border-gray-300 rounded-md p-2 flex justify-between items-center"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <span>{formatDate(startDate)}</span>
                <span>📅</span>
              </div>
              {showCalendar && (
                <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
                  <Calendar
                    date={startDate}
                    onChange={handleDateSelect}
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="form inline-flex items-start w-full h-full gap-5 my-5">
            <FootTypo
              footlabel="Descriptions :"
              className="!m-0 text-lg font-semibold w-40"
            />
            <div className="w-full">
              <Field>
                <TipTapEditor
                  value={watch("description") || ""}
                  onChange={(html) => setValue("description", html)}
                  placeholder="Service descriptions..."
                />
                <input type="hidden" {...register("description")} />
              </Field>
            </div>
          </div>
        </Step>
        <Step>
          <div className="step-3 form flex flex-col items-center justify-center p-5">
            <FootTypo
              footlabel="Our Policy for Creating a Decor Service"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />

            {/* Policy Content */}
            <div className="bg-transparent p-5 rounded-lg w-full shadow-md space-y-5">
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-sm">
                Before creating a decor service, please ensure that:
              </p>
              <ul className="list-disc text-sm ml-5 mt-2 space-y-3">
                <li>Your service complies with all legal regulations.</li>
                <li>All provided information is accurate and up to date.</li>
                <li>You agree to follow marketplace policies.</li>
                <li>Failure to comply may result in account suspension.</li>
              </ul>
            </div>

            {/* Policy Agreement Checkbox */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                {...register("agreePolicy", {
                  required: "You must agree to the policy before proceeding.",
                })}
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

export default ServiceCreate;

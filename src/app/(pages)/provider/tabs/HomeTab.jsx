"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { MdPhone, MdLocationOn, MdDescription } from "react-icons/md";
import { Divider } from "@mui/material";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineWorkOutline } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import { GrCertificate } from "react-icons/gr";
import Image from "next/image";

const HomeTab = ({
  phone,
  address,
  bio,
  skill,
  pastWorkPlaces,
  pastProjects,
  certificateImageUrls = [],
}) => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-6  pb-2">Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <InfoItem
          icon={<MdPhone size={20} />}
          label="Phone Number"
          value={phone || "Not provided"}
        />

        <InfoItem
          icon={<MdLocationOn size={20} />}
          label="Address"
          value={address || "Not provided"}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <MdDescription size={20} />
          <FootTypo footlabel="Bio" fontWeight="bold" />
        </div>
        <div className="whitespace-pre-line">
          <div
            dangerouslySetInnerHTML={{
              __html: bio || "No bio provided.",
            }}
            className="whitespace-pre-line"
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
        <FootTypo footlabel="Experience & Skills" fontWeight="bold" />
      </Divider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <InfoItem
          icon={<BsPersonWorkspace size={20} />}
          label="This provider is skilled in"
          value={skill || "Not provided"}
        />

        <InfoItem
          icon={<MdOutlineWorkOutline size={20} />}
          label="Past Work Places"
          value={pastWorkPlaces || "Not provided"}
        />
      </div>
      <div>
        <FootTypo footlabel="Proider Past Projects" fontWeight="bold" />
        <div className="mt-3">
          <div className="relative">
            <div
              className="whitespace-pre-line relative"
              dangerouslySetInnerHTML={{
                __html: pastProjects || "",
              }}
            />
          </div>
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
        <FootTypo footlabel="Provider Certifications" fontWeight="bold" />
      </Divider>
      <div className="mt-4">
        {certificateImageUrls && certificateImageUrls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certificateImageUrls.map((url, index) => (
              <CertificateItem key={index} imageUrl={url} />
            ))}
          </div>
        ) : (
          <FootTypo footlabel="No certifications provided" className="italic text-gray-400" />
        )}
      </div>
    </div>
  );
};

const CertificateItem = ({ imageUrl }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="relative w-full h-60">
      <Image 
        src={imageUrl} 
        alt="Certificate" 
        layout="fill" 
        objectFit="contain"
        className="rounded-t-lg"
      />
    </div>
    <div className="p-2 flex items-center gap-2">
      <GrCertificate size={20}/>
      <FootTypo footlabel="Certificate" fontWeight="medium"/>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 my-3">
      {icon}
      <FootTypo footlabel={label} fontWeight="bold" />
    </div>
    <FootTypo footlabel={value} className="ml-6" />
  </div>
);

export default HomeTab;

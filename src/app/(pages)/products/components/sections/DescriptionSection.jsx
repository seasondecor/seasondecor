"use client";

import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";

const DescriptionSection = ({ description }) => {
  return (
    <BorderBox>
      <section className="px-3 pt-3">
        <BodyTypo
          bodylabel="DESCRIPTION"
          fontWeight="bold"
        />
        <div 
          className="mt-3 mx-3 mb-3 prose prose-sm md:prose-base max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </section>
    </BorderBox>
  );
};

export default DescriptionSection;

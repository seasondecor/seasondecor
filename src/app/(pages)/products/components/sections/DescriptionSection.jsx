"use client";

import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";

const DescriptionSection = ({ description }) => {
  return (
    <BorderBox>
      <section className="px-3 pt-3">
        <FootTypo
          footlabel="DESCRIPTION"
          className="text-lg !mx-0 font-semibold p-2 bg-primary rounded-lg capitalize w-full"
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

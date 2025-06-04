"use client";

import RotatingText from "./components/ui/animated/Flipword";
import {
  WhiteBgButon,
  BlackBgButton,
} from "./components/ui/Buttons/Button2colors";
import ProductSection from "./components/ui/landing/ProductSection";
import HighlightSection from "./components/ui/landing/HighlightSection";
import ScrollAnimationWrapper from "./components/ScrollAnimation";
import ProviderSign from "./components/ui/landing/ProviderSign";
import MainWrapper from "./components/MainWrapper";
import { ProviderSpotlight } from "./components/ui/landing/ProviderSpotlight";
import { FeaturesSection } from "./components/ui/landing/FeatureSection";
import LandingEndSection from "./components/ui/landing/LandingEndSection";
import { AnimatedTooltip } from "./components/ui/landing/components/AnimatedTooltip";
import { people } from "@/app/constant/people";
import DisclosureSection from "./components/ui/landing/Disclosure";
import { AnimationBackground } from "./components/ui/animated/AnimationBg";
import { Highlight } from "./components/ui/animated/HeroHighlight";

export default function Main() {
  return (
    <>
      <MainWrapper>
        <AnimationBackground>
          <div className="w-full mx-auto relative">
            <>
              <div className="left-wrapper relative pb-4 md:pb-20 flex flex-col items-center justify-center px-8 md:px-8 overflow-hidden pt-28">
                <div className="relative flex flex-col items-center justify-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-20 relative text-center text-zinc-700 max-w-6xl mx-auto !leading-snug dark:text-white">
                    Transform Your Space for Every
                    <span>
                      <br className="hidden md:block" />
                      <div className="flex whitespace-pre gap-3 justify-center items-center">
                        <RotatingText
                          texts={[
                            "Spring",
                            "Summer",
                            "Fall",
                            "Winter",
                            "Tet",
                            "Christmas",
                            "New Year",
                            "Halloween",
                            "Valentine",
                          ]}
                          mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-start rounded-lg w-fit mt-3"
                          staggerFrom={"last"}
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "-120%" }}
                          staggerDuration={0.025}
                          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                          transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400,
                          }}
                          rotationInterval={3000}
                        />
                        Celebration
                      </div>
                    </span>
                  </h1>
                  <div className="relative font-regular text-base md:text-xl text-zinc-500 dark:text-white tracking-wide mb-8 text-center max-w-3xl mx-auto antialiased space-y-4">
                    <p>
                      Connect with <Highlight className="text-black dark:text-white">professional decorators</Highlight> who bring your vision to life. Our platform makes it easy to
                    </p>
                    <p className="flex flex-wrap gap-2 justify-center items-center">
                      <Highlight className="text-black dark:text-white">find the perfect style</Highlight>,
                      <Highlight className="text-black dark:text-white">customize your experience</Highlight>, and
                      <Highlight className="text-black dark:text-white">book with confidence</Highlight>
                    </p>
                  </div>
                  
                  <div className="flex relative sm:flex-row flex-col space-y-2 justify-center dark:text-white sm:space-y-0 sm:space-x-4 sm:justify-center mb-4 w-full">
                    <WhiteBgButon
                      whiteBtnlable="Browse providers"
                      href="/provider"
                    />
                    <BlackBgButton blackBtnlable="Book now" href="/booking" />
                  </div>
                  <div>
                    <h2 className="text-neutral-500 text-center my-4 relative z-40 dark:text-white">
                      Trusted by <Highlight className="text-black dark:text-white">thousands of customers</Highlight> across Vietnam
                    </h2>
                    <div className="flex flex-row items-center justify-center mb-10">
                      <AnimatedTooltip items={people} />
                    </div>
                  </div>
                </div>

                <HighlightSection />
              </div>
            </>
          </div>
        </AnimationBackground>

        {/* <ScrollAnimationWrapper>
          <InspiredSection />
        </ScrollAnimationWrapper> */}

        <ScrollAnimationWrapper>
          <ProductSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <ProviderSign />
        </ScrollAnimationWrapper>
        <ProviderSpotlight />

        <ScrollAnimationWrapper>
          <FeaturesSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <DisclosureSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <LandingEndSection />
        </ScrollAnimationWrapper>
      </MainWrapper>
    </>
  );
}

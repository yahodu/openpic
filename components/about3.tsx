"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import FeatureBlock from "./FeaturesBlock";
import FooterSection from "./FooterSection";

interface About3Props {
  title?: string;
  subTitle?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "People ", value: "2000+" },
  { label: "Memories", value: "3000+" },
  { label: "Happy Partners", value: "99%" },
  { label: "Uptime", value: "99%" },
];

const About3 = ({
  title = "Why OpenPic",
  subTitle = "How OpenPic",
  description = "",
  companiesTitle = "Valued by clients worldwide",
  companies = defaultCompanies,
  achievementsTitle = "We are Happy",
  achievementsDescription = "Helping people relive their memories.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  const [whyOpenPicAnimationData, setWhyOpenPicAnimationData] = useState(null);

  useEffect(() => {
    fetch("/why_openpic_lottie.json")
      .then((response) => response.json())
      .then((data) => setWhyOpenPicAnimationData(data))
      .catch((error) =>
        console.error("Error loading `Why OpenPic animation`:", error)
      );
  }, []);

  return (
    <>
      <section className="py-16">
        <div className="container">
          <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
            <h1 className="text-5xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="grid gap-7 lg:grid-cols-3">
            <div className="size-full relative rounded-3xl overflow-hidden bg-gray-100 lg:col-span-2">
              <Lottie
                animationData={whyOpenPicAnimationData}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
              <h1 className="text-4xl font-semibold text-center md:text-left">
                {subTitle}
              </h1>

              <div className="rounded-3xl overflow-hidden object-cover md:w-1/2 lg:min-h-0 lg:w-full">
                <video width="640" height="240" muted loop autoPlay>
                  <source src="./how_openpic.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          <FeatureBlock />

          {/* <div className="py-32">
          <p className="text-center">{companiesTitle} </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {companies.map((company, idx) => (
              <div className="flex items-center gap-3" key={company.src + idx}>
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8 dark:invert"
                />
              </div>
            ))}
          </div>
        </div> */}
          <div className="bg-muted relative overflow-hidden rounded-xl f p-7 md:p-16">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h2 className="text-3xl font-semibold md:text-4xl">
                {achievementsTitle}
              </h2>
              <p className="text-muted-foreground max-w-xl">
                {achievementsDescription}
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 text-center lg:grid-cols-4">
              {achievements.map((item, idx) => (
                <div className="flex flex-col gap-2" key={item.label + idx}>
                  <span className="text-4xl font-semibold md:text-5xl">
                    {item.value}
                  </span>
                  <p className="text-sm md:text-base">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="w-full">
        <FooterSection />
      </div>
    </>
  );
};

export { About3 };

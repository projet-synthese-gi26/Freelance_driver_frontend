import Image from "next/image";
import { Apple, PlayCircle } from "lucide-react";

const DownloadAppSection = () => {
  return (
    <section className="flex flex-col justify-center items-center py-16 md:py-24 lg:py-36 px-4 md:px-12 lg:px-36 xl:px-44 bg-[#E1E3F64D]">
      <div className="w-full max-w-7xl ">
        <div className="relative flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Left content */}
          <div className="flex flex-col p-6 md:p-10 lg:p-14 gap-4 lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 font-poppins leading-tight tracking-tight">
              Download our App
            </h1>

            <div className="flex flex-col gap-6 md:gap-10">
              <p className="text-lg md:text-xl text-[#606060] font-inter leading-relaxed">
                Join thousands of passengers, drivers, and agencies enjoying
                seamless transportation across Cameroon. Available on iOS and
                Android.
              </p>

              <div className="flex flex-col sm:flex-row justify-between">
                <button className="flex items-center justify-center py-2 px-3 lg:py-[18px] lg:px-6  bg-primary hover:bg-primary-600 text-white rounded-xl">
                  <Image
                    src="/landingpage/apple.png"
                    alt="Apple"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-base lg:text-lg font-medium">Get on App Store</span>
                </button>
                <button className="flex items-center justify-center py-2 px-3 lg:py-[18px] lg:px-6  bg-primary hover:bg-primary-600 text-white rounded-xl">
                  <Image
                    src="/landingpage/googleplay.png"
                    alt="GooglePlay"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-base lg:text-lg font-medium">
                    Get on Google Play
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right content - Image with orange background */}
          <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[433px] bg-secondary-500 lg:rounded-l-[1000px] lg:rounded-r-none flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              <Image
                src="/landingpage/downloadapp-section.png"
                alt="Mobile app screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;

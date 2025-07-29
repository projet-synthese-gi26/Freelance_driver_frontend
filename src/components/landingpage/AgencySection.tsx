import Image from "next/image";

export default function AgencySection() {
  return (
    <section className="flex flex-col lg:flex-row justify-between pt-5 px-4 lg:px-0 pb-30 gap-8 lg:gap-12 max-w-7xl mx-auto">
      {/* Image Container */}
      <div className="w-full lg:w-[616px] order-2 md:order-1 h-[300px] md:h-[500px] lg:h-[676px] relative rounded-2xl overflow-hidden">
        <Image
          src="/landingpage/agency-section.png"
          alt="Nyabugogo Bus Park"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col items-start order-1 md:order-2 gap-5 w-full lg:w-[748px]">
        {/* Tag */}
        <div className="bg-tertiary-50 text-tertiary-600 font-semibold text-base py-2 px-4 rounded-full">
          Letsgo for Agencies
        </div>

        {/* Content */}
        <div className="flex flex-col items-start gap-12 w-full">
          <div className="flex flex-col items-start gap-6 w-full">
            {/* Heading */}
            <h3 className="font-semibold text-2xl md:text-3xl lg:text-4xl text-gray-900 font-poppins leading-tight tracking-tight">
              Simplify Your Operations
            </h3>

            {/* Description */}
            <p className="font-normal text-base md:text-lg lg:text-xl text-gray-600 font-inter leading-relaxed">
              Effortlessly manage your fleet and schedules with our
              user-friendly platform. Streamline bookings, optimize operations,
              and expand your reach to more passengers. Perfect for travel
              agencies and transport companies looking to grow their business.
            </p>
          </div>

          {/* Button */}
          <button className="bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-[18px] rounded-lg text-lg transition-colors">
            Register your agency
          </button>
        </div>
      </div>
    </section>
  );
}

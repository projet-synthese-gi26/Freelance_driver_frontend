import Image from "next/image"

const DriversSection = () => {
  return (
    <section className="flex flex-col lg:flex-row justify-between items-center px-4 lg:px-0  pb-36 gap-8 lg:gap-12 max-w-7xl mx-auto">
      <div className="flex flex-col items-start gap-5 w-full lg:w-[748px]">
        <div className="bg-tertiary-50 text-tertiary-600 font-semibold text-base py-2 px-4 rounded-full">
          Letsgo for Drivers
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            Drive and Earn on Your Terms
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Join a growing network of drivers and earn money on your own schedule. Let's Go connects you with passengers
            and agencies, offering flexible opportunities to grow your income. Plus, enjoy exclusive perks and rewards
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-[18px] rounded-lg text-lg transition-colors">
          Register to drive
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <Image
          src="/landingpage/driver-section.png"
          alt="Young black businessman test drive new car"
          width={616}
          height={676}
          className="rounded-2xl w-full h-auto lg:w-[616px] lg:h-[676px] object-cover"
        />
      </div>
    </section>
  )
}

export default DriversSection


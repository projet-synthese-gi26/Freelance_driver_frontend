import React from 'react'

const PlanDisplay: React.FC = () => {
  return (
    <div className='flex flex-col gap-2 max-w-md mx-auto p-4'>
      <span className='title font-bold text-lg md:text-xl'>My plan</span>
      <p className='opacity-80 text-sm md:text-base'>Change your plan based on your needs</p>
      <div className='flex flex-col border px-4 py-3 rounded-xl'>
        <div className=' flex flex-wrap items-center mb-2'>
          <div className='flex items-center mr-2 mb-1 sm:mb-0'>
            <div className='border rounded-full w-4 h-4 mr-2 border-[0.2rem] border-primary-500'></div>
            <span className='text-sm md:text-base'>Basic</span>
          </div>
          <div className='px-2 py-1 bg-[#98b3ff] text-primary text-xs md:text-sm rounded'>Billed yearly</div>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
          <span className='font-medium text-base md:text-lg'>XAF 30.000</span>
          <span className='opacity-80 text-xs md:text-sm'>(next renewal 24 September 2024)</span>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 font-medium mt-2'>
        <button className='px-3 py-2 text-white bg-primary rounded-xl text-sm md:text-base w-full sm:w-auto'>
          Explore Plans
        </button>
        <button className='px-3 py-2 text-black bg-[#efeffd] rounded-xl text-sm md:text-base w-full sm:w-auto'>
          Manage Plans
        </button>
      </div>
    </div>
  )
}

export default PlanDisplay
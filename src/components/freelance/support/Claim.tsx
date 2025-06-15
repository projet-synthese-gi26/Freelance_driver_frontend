import React from 'react'

const Claim = () => {
  return (
    <div className=" mx-auto p-6 text">
        <form action="" className='flex flex-col'>
            <label htmlFor="name" className='font-medium'>First name & last name *:</label>
            <input type="text" id="name" name="name" required  className='border p-1 mb-2'/>
            <label htmlFor="email" className='font-medium'>Email *:</label>
            <input type="text" id="email" name="email" required  className='border p-1 mb-2'/>
            <label htmlFor="phone" className='font-medium'>Phone (optional):</label>
            <input type="text" id="phone" name="phone"  className='border p-1 mb-2'/>
            <label htmlFor="claim" className='font-medium'>Claim object *:</label>
            <input type="text" id="claim" name="claim" required  className='border p-1 mb-2'/>
            <label htmlFor="claimdes" className='font-medium'>Claim description:</label>
            <textarea name="claimdes" id="claimdes" className='border p-1 mb-2 h-[7rem]'></textarea>
            <div className='flex flex-col'>
                <div >
                    <div>
                        <label htmlFor="" className='mr-7 font-medium'>Post:</label>
                        <input type="checkbox" id="smail" name="smail" required  className='mr-2'/>
                        <label htmlFor="smail" className='mr-5'>email</label>
                        <input type="checkbox" id="whatsapp" name="whatsapp" required  className='mr-2'/>
                        <label htmlFor="whatsapp" className='mr-5'>whatsapp</label>
                        <input type="checkbox" id="receive" name="receive" required  className='mr-2'/>
                        <label htmlFor="receive">receive a copy</label>
                    </div>
                </div>
                <div className='flex space-x-5 mt-5'>
                    <button type="submit" className='bg-[#3880FF] text-white w-[7rem] p-2 rounded-md'>Submit</button>
                    <button type="reset" className='bg-[#F3F3F3] text-black w-[7rem] p-2 rounded-md'>Reset</button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Claim
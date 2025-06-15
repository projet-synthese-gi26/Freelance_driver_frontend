"use client"
import Accordion2 from "@/components/customer/security/Accordion2";
import Accordion4 from "@/components/customer/security/Accordion4";
import Toggle from '@/components/freelance/security/Toggle';

const Page = () => {
  
  return (
    <div className='text p-4'>
      <h1 className="title font-bold mb-4">Account Security</h1>
      <Accordion2/>
      <div className="grid grid-cols-2 gap-4 my-8">
        <Toggle label="Use 2 Factor Authentication" description="We'll ask for a login code if we notice an attempted login from
        an unrecognized device or browser"/>
        <Toggle label="Get alerts about unrecognized logins" description="We'll let you know if anyone logs in from a device or browser
        you don't usually use"/>
      </div>
      <Accordion4/>
    </div>
  )
}

export default Page

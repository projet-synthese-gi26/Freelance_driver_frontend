import React from 'react'

const Fifth = () => {
  return (
    <div className='space-y-4'>
        <div>
            <span className='title font-medium'>1. Acceptance of Terms</span>
            <p className='pl-4'>By accessing or using the <b>Letsgo Freelance Driver</b> platform,
                 you agree to be bound by these General Terms of Use.
                 If you do not agree with any part of these terms, you must not use the platform.</p>
        </div>
        <div>
            <span className='title font-medium'>2. Definitions</span>
            <ul className='pl-10 list-disc'>
                <li>
                    <span className='font-medium'>Platform:</span> 
                    Refers to the <b>Letsgo Freelance Driver</b> website and mobile application
                </li>
                <li>
                    <span className='font-medium'>User:</span> 
                    Any individual who accesses or uses the Platform, including customers and drivers.
                </li>
                <li>
                    <span className='font-medium'>Customer:</span>  
                    An individual who requests transportation services through the Platform.
                </li>
                <li>
                    <span className='font-medium'>Driver:</span>
                    An individual who provides transportation services via the Platform.
                </li>
            </ul>
        </div>
        <div>
            <span className='title font-medium'>3. Eligibility</span>
            <p className='pl-4'>You must be at least 18 years old to use the Platform.
             By using the Platform, you represent and warrant that you
              meet this age requirement.</p>
        </div>
        <div>
            <span className='title font-medium'>4. User Accounts</span>
            <ul className='pl-10 list-disc'>
                <li>Users must create an account to access certain features of the Platform.</li>
                <li>You are responsible for maintaining the confidentiality of your account information
                     and for all activities that occur under your account.</li>
                <li>You agree to notify Letsgo Freelance Driver immediately of any unauthorized use of your account.</li>
            </ul>
        </div>
        <div>
            <span className='title font-medium'>5. Services</span>
            <p className='pl-4'>Letsgo Freelance Driver acts as an intermediary between
             customers and drivers. The Platform facilitates the connection
             for transportation services but is not a party to any agreement
              between customers and drivers.</p>
        </div>
    </div>
  )
}

export default Fifth
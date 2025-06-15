import React from 'react'

const page = () => {
  return (
    <div className='text container mx-auto px-4 py-6'>
        <div className='flex flex-col mt-5'>
            <span className='bigtitle my-3'>Yowyob Legal: <span className='font-semibold'>Your Personal Information</span> for Letsgo Freelance Driver</span>
            <div className='flex flex-col'>
                <span><b>Effective Date:</b> August 17, 2024</span>
                <span><b>Company Name:</b> Yowyob Inc. Ltd.</span>
                <span><b>Company website url:</b> <a href="https://yowyob.com"><u>https://yowyob.com</u></a></span> 
                <span><b>Platform Address:</b> <a href="https://driver.yowyob.com "><u>https://driver.yowyob.com </u></a></span>
            </div>
        </div>
        <div className='my-5'>
    <div className='space-y-4'>
        <div>
            <span className='title font-medium'>Introduction</span>
            <p className='pl-4'>At Yowyob Inc. Ltd., we prioritize the privacy
             and security of your personal information. This section outlines how we collect,
             use, protect, and disclose your information while detailing your responsibilities
             and the available dispute resolution mechanisms.</p>
        </div>
        <div>
            <span className='title font-medium'>Key Responsibilities and Obligations of Users</span>
            <ol className='pl-10 list-decimal'>
                <li>
                    <span> Accurate Information</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users are responsible for providing accurate and
                         up-to-date personal information during account
                         registration and service usage.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Account Security</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users must maintain the confidentiality of their account
                         credentials and notify Yowyob Inc. Ltd.
                         immediately of any unauthorized access or suspicious activity.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Respectful Interaction</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users are expected to engage respectfully with drivers and other users,
                         adhering to platform guidelines and policies.
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
        <div>
            <span className='title font-medium'>Handling User Privacy and Data Protection</span>
            <ol className='pl-10 list-decimal'>
                <li>
                    <span>Information Collection</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Yowyob Inc. Ltd. collects personal information such as your name, contact details,
                         payment information, and location data to facilitate services and improve user experience.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Use of Information</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Collected information is used for processing transactions, communicating with users,
                         personalizing experiences, ensuring security, and complying with legal obligations.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Data Sharing</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Personal information may be shared with trusted third-party service providers, legal authorities when required,
                         or during business transactions. User consent will be obtained where necessary.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Data Security</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        We implement robust security measures to protect your personal information from unauthorized access and data breaches, including encryption and secure server protocols.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>User Rights</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users have the right to access, correct, or delete their personal information at any time by contacting our support team.
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
        <div>
            <span className='title font-medium'>Dispute Resolution Mechanisms</span>
            <ol className='pl-10 list-decimal'>
                <li>
                    <span>Internal Resolution</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users are encouraged to resolve disputes directly with the involved parties through open communication.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Support Team Assistance</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        If disputes cannot be resolved amicably, users may contact Yowyob Inc. Ltd.'s support team for mediation and assistance.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Formal Complaints</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users can submit formal complaints regarding privacy concerns or disputes to our designated privacy officer at <a href="support@yowyob.com"><u>support@yowyob.com</u></a>.
                        </li>
                    </ul>
                </li>
                <li>
                    <span>Legal Recourse</span>
                    <ul className='pl-10 list-disc'>
                        <li>
                        Users retain the right to seek legal recourse if disputes remain unresolved through internal mechanisms.
                        </li>
                    </ul>
                </li>
            </ol>
        </div>
        <div>
            <span className='title font-medium'>Conclusion</span>
            <p className='pl-4'>Yowyob Inc. Ltd. is committed to protecting your personal information while ensuring a safe and efficient experience on the Letsgo Freelance Driver platform. By adhering to the outlined responsibilities and utilizing the available dispute resolution mechanisms, users can contribute to a positive community environment.</p>
        </div>
        <div>
            <span className='title font-medium'>Contact Information</span>
            <p className='pl-4'>For any questions regarding this <b>Your Personal Information</b>, please contact us at:</p>
            <ul className='pl-10 list-disc'>
                <li>Yowyob Inc. Ltd.</li>
                <li>Email: <a href="support@yowyob.com">support@yowyob.com</a></li>
                <li>Website: <a href="https://yowyob.com ">https://yowyob.com </a></li>
            </ul>
        </div>
    </div>
    </div>
    </div>
  )
}

export default page
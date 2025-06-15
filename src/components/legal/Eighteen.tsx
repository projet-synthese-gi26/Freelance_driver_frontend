import Link from 'next/link'
import React from 'react'

const Eighteen = () => {
  return (
    <div className='space-y-4 mt-4'>
        <div>
        <span className='title font-medium'>11. Invoicing</span>
        <p className='pl-4'>
        Customers who require invoices for accounting purposes
         must notify <b>Letsgo Freelance Driver prior to service completion</b>.
        Invoices will be generated and provided in accordance with applicable
        laws.
        </p>
        </div>
        <div>
            <span className='title font-medium'>12. Dispute Resolution</span>
            <ul className="list-disc pl-10">
                <li>In the event of a dispute between users (customers and drivers), we encourage users to attempt to resolve the matter amicably.</li>
                <li>If a resolution cannot be reached, users may submit their dispute to the <b>Letsgo Freelance Driver</b> support team for mediation.</li>
                <li>Users may also seek resolution through applicable legal channels as per local laws.</li>
            </ul>
        </div>
        <div>
            <span className='title font-medium'>13. Limitation of Liability</span>
            <p className='pl-4'>
            <b>Letsgo Freelance Driver</b> is not liable for any direct, indirect, incidental,
            or consequential damages arising from your use of the Platform or services
            provided by drivers. Users agree to use the Platform at their own risk.
            </p>
        </div>
        <div>
            <span className='title font-medium'>14. Indemnification</span>
            <p className='pl-4'>
            You agree to indemnify and hold harmless Letsgo Freelance Driver,
            its affiliates, and its employees from any claims, damages, losses,
            liabilities, and expenses arising from your use of the Platform or 
            violation of these Terms.
            </p>
        </div>
        <div>
            <span className='title font-medium'>15. Amendments: Modifications to Terms</span>
            <p className='pl-4'>
            Letsgo Freelance Driver reserves the right to modify these Terms at any time.
            Users will be notified of any changes, and continued use of the Platform constitutes
             acceptance of the modified Terms.
            </p>
        </div>
        <div>
            <span className='title font-medium'>16. Governing Law</span>
            <p className='pl-4'>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Yowyob Inc. Ltd operates.
            </p>
        </div>
        <div>
            <span className='title font-medium'>17. Contact Information</span>
            <p className='pl-4'>
            For questions or concerns regarding these Terms, please contact us at <Link href={`mailto:support@yowyob.com`}><u>support@yowyob.com</u></Link>. 
            </p>
        </div>
        <div>
            <span className='title font-medium'>18. Platform Address</span>
            <p className='pl-4'>
            You can access the Platform at: <Link href='https://driver.yowyob.com'><u>https://driver.yowyob.com</u></Link>. 
            </p>
        </div>
    </div>
  )
}

export default Eighteen
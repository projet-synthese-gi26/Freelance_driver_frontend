"use client";
//import Pagination from "@/components/vendor-dashboard/Pagination";
//import Footer from "@/components/vendor-dashboard/Vendor.Footer";
import { Payment } from "@/app/(pricing)/components/datas/types";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  TrashIcon
} from "@heroicons/react/24/outline";
import axios, { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Page = () => {  
    const [payments, setPayments] = useState<Payment[]>([]);
  
    useEffect(() => {
      const fetchPayments = async () => {
        try {
          const response = await axios.get<any, AxiosResponse<any>>('http://localhost:5000/histories');
          setPayments(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des paiements :', error);
        }
      };
  
      fetchPayments();
    }, []);
  return (
    <div className="bg-[var(--bg-2)]">
      {/* Recent bookings */}
      <section className="bg-[var(--bg-2)] px-3 lg:px-6 pb-4 lg:pb-6 mt-4 lg:mt-6">
        <div className="p-3 sm:p-4 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white">
          <div className="flex flex-wrap gap-2 justify-between mb-7">
            <h3 className="h3">Recent Payments</h3>
            {/* <Link
              href="/"
              className="text-primary font-semibold flex items-center gap-2">
              View All <ArrowRightIcon className="w-5 h-5" />
            </Link> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2 xl:px-4">Payment Code</th>
                  <th className="py-3 lg:py-4 px-2">Amount</th>
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Author</th>
                  <th className="py-3 lg:py-4 px-2">Offer</th>
                  <th className="py-3 lg:py-4 px-2">method</th>
                  <th className="py-3 lg:py-4 px-2">status</th>

                </tr>
              </thead>
              <tbody>
                {payments.map(
                  (payment) => (
                    <tr
                      key={payment.paymentId}
                      className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                      <td className="py-3 lg:py-4 px-2 xl:px-4">{payment.paymentId}</td>
                      <td className="py-3 lg:py-4 px-2 text-primary">
                        {payment.amount}
                      </td>
                      <td className="py-3 lg:py-4 px-2">{payment.startDate}</td>
                      <td className="py-3 lg:py-4 px-2">{payment.userId}</td>

                      <td className={`py-3 lg:py-4 px-2`}>
                        <div className={`w-32`}>
                          {/* <HeadlessList initialValue={status} /> */payment.category}
                        </div>
                      </td>
                      <td className="py-3 lg:py-4 px-2">
                        <span className="flex gap-1 items-center">
                          <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
                          {payment.methodType}
                        </span>
                      </td>
                      <td className="py-3 lg:py-4 px-2">
                        <button className="text-primary px-2">
                          {/* <PencilSquareIcon className="w-5 h-5" /> */payment.status}
                        </button>
                        <button className="text-[var(--secondary-500)] px-2">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {/* {<Pagination />} */}
            
          </div>
        </div>
      </section>

      {/* <section className="grid grid-cols-12 gap-4 lg:gap-6 px-4 lg:px-6 pb-4 lg:pb-6">
        <div className="col-span-12 lg:col-span-6 p-3 sm:p-4 md:py-6 lg:py-8 md:px-8 lg:px-10 border rounded-2xl bg-white">
          <div className="flex justify-between flex-wrap gap-3 items-center mb-6">
            <h3 className="h3">Room Notifications</h3>
            <div className="flex items-center flex-wrap gap-3">
              <span>Sort By:</span>
              <div className="p-3 border rounded-full ml-2">
                <select className="focus:outline-none">
                  <option value="1">Hotel</option>
                  <option value="2">Car</option>
                  <option value="3">Resort</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Hotel Name</th>
                  <th className="py-3 lg:py-4 px-2">Date</th>
                  <th className="py-3 lg:py-4 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminRecentListings.map(({ id, date, name, status }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                    <td
                      className="py-3 lg:py-4 px-2 
 lg:px-4">
                      {name}
                    </td>
                    <td className="py-3 lg:py-4 px-2">{date} - 24/07/2023</td>
                    <td className={`py-3 lg:py-4 px-2`}>
                      <div className={`w-32`}>
                        <HeadlessList initialValue={status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 py-6 lg:py-8 px-8 lg:px-10 border rounded-2xl bg-white">
          <div className="flex justify-between flex-wrap gap-3 items-center mb-6">
            <h3 className="h3">Upcoming Arrivals</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <span>Sort By:</span>
              <div className="p-3 border rounded-full ml-2">
                <select className="focus:outline-none">
                  <option value="1">Newest</option>
                  <option value="2">Price</option>
                  <option value="3">Oldest</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left bg-[var(--bg-1)] border-b border-dashed">
                  <th className="py-3 lg:py-4 px-2">Invoice ID</th>
                  <th className="py-3 lg:py-4 px-2">Name</th>
                  <th className="py-3 lg:py-4 px-2">Room</th>
                  <th className="py-3 lg:py-4 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {adminRecentListings.map(({ id, date, agent, status }) => (
                  <tr
                    key={id}
                    className="border-b border-dashed hover:bg-[var(--bg-1)] duration-300">
                    <td className="py-3 lg:py-4 px-2">#1033{id}</td>
                    <td className="py-3 lg:py-4 px-2">{agent}</td>
                    <td className={`py-3 lg:py-4 px-2`}>Room 24A</td>
                    <td className="py-3 lg:py-4 px-2">{date} - 24/07/2023</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination />
          </div>
        </div>
      </section> */}
      {/* Footer */}
      {/*<Footer />*/}
    </div>
  );
};

export default Page;

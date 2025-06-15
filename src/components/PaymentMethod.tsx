import React, { ChangeEvent, useState } from 'react'
import Image from "next/image";
import { useSearchParams } from 'next/navigation';


const PaymentMethod = () => {
    const searchParams = useSearchParams();
    const data = searchParams.get("data");
    const plan = data ? JSON.parse(data) : null;

    const date = new Date(Date.now());
    const expiryDate = new Date();

    expiryDate.setMonth(date.getMonth() + plan.duration);
    const [isActive, setIsActive] = useState(0);
    const [credentialConfirmed, confirmCredential] = useState(false);

    const [methodType, setmethodType] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expirationDate, setExpirationDate] = useState("")
    const [cvc, setCvc] = useState("")
    const [provider, setProvider] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [paypalEmail, setPaypalEmail] = useState("")

    const handleData = () => {
        confirmCredential(!credentialConfirmed);
        if (methodType === "card") {
            setProvider("")
            setPhoneNumber("")
            setPaypalEmail("")
        } else {
            if (methodType === "mobile") {
                setCardNumber("")
                setCvc("")
                setExpirationDate("")
                setPaypalEmail("")
            } else {
                setCardNumber("")
                setCvc("")
                setExpirationDate("")
                setPhoneNumber("")
                setProvider("")
            }

        }
    }

    const handleCardNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setCardNumber(e.target.value)
    }
    const handleExpireDate = (e: ChangeEvent<HTMLInputElement>) => {
        setExpirationDate(e.target.value)
    }
    const handleCvc = (e: ChangeEvent<HTMLInputElement>) => {
        setCvc(e.target.value)
    }
    const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    }
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setPaypalEmail(e.target.value)
    }


    return (
        <div className="bg-white rounded-2xl p-3 sm:p-4 lg:px-6 lg:py-4 mb-3">
            <h4 className="mb-4 font-semibold"> Payment methods </h4>
            <ul className="flex flex-wrap items-center gap-3">
                <li>
                    <div className="flex items-center gap-2">
                        <button
                            className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 0 ? "bg-blue-700 text-white" : ''} `}
                            onClick={() => {
                                setIsActive(0);
                                setmethodType("card")
                            }}
                        >
                            <Image
                                src={"/img/credit-card.png"}
                                alt="Icone"
                                width={30}
                                height={30}
                            />
                            <label
                                className="inline-block font-medium cursor-pointer"
                                htmlFor="credit-card"
                            >
                                Credit card
                            </label>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="flex items-center gap-2">
                        <button
                            className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 1 ? "bg-blue-700 text-white" : ''} `}
                            onClick={() => {
                                setIsActive(1);
                                setmethodType("card")
                            }}
                        >
                            <Image
                                src={"/img/debit-card.png"}
                                alt="Icone"
                                width={30}
                                height={30}
                            />
                            <label
                                className="inline-block font-medium cursor-pointer"
                                htmlFor="debit-card"
                            >
                                Debit card
                            </label>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="flex items-center gap-2">
                        <button
                            className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 2 ? "bg-blue-700 text-white" : ''} `}
                            onClick={() => {
                                setIsActive(2);
                                setmethodType("paypal")
                            }}
                        >
                            <Image
                                src={"/img/paypal-transparent.png"}
                                alt="Icone"
                                width={30}
                                height={30}
                            />
                            <label
                                className="inline-block font-medium cursor-pointer"
                                htmlFor="paypal"
                            >
                                Paypal
                            </label>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="flex items-center gap-2">
                        <button
                            className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 3 ? "bg-blue-700 text-white" : ''} `}
                            onClick={() => {
                                setIsActive(3);
                                setmethodType("mobile")
                                setProvider("MTN Mobile Money");
                            }}
                        >
                            <Image
                                src={"/img/mobile--money.png"}
                                alt="Icone"
                                width={30}
                                height={30}
                            />
                            <label
                                className="inline-block font-medium cursor-pointer"
                                htmlFor="Mobile-Money"
                            >
                                Mobile Money
                            </label>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="flex items-center gap-2">
                        <button
                            className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 4 ? "bg-blue-700 text-white" : ''} `}
                            onClick={() => {
                                setmethodType("mobile")
                                setProvider("Orange Money")
                                setIsActive(4);
                            }}
                        >
                            <Image
                                src={"/img/orange-money.png"}
                                alt="Icone"
                                width={30}
                                height={30}
                            />
                            <label
                                className="inline-block font-medium cursor-pointer"
                                htmlFor="Orange-Money"
                            >
                                Orange Money
                            </label>
                        </button>
                    </div>
                </li>
            </ul>
            <div className="border border-dashed my-4"></div>

            {isActive < 2 && (
                <>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <label
                                htmlFor="card-number"
                                className="font-medium block mb-1"
                            >
                                Card number
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-2 px-5"
                                placeholder="2456 1665 5155 5151"
                                id="card-number"
                                value={cardNumber}
                                onChange={handleCardNumber}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label
                                htmlFor="expiry-date"
                                className="font-medium block mb-1"
                            >
                                Expiry date
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                                placeholder="DD/MM/YY"
                                id="expiry-date"
                                value={expirationDate}
                                onChange={handleExpireDate}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label
                                htmlFor="cvc"
                                className=" font-medium block mb-1"
                            >
                                CVC / CVV
                            </label>
                            <input
                                type="number"
                                className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                                placeholder="3 digits"
                                id="cvc"
                                value={cvc}
                                onChange={handleCvc}
                            />
                        </div>
                        <div className="col-span-12 mb-3">
                            <label
                                htmlFor="card-name"
                                className="font-medium block mb-1"
                            >
                                Name on card
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                                placeholder="Jab Archur"
                                id="card-name"
                            />
                        </div>
                    </div>

                </>
            )}
            {isActive > 2 && (
                <div className="grid grid-cols-12 gap-4 text lg:gap-6 " >

                    <div className="col-span-12 md:col-span-6">
                        <label
                            htmlFor="expiry-date"
                            className=" font-medium block mb-1"
                        >
                            First name
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                            placeholder="UBALDI"
                            id="expiry-date"

                        />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <label
                            htmlFor="cvc"
                            className="font-medium block mb-1"
                        >
                            Last name
                        </label>
                        <input
                            type="text"
                            className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                            placeholder="UBALDINI"
                            id="cvc"
                        />
                    </div>

                    <div className="col-span-12 flex gap-3 h-70 bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5 mb-3"

                    >
                        <Image
                            src={"/img/cameroon.jpeg"}
                            alt="Icone"
                            width={30}
                            height={30}
                        />
                        <input
                            type="text"
                            placeholder="+237 699 71 87 51"
                            value={phoneNumber}
                            onChange={handlePhone}
                            className="w-[80%] bg-[var(--bg-1)] focus:outline-none rounded-lg py-1 px-5"
                        />
                    </div>



                </div>
            )}
            {isActive == 2 && (
                <>
                    <div className="grid grid-cols-12 text gap-4 lg:gap-6">
                        <div className="col-span-12">
                            <label
                                htmlFor="card-number"
                                className="font-medium block mb-1"
                            >
                                Paypal email
                            </label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5 mb-3"
                                placeholder="abc@example.com"
                                id="paypalEmail"
                                value={paypalEmail}
                                onChange={handleEmail}
                            />
                        </div>
                    </div>

                </>
            )}
            <a
                className={`link inline-flex items-center gap-2 py-3 px-6 rounded-lg  text-white :bg-primary-400 hover:text-white font-medium w-full justify-center ${credentialConfirmed ? 'bg-neutral-700' : "bg-primary"}`}

                onClick={() => {
                    handleData()

                }} >
                <span className="inline-block">  {credentialConfirmed ? "Credentials Confirmed" : 'Confirm Credentials'} </span>
            </a>
        </div>
    )
}

export default PaymentMethod
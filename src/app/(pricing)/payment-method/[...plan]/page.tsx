"use client";
import _features from "@/app/(pricing)/components/datas/features";
import { Data } from "@/app/(pricing)/components/datas/types";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const Page = ({ params }: { params: { plan: string[] } }) => {
  ;
  const profile = parseInt(params.plan[0]);
  const choice =(_features [profile])[params.plan[1]]
  const months = parseInt(params.plan[2]);

  const myfeatures = choice.description;
  const transaction_id = "20p524";
  const date = new Date(Date.now());
  const subscription_date = date.toLocaleString();
  const tax = 4;
  const subtotal = choice.prix * months;
  const service_charge = 10;
  const promo=20;
  const expiryDate = new Date();

  expiryDate.setMonth(date.getMonth() + months);
  const router = useRouter()
  const [isActive, setIsActive] = useState(0);
  const [addressValidated, validateAddress] = useState(false);
  const [credentialConfirmed, confirmCredential] = useState(false);
  const [paymentLaunched,launchPayment] = useState(false);
  const [promocode,setPromocode]=useState("");
  const [promo_discount,setPromo_discount]=useState(0);
  const [name,setName]=useState("")
  const [AdressEmail,setAdressEmail]=useState("")
  const [message,setMessage]=useState("")
  const [paid, setPaid] = useState(false)


  //Backend
  const [methodType,setmethodType]=useState("")
  const [cardNumber,setCardNumber]=useState("")
  const [expirationDate,setExpirationDate]=useState("")
  const [cvc,setCvc]=useState("")
  const [provider,setProvider]=useState("")
  const [phoneNumber,setPhoneNumber]=useState("")
  const [paypalEmail,setPaypalEmail]=useState("")
  const [amount,setAmount]=useState(0)
  const [duration,setDuration]=useState(0)
  const [category,setCategory]=useState("")
  const [paymentDate,setPayementDate]=useState("")
  const [status,setStatus]=useState("")
  const [endDate,setEndDate]=useState("")
  const [startDate,setStartDate]=useState("")
  const [payId,setPaymentId]=useState("")

  const data={
    userId: "ec9e4f82-f7d9-4624-aed6-34ad54e795c9",
    startDate: startDate,
    endDate :endDate,
    status: status,
    paymentDate:paymentDate,
    category:category,
    amount:amount,
    duration:duration,
    methodType:methodType,
    cardNumber:cardNumber,
    expirationDate:expirationDate,
    cvc:cvc,
    provider:provider,
    phoneNumber:phoneNumber,
    paypalEmail:paypalEmail,
    paymentMethodId:payId
  }
  const handleData=()=>{
    confirmCredential(!credentialConfirmed);
    setAmount(total_payable_amount)
    setDuration(months)
    setCategory(choice.title.toUpperCase())
    setStatus("Active")
    setPayementDate(subscription_date)
    setStartDate(subscription_date)
    setEndDate(expiryDate.toLocaleString())
    if (methodType==="card") {
      setProvider("")
      setPhoneNumber("")
      setPaypalEmail("")
    } else {
      if (methodType==="mobile" ) {
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

  const sendData: Data = {
    transaction_amount: amount,
    transaction_currency: 'XAF',
    transaction_reason: 'Souscription sur placewise',
    customer_phone_number: phoneNumber,
    customer_name: name,
    customer_email: AdressEmail,
    customer_lang: 'fr',
  };


  const validate=async()=>{
    await axios.post("http://localhost:5000/subscription/create",data,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
    ).then((response)=>{
      console.log(response.status);
      handleApply()
    })
        .catch((error)=>{
          console.log(error);

        })
  }

  async function  proceedToPayment() : Promise<Boolean> {
    const res = await axios.post<any, AxiosResponse<any>>('https://my-coolpay.com/api/118a4852-7df8-46d9-834b-23b4ef25aaab/paylink', sendData)
    // Ouvrir une nouvelle fenêtre
    const newWindow = window.open(res.data.payment_url, '_blank', 'width=800,height=600');

    // Écouter l'événement "loadstart" pour détecter le début du chargement de la nouvelle URL
//   newWindow?.addEventListener('loadstart', () => {
//   console.log('La nouvelle fenêtre a commencé à charger une nouvelle URL.');

//  // Fermer la nouvelle fenêtre
//  newWindow?.close();
// });
    console.log('https://my-coolpay.com/api/118a4852-7df8-46d9-834b-23b4ef25aaab/checkStatus/'+res.data.transaction_ref);
    setPaymentId(res.data.transaction_ref)

    const result = await fetch('https://my-coolpay.com/api/118a4852-7df8-46d9-834b-23b4ef25aaab/checkStatus/'+res.data.transaction_ref)
    ;
    let resutat = await result.json()
    console.log(resutat);
    const startTime = Date.now();

    //Écouter l'événement "load" pour détecter la fin du chargement de la nouvelle URL
    while (!(resutat.transaction_status=== 'SUCCESS')||!(resutat.transaction_status=== 'FAILED')) {
      if(Date.now() - startTime > 30000) break
      // Effectuer des actions dans la boucle
      console.log('waiting 3s');
      console.log(resutat.transaction_status);

      setTimeout(() => {
        console.log('nouvelle tentative...'+(Date.now() - startTime )/1000);
      }, 3000);
      const result = await fetch('https://my-coolpay.com/api/118a4852-7df8-46d9-834b-23b4ef25aaab/checkStatus/'+res.data.transaction_ref)
      ; resutat = await result.json()
      console.log(resutat);

    }
    if (resutat.transaction_message === 'Votre transaction a été effectuée avec succès !' || resutat.transaction_status=== 'SUCCESS') {
      setPaid(true)  }

    console.log(paid);
// if (newWindow) {
//   newWindow.addEventListener('unload', () => {
//     newWindow.close();
//   });

//   newWindow.addEventListener('beforeunload', () => {
//     newWindow.close();
//   });
// }

    if (newWindow) {
      newWindow.addEventListener('unload', () => {
        newWindow.close();
      });

      newWindow.addEventListener('beforeunload', () => {
        newWindow.close();
      });
    }


    return paid;
  }


  const handleCardNumber =(e:ChangeEvent<HTMLInputElement>)=>{
    setCardNumber(e.target.value)
  }
  const handleExpireDate=(e:ChangeEvent<HTMLInputElement>)=>{
    setExpirationDate(e.target.value)
  }
  const handleCvc=(e:ChangeEvent<HTMLInputElement>)=>{
    setCvc(e.target.value)
  }
  const handlePhone=(e:ChangeEvent<HTMLInputElement>)=>{
    setPhoneNumber(e.target.value)
  }
  const handleEmail=(e:ChangeEvent<HTMLInputElement>)=>{
    setPaypalEmail(e.target.value)
  }

  const handlePromoCode=(e:ChangeEvent<HTMLInputElement>)=>{
    setPromocode(e.target.value)
  }

  const handleName=(e:ChangeEvent<HTMLInputElement>)=>{
    setName(e.target.value)
  }
  const handleAddressEmail=(e:ChangeEvent<HTMLInputElement>)=>{
    setAdressEmail(e.target.value)
  }

  const handleApply=async()=>{
    await axios.get("http://localhost:5000/get_promo")
        .then(async(response)=>{
          const results=response.data
          console.log(results);

          const res=results.find((result:any)=>result.code===promocode)
          console.log(res);

          if (res) {
            // setPromo_discount(res.discount)
            const newstate={code: res.code, validity: res.validity, discount: res.discount, status: 'inactive', startDate:Date.now()}
            await axios.post("http://localhost:5000/delete_promo",res)
                .then((response)=>{
                  console.log(response);
                })
                .catch((error)=>{
                  console.log(error);
                })

            await axios.post("http://localhost:5000/save_promo",newstate)
                .then((response)=>{
                  console.log(response);
                })
                .catch((error)=>{
                  console.log(error);

                })
          }else{
            if (promocode ==="") {
              setMessage("Enter a code")
            } else {
              setMessage("This promo code is already used or not available")
            }

            console.log("don't exist");
          }
        })
        .catch((error)=>{
          console.log(error);

        })
  }
//Backend
  const handleGoBack = () => {
    router.back()
  }

  let total_payable_amount =subtotal-(subtotal*(promo_discount/100))

  // subtotal *
  // (1 - tax / 100) *
  // (1 + service_charge / 100) *
  // (1 - promo_discount / 100);
  total_payable_amount= parseFloat(total_payable_amount.toFixed(3))

  function getPaymentDatas() {
      }
  function handleFailure() {

    alert("sectionfail")  }

  function handleSuccess() {
    const customMsg = "payment succeeded"
    alert(customMsg)
    validate()
  }

  return (
      <div className="py-[30px] text lg:py-[60px] bg-[var(--bg-2)] px-3 font-Inter">
        <div className="container">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 lg:col-span-6">
              <div className="pb-lg-0">
                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                  <div className="flex items-center justify-between gap-5 mb-1">
                    <span className="mb-0 text font-bold"> {choice.title.toUpperCase()} Plan </span>
                    <span className="x-4 px-4 text font-semibold">
                      {total_payable_amount} FCFA / {months==1 ? "mois" : months==3? 'trimestre':'An' }
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-4 md:gap-3 mb-8">
                    <div className="col-span-12 md:col-span-12">

                      <div className="border border-dashed my-2"></div>
                    </div>

                    {myfeatures.map((valeur: string, index: number) => (
                        <div key={index} className="col-span-12 md:col-span-12">
                          <div className="border border-neutral-40 rounded-2xl bg-[var(--bg-1)] py-1 px-4 px-xxl-8">
                            <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="clr-neutral-400 inline-block text">
                            {valeur}
                          </span>
                              <i className="text-xl las la-check text-primary"></i>
                            </div>
                          </div>
                        </div>
                    ))}

                    {}
                  </div>
                  <div>
                    <button onClick={handleGoBack}>Retour</button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
                  <h4 className="mb-3 text font-semibold">
                    {" "}
                    Billing address{" "}
                  </h4>
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <p className="mb-0">
                      Transaction ID:
                      <span className="text-primary">{transaction_id}</span>
                    </p>
                    <p className="mb-0">
                      Total Payable Amount:
                      <span className="text-primary">{total_payable_amount}</span>
                    </p>
                  </div>
                  <div className="border border-dashed my-3"></div>
                  <div className="grid grid-cols-12 gap-4 lg:gap-3 text">
                    <div className="col-span-12 md:col-span-6">
                      <input
                          type="text"
                          className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                          placeholder="Enter Name"
                          value={name}
                          onChange={handleName}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <input
                          type="email"
                          className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                          placeholder="Enter Email"
                          value={AdressEmail}
                          onChange={handleAddressEmail}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <input
                          type="text"
                          className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                          placeholder="Enter Phone Number"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="rounded-lgborder bg-[var(--bg-1)] pr-4">
                        <select
                            className="w-full bg-transparent px-5 py-2 focus:outline-none"
                            aria-label="Default select example"
                        >
                          <option>Maroua</option>
                          <option value="1">Yaounde</option>
                          <option value="2">Douala</option>
                          <option value="3">Edea</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12">
                    <textarea
                        rows={5}
                        className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-lg focus:outline-none py-3 px-6"
                        placeholder="Enter Address"
                    ></textarea>
                    </div>

                  </div>

                  <a
                      className={`link inline-flex items-center gap-2 py-3 px-6 rounded-lg  text-white :bg-primary-400 hover:text-white font-medium w-full justify-center ${addressValidated? 'bg-neutral-700':"bg-primary"}`}

                      onClick={() => {
                        validateAddress(!addressValidated);
                      }} >
                    <span className="inline-block">  {addressValidated? "Address Validated": 'Validate Address'} </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">


              <div className="bg-white rounded-2xl p-3 sm:p-4 lg:px-6 lg:py-4 mb-3">
                <h4 className="mb-4 font-semibold"> Payment methods </h4>
                <ul className="flex flex-wrap items-center gap-3">
                  <li>
                    <div className="flex items-center gap-2">
                      <button
                          className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 0 ? "bg-blue-700 text-white": '' } `}
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
                          className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 1 ? "bg-blue-700 text-white": '' } `}
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
                          className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 2 ? "bg-blue-700 text-white": '' } `}
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
                          className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 3 ? "bg-blue-700 text-white": '' } `}
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
                          className={`flex items-center gap-2 h-10 p-2 rounded-lg hover:bg-blue-700 hover:text-white border-2 border-gray-500 hover:border-blue-700 p-4 ${isActive == 4 ? "bg-blue-700 text-white": '' } `}
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
                        />
                      </div>



                    </div>
                )}
                {isActive == 2 &&(
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
                    className={`link inline-flex items-center gap-2 py-3 px-6 rounded-lg  text-white :bg-primary-400 hover:text-white font-medium w-full justify-center ${credentialConfirmed? 'bg-neutral-700':"bg-primary"}`}

                    onClick={() => {
                      handleData()

                    }} >
                  <span className="inline-block">  {credentialConfirmed? "Credentials Confirmed": 'Confirm Credentials'} </span>
                </a>
              </div>
              <div className="bg-white rounded-2xl text p-3 sm:p-4 lg:p-6 mb-6">
                <h4 className="mb-3 font-semibold">
                  {" "}
                  Enter Promo Code{" "}
                </h4>
                <p className="italic text-[red]">{message}</p>
                <div className="p-2 rounded-full border border-neutral-40 bg-[var(--bg-2)] mb-4">
                  <form action="#" className="flex items-center">
                    <input
                        value={promocode}
                        onChange={handlePromoCode}
                        type="text"
                        placeholder="Promo Code"
                        className="w-full border-0 bg-transparent text-[var(--neutral-700)] px-3 py-1 ::placeholder-neutral-600 focus:outline-none"
                    />
                    <button
                        type="button"
                        className="grid place-content-center px-3 py-2 rounded-full bg-primary text-white border-0"
                        onClick={async()=>{
                          await axios.get("http://localhost:5000/get_promo")
                              .then(async(response)=>{
                                const results=response.data
                                console.log(results);

                                const res=results.find((result:any)=>result.code===promocode)
                                console.log(res);
                                if (res) {
                                  setPromo_discount(res.discount)
                                  setMessage("")
                                }else{

                                  if (promocode ==="") {
                                    setMessage("Enter a code")
                                  } else {
                                    setMessage("This promo code is already used or not available")
                                  }
                                }
                              })
                              .catch((error)=>{
                                console.log(error);
                              })
                        }}
                    >
                      Apply
                    </button>
                  </form>
                </div>
                <span className="block text-[var(--neutral-700)]">
                {promo} % Off Discount
              </span>
              </div>
              <div className="bg-white rounded-2xl p-3 mb-6 sm:p-4 lg:p-6 border">
                <h4 className="mb-0 font-semibold">Order summary</h4>
                <div className="border border-dashed my-2"></div>
                <ul className="gap-4">
                  <li className="flex items-center justify-between flex-wrap">
                    <p className="mb-0">Subscription date</p>
                    <p className="mb-0 font-medium">{subscription_date}</p>
                  </li>

                  <li className="flex items-center justify-between flex-wrap">
                    <p className="mb-0">Renewal date</p>
                    <p className="mb-0 font-medium">
                      {expiryDate.toLocaleString()}
                    </p>
                  </li>
                  <div className="border border-dashed my-2"></div>

                  <li className="flex items-center justify-between flex-wrap">
                    <p className="mb-0">Subtotal</p>
                    <p className="mb-0 font-medium">{subtotal} FCFA</p>
                  </li>
                  <div className="border border-dashed my-3"></div>

                  {/* <li className="flex items-center justify-between flex-wrap">
                  <p className="mb-0">Service charge</p>
                  <p className="mb-0 font-medium">{service_charge} %</p>
                </li>

                <li className="flex items-center justify-between flex-wrap">
                  <p className="mb-0">Tax</p>
                  <p className="mb-0 font-medium">{tax} %</p>
                </li> */}
                  <li className="flex items-center justify-between flex-wrap">
                    <p className="mb-0">Promo Code</p>
                    <p className="mb-0 font-medium">{promo_discount} %</p>
                  </li>
                </ul>
                <div className="border border-dashed my-2"></div>
                <div className="flex items-center justify-between flex-wrap mb-6">
                  <p className="mb-0">Payable Now</p>
                  <p className="mb-0 font-medium">{total_payable_amount} FCFA</p>
                </div>
                <Link
                    href="" legacyBehavior
                >
                  <a
                      className={`link inline-flex items-center gap-2 py-3 px-6 rounded-lg  text-white :bg-primary-400 hover:text-white font-medium w-full justify-center ${paymentLaunched? 'bg-neutral-700':"bg-primary"}`}

                      onClick={async () => {

                        if(addressValidated && credentialConfirmed){
                          const infos = getPaymentDatas()
                          const result = await proceedToPayment()
                          result? handleSuccess() : handleFailure()
                        }
                        if(!credentialConfirmed){
                          alert("you must confirm your credentials !")
                        }else{
                          if(!addressValidated){
                            alert("you must validate your address!")
                          }
                        }


                      }} >
                    <span className="inline-block">  {paymentLaunched? "payment on process ... waiting for response": 'Launch Payment'} </span>
                  </a>

                </Link>
              </div>


            </div>
          </div>
        </div>
      </div>
  );
};

export default Page;
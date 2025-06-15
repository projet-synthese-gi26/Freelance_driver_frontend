import React, { ChangeEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PromoComponent = () => {
  const [loading, setLoading] = useState(false);
  const router=useRouter()
  const [promocode, setPromocode] = useState("");
  const [message, setMessage] = useState("")
  const [promo_discount, setPromo_discount] = useState(0)

  const handlePromoCode = (e: ChangeEvent<HTMLInputElement>) => {
    setPromocode(e.target.value)
  }


  const handleApply = async () => {
    setLoading(true);
    try {
      const response = await axios.get(process.env.SERVER_URL + '/promocodes');
      const results = response.data;
      const res = results.find((result: any) => result.code === promocode);

      if (res) {
        setPromo_discount(res.discount);

        await axios.put(process.env.SERVER_URL + '/promocodes/use/' + res.id);

        const query = new URLSearchParams({
          code: JSON.stringify(res.code),
          discount:JSON.stringify(res.discount)
        }).toString();

        window.dispatchEvent(new Event("promo-applied"));
        router.replace(`/payment-method?${query}`);
      } else {
        setMessage(promocode === "" ? "Enter a code" : "Invalid or used promo code");
      }

    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {loading ? (
            <div className="custom_loader_ring" />
          ) : (
            <button
              type="button"
              className="grid place-content-center px-3 py-2 rounded-full bg-primary text-white border-0"
              onClick={handleApply}
            >
              Apply
            </button>
          )}


        </form>
      </div>
      <span className="block text-[var(--neutral-700)]">
        {promo_discount} % Off Discount
      </span>
    </div>
  )
}

export default PromoComponent
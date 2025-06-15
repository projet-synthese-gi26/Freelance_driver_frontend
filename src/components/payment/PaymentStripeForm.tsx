import {redirect, useRouter, useSearchParams} from "next/navigation";
import React from "react";

const PaymentStripeForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        Product_id,
        Amount,
        Currency,
        Reason
    } = Object.fromEntries(searchParams);

    async function createInvoice(formData: FormData) {
        let url: string = "";
        const rawFormData = {
            product_id: Product_id,
            price: formData.get("price"),
            description: formData.get("description"),
        };

        console.log(rawFormData);
        console.log("================================");
        try {
            const response = await fetch("http://localhost:8080/api/links_pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rawFormData),
            });

            // Handle response if necessary
            const data = await response.json();
            console.log(data);
            if (data.status == "success") {
                url = data.payment_url;
                console.log(url);
            }
            // ...
        } catch (error) {
            // Handle error if necessary
            console.error(error);
        }
        //TODO: commenter la ligne if(url !== "")redirect(url) pour tester le service de reservation
        if (url !== "") redirect(url);
    }

    return (
        <form
            action="#"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createInvoice(formData);
            }}
        >
            <div>
                <label htmlFor="price" className="text font-medium block mx-2">
                    Transaction Amount
                </label>
                <input
                    type="numeric"
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    placeholder=""
                    id="price"
                    name="price"
                    value={Amount}
                    readOnly
                />
            </div>

            <div>
                <label
                    htmlFor="transaction_currency"
                    className="text font-medium block mb-0"
                >
                    Transaction Currency
                </label>
                <input
                    type="numeric"
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    value={Currency}
                />
            </div>

            <div>
                <label
                    htmlFor="descriptionr"
                    className="text font-medium block mx-2"
                >
                    Transaction Reason
                </label>
                <textarea
                    className="w-full h-40 bg-[var(--bg-1)] font-medium text g border border-neutral-40 rounded-md py-3 px-4 focus:outline-none"
                    id="description"
                    name="description"
                    value={Reason}
                    readOnly
                />
            </div>

            <button
                type="submit"
                className=" inline-flex items-center title gap-2 mt-6 lg:mt-8 py-3 px-6 rounded-md bg-primary text-white hover:bg-blue-700 font-semibold text w-full justify-center mb-6 "
            >
                Complete payment
            </button>
        </form>
    );
};

export default PaymentStripeForm;
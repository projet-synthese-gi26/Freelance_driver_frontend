import {redirect, useSearchParams} from "next/navigation";
import React from "react";

const PaymentCoolPayForm = () => {
    const searchParams = useSearchParams();
    const {
        id,
        Amount,
        Currency,
        Reason
    } = Object.fromEntries(searchParams);

    async function createInvoice(formData: FormData) {
        /* 'use server' */
        let url: string = "";
        const rawFormData = {
            transaction_amount: formData.get("transaction_amount"),
            transaction_currency: formData.get("transaction_currency"),
            transaction_reason: formData.get("transaction_reason"),
            customer_phone_number: formData.get("customer_phone_number"),
            customer_name: formData.get("customer_name"),
            customer_email: formData.get("customer_email"),
            customer_lang: formData.get("customer_lang:"),
        };

        console.log(rawFormData);
        console.log("================================");
        // ENREGISTREMENT DE LA RESERVATION EN BD : SERVICE DE RESERVATION
        let reservationDto = {
            userId: "550e8400-e29b-41d4-a716-446655440000", // TODO: remplacer par l'ID de l'utilisateur courant
            driverId: "123e4567-e89b-12d3-a456-426614174000", // TODO: remplacer par l'ID du chauffeur (recuperable à partir de l'ID du planing)
            planningId: id,
        };

        try {
            const response = await fetch(
                "https://my-coolpay.com/api/5a219fd9-b249-4a58-b362-1448584ffb42/paylink",
                {
                    method: "POST",
                    body: JSON.stringify(rawFormData),
                }
            );

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
        <form action={createInvoice}>
            <div>
                <label
                    htmlFor="transaction_amount"
                    className="text font-medium block mb-0"
                >
                    Transaction Amount
                </label>
                <input
                    type="numeric"
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    id="transaction_amount"
                    name="transaction_amount"
                    value={Amount}
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
                    id="transaction_currency"
                    name="transaction_amount"
                    value={Currency}
                />
            </div>

            <div>
                <label
                    htmlFor="transaction_reason"
                    className="text font-medium block mb-0"
                >
                    Transaction Reason
                </label>
                <textarea
                    className="w-full h-40 bg-[var(--bg-1)] font-medium text-lg border border-neutral-40 rounded-md py-3 px-4 focus:outline-none"
                    id="transaction_reason"
                    name="transaction_reason"
                    value={Reason}
                    readOnly // Facultatif : si le champ est en lecture seule
                />
            </div>

            <div>
                <label
                    htmlFor="customer_phone_number"
                    className="text font-medium block mb-2"
                >
                    Phone Number
                </label>
                <input
                    type="text"
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    id="customer_phone_number"
                    name="customer_phone_number"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="customer_name"
                    className="text font-medium block mb-0"
                >
                    Name
                </label>
                <input
                    type="text"
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    id="customer_name"
                    name="customer_name"
                />
            </div>

            <div>
                <label
                    htmlFor="customer_email"
                    className="text font-medium block mb-0"
                >
                    Email
                </label>
                <input
                    type="text"
                    className="w-full bg-[var(--bg-1)] text border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    id="customer_email"
                    name="customer_email"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="customer_lang"
                    className="text font-medium block mb-0"
                >
                    Language
                </label>
                <select
                    className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-md py-3 px-5 focus:outline-none"
                    id="customer_lang"
                    name="customer_lang"
                >
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                </select>
            </div>
            <button
                type="submit"
                className=" inline-flex items-center gap-2 mt-6 lg:mt-8 py-3 px-6 rounded-md bg-primary title text-white hover:bg-blue-700 font-semibold text-xl w-full justify-center mb-6 "
            >
                Complete payment
            </button>
        </form>
    );
};

export default PaymentCoolPayForm;
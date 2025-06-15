import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../../firebase/server";


export type User={
    email_verified:boolean;
    has_completed_onboarding:boolean; 
    is_selected:boolean;
    phone_number:string;
    registration_date:string;
    user_email:string;
    user_id:string;
    user_type:"public" | "customer" | "driver" | "administrator";
}

const default_user:User[] = [{
    email_verified: false,
    has_completed_onboarding: false,
    is_selected: false,
    phone_number: "12345",
    registration_date: new Date().toLocaleDateString(),
    user_email: "user@example.com",
    user_id: "AAAAZERY1245",
    user_type: "public",
    },
    {
        email_verified: false,
        has_completed_onboarding: true,
        is_selected: false,
        phone_number: "67890",
        registration_date: new Date().toLocaleDateString(),
        user_email: "user@example.com",
        user_id: "AAAAZERY1245",
        user_type: "public",
    }
]

export async function GET(request:NextRequest) {
    try {

        if (!firestore) {
            return new NextResponse("Internal Error",
                {
                    status:500
                }
            )
        }
        const response=await firestore.collection("users").get()
        const data=response.docs.map((doc) => doc.data())
        return NextResponse.json(data)
    } catch (error) {
        return new NextResponse("Internal Error",
            {
                status:500
            }
        )
    }
}
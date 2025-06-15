import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../firebase/server";
import { User} from "./app/api/scylla/route";
import axios from "axios";
function hasPermission(role: string, path: string): boolean {
    // L'administrateur a tous les droits
    if (role === 'administrator') {
        return true;
    }

    // Vérification des permissions pour le driver
    if (role === 'driver') {
        if (path.startsWith('/freelance-dashboard') || path.startsWith('/customer-dashboard')) {
            return true; // Le driver a accès aux deux
        }
        return false; // Le driver n'a pas d'accès à d'autres chemins
    }

    // Vérification des permissions pour le customer
    if (role === 'customer') {
        if (path.startsWith('/customer-dashboard')) {
            return true; // Le customer a accès à son propre tableau de bord
        }
        return false; // Le customer n'a pas d'accès à d'autres chemins
    }

    // Si aucun rôle ne correspond, on retourne false par défaut
    return false;
}


export async function middleware(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    const email = cookieStore.get('email')?.value;
    const phone = cookieStore.get('phone')?.value;
    let onboarding: boolean | undefined;
    let data: User | undefined;

    await axios.get('http://localhost:3000/api/scylla')
    .then((response)=>{
        const currentUser:User=response.data.find((user: User) => user.user_email===email || user.phone_number===phone)
        if (currentUser) {
            onboarding = currentUser.has_completed_onboarding;
            data = currentUser;
        }
    }).catch((error)=>{
        console.log(error)
    });

    if(data){
        const path = request.nextUrl.pathname;
        const userRole = data.user_type || "public"
        
        if (!hasPermission(userRole[userRole.length-1], path)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/customer-dashboard/:path*', '/freelance-dashboard/:path*','/admin-dashboard/:path*'],
  };
import { useEffect, useState } from "react";
import { userInterface ,userData} from "@/type/user";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { onSnapshot } from "@firebase/firestore";
import { doc } from "firebase/firestore";

export default function useAuth() {
    const [authUser, setAuthUser] = useState<userInterface | null>(null);
    const [authUserIsLoading, setAuthUserIsLoading] = useState(true);

    const getUserData = async (user: userInterface) => {
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            onSnapshot(userRef, (doc) => {
                const compactUser=user;
                if (doc.exists()) {
                    compactUser.userData = doc.data() as userData;
                }

                setAuthUser((prevAuthUser)=>({
                    ...prevAuthUser,
                    ...compactUser
                }));

                setAuthUserIsLoading(false);
            });
        }
        else {
            setAuthUser(null);
            setAuthUserIsLoading(false);
        }

    }

    const authStateChanged = async (authState: User | null) => {
        if (!authState) {
            setAuthUser(null);
            setAuthUserIsLoading(false);
            return;
        }

        setAuthUserIsLoading(true);
        const formattedUser = formattedAuthUser(authState);
        await getUserData(formattedUser);
    }

    const formattedAuthUser = (user: User): userInterface => ({
        user_id: user.uid,
        user_email: user.email,
        // phone_number: user.phoneNumber,
        emailVerified:user.emailVerified


    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { authUser, authUserIsLoading };
}

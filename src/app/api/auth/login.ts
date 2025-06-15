import {
    signInWithEmailAndPassword,
    AuthError,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    sendPasswordResetEmail, signOut, getAuth, deleteUser
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import ErrorMessageFormat from "@/app/api/auth/util";
import {FirebaseError} from "@firebase/app";

let appVerifier: RecaptchaVerifier | null = null;

export const loginWithEmailAndPassword=async ( email: string, password: string,rememberMe:boolean)=> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {data: userCredential.user}
    } catch (error) {
        const authError = error as AuthError;
        const msg=ErrorMessageFormat( authError.code);
        return {
            error:{
                code: authError.code,
                message: msg,
            }

        }
    }

}


function onCaptchaVerify(phone:string,password:string,rememberMe:boolean) {
    if (typeof window !== 'undefined' && !appVerifier) {
        return  new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size:"normal",
                callback: (response: any) => {
                    loginWithPhoneNumber(phone, password, rememberMe).then(r  =>{});
                },
                "expired-callback": () => {
                    console.log('expired');
                },


            }
        );


        // window.recaptchaVerifier.render()
    }
    return null;
}

export const loginWithPhoneNumber=async (phone:string,password: string,rememberMe:boolean)=> {
    try {

        appVerifier= onCaptchaVerify(phone,password,rememberMe);
        // const appVerifier = window.recaptchaVerifier;

        if (!appVerifier) {
            throw new Error("reCAPTCHA not initialized");
        }

        const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
        if (typeof window !== 'undefined') {
            window.confirmationResult = confirmationResult;
        }
        return {data: true}
    } catch (error) {
        const Error = error as FirebaseError;
        const msg = ErrorMessageFormat(Error.code);
        console.log("new error")
        return {

            error: {
                code: Error.code,
                message: msg,
            }

        }

    }

}



export const resetPassword =async ( email: string) => {

    try {

        await sendPasswordResetEmail(auth, email)

        return {data:true}
    }

    catch (error) {
        const Error = error as FirebaseError;
        const msg=ErrorMessageFormat( Error.code);
        return {
            error:{
                code: Error.code,
                message: msg,
            }

        }
    }
};

export const logout = async () => {
    await signOut(auth);
};

export async function deleteAccount(email:string, password:string) {
    const auth = getAuth();

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ensuite, supprimez le compte
        await deleteUser(user);
        return {data: true}

    }  catch (error) {
        const Error = error as FirebaseError;
        const msg = ErrorMessageFormat(Error.code);
        return {
            error: {
                code: Error.code,
                message: msg,
            }

        }

    }
}

export const  LogOut=async ()=>{
    try {



        // Ensuite, supprimez le compte
        await signOut(auth);
        return {data: true}


    }  catch (error) {
        const Error = error as FirebaseError;
        const msg = ErrorMessageFormat(Error.code);
        return {
            error: {
                code: Error.code,
                message: msg,
            }

        }

    }

}

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile,updatePhoneNumber, PhoneAuthProvider} from "firebase/auth";
import {auth} from "@/app/lib/firebase";
import ErrorMessageFormat from "@/app/api/auth/util";
import {FirebaseError} from "@firebase/app";


export const register = async (email: string,phoneNumber:string, password: string,isSelected:boolean) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // // Mettre à jour le numéro de téléphone
        // if (phoneNumber) {
        //     // Note: Cette partie nécessite une vérification par SMS
        //     // Vous devrez implémenter la logique pour obtenir le verificationId et le code
        //     const phoneCredential = PhoneAuthProvider.credential(verificationId, smsCode);
        //     await updatePhoneNumber(user, phoneCredential);
        // }


        await sendEmailVerificationProcedure();
        return {data:user}
    }  catch (error) {
        const Error = error as FirebaseError;
        const msg=ErrorMessageFormat( Error.code);
        return {
            error:{
                code: Error.code,
                message: msg,
            }

        }
    }
}

export const sendEmailVerificationProcedure = async () => {
    if(auth.currentUser) {
        try
        {
            await sendEmailVerification(auth.currentUser);
            return {
                data: true,
            };
        }
    catch(error)
        {
            const firebaseError = error as FirebaseError;
            const errorMessage = ErrorMessageFormat(firebaseError.code);
            return {
                error: {
                    code: firebaseError.code,
                    message: errorMessage,
                }
            };
        }
    }else{
        return {
            error: {
                code: "unknown error",
                message: "Error occurred...",
            }
        };
    }
};
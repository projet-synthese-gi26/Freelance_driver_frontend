import { doc, setDoc,updateDoc } from 'firebase/firestore';
import { db } from "@/app/lib/firebase";
import {FirebaseError} from "@firebase/app";
import ErrorMessageFormat from "@/app/api/auth/util";

export const createUserData=async (
    collectionName: string,
    user_id: string,
    userData: object
)=>{
    try {
        const userRef = doc(db, collectionName, user_id);
        await setDoc(userRef, userData);
       // await updateDoc(userRef, userData);
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

export const updateUserData=async (
    collectionName: string,
    user_id: string,
    userData: object
)=>{
    try {
        const userRef = doc(db, collectionName, user_id);
        await updateDoc(userRef, userData);
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
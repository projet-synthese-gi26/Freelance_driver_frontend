import { initializeApp } from "firebase-admin";
import { getApps, ServiceAccount } from "firebase-admin/app";
import * as admin from 'firebase-admin';
import serviceAccount from "./serviceAccount.json"
import { Firestore, getFirestore } from "firebase-admin/firestore";

let firestore:Firestore | undefined=undefined

const currentApps=getApps()

if(currentApps.length<=0){
    const app=admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount)
    })
    firestore=getFirestore(app)
}
else{
    firestore=getFirestore(currentApps[0])
}

export {firestore}
import {LogOut} from "@/app/api/auth/login";
// import {toast} from "react-toastify";
 import {toast} from "react-hot-toast";
 import Cookies from 'js-cookie';


export const handleSignOUt=async ()=>{
    const {error}=await LogOut();
    if(error){
        toast.error(error.message)
        return;

    }

    Cookies.remove('authToken');
    Cookies.remove('email');
    Cookies.remove('phone');

    toast.success("You have been logged out successfully!")
}
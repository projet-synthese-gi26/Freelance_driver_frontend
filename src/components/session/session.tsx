import {useAuthContext} from "@/components/context/authContext";
import ScreenSpinner from "@/components/general/ScreenSpinner";
import {useRouter} from "next/navigation";



interface Props{
    children:React.ReactNode;
    sessionStatus?:string;
}

export const Session=({children,sessionStatus}:Props)=>{
    const router=useRouter();
    const {authUser,authUserIsLoading} = useAuthContext()
    if(sessionStatus==="registered" || sessionStatus==="authenticated" && !authUserIsLoading){
        if(authUser){
            return  <>{children}</>
        }
        else{
            router.push('/login')
        }
    }


    if(!sessionStatus && !authUserIsLoading){
        return <>{children}</>}

   return <ScreenSpinner/>


}
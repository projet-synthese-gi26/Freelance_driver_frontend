
// import {toast} from "react-toastify";
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie';


    // Déconnexion backend non implémentée
    Cookies.remove('authToken');
    Cookies.remove('email');
    Cookies.remove('phone');
    toast.success("Vous avez été déconnecté (stub, non implémenté côté serveur)");

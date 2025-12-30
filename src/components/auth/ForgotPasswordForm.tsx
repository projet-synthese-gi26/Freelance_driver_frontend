// import {toast} from "react-toastify";
import { toast } from "react-hot-toast";

interface ForgotPasswordFormProps {
    onSignInClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}



interface ForgotPasswordFormProps {
    onSuccess: () => void;
    onSignUpClick: (callback: () => void) => void;
    onSignInClick: (callback: () => void) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
                                                                          onSuccess,
                                                                          onSignInClick,
                                                                          onSignUpClick,
                                                                      }) => {
    

    

     return (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <h2>Fonctionnalité non implémentée</h2>
              <p>La réinitialisation du mot de passe n'est pas disponible pour le moment.</p>
            </div>
          );
};


          
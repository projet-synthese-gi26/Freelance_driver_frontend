// import {toast} from "react-toastify";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("Auth.forgotPassword.form");

     return (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <h2>{t("title")}</h2>
              <p>{t("description")}</p>
            </div>
          );
};


          
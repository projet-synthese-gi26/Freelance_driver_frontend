

export default function ErrorMessageFormat( code:string):string{

    switch (code) {
        case "auth/invalid-email":
            return "Invalid email format.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/user-not-found":
            return "This email does not exist on our platform";
        case "auth/wrong-password":
            return "Incorrect email or password.";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";
        case "auth/code-expired":
            return "Verification code has expired.";
        case "auth/invalid-phone-number":
            return "Invalid phone number format.";
        case "auth/missing-phone-number":
            return "Phone number is required.";
        case "auth/invalid-verification-code":
            return "Invalid verification code.";
        case "auth/operation-not-allowed":
            return "Phone sign-in is not enabled. Please contact support.";
        case 'auth/captcha-check-failed':
            return "reCAPTCHA verification failed. Please try again.";
        case "auth/email-already-in-use":
            return "Email already in use.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        default:
            return "An error occurred. Please try again.";
    }
}
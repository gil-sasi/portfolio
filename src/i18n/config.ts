import { sign } from "crypto";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      projects: "Projects",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      adminPanel: "Admin Panel",
      loggedInAs: "Logged in as",
      signUp: "Sign Up",
      fullName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      signupFailed: "Signup failed",
      confirmPassword: "Confirm Password",
      passwordMismatch: "Passwords do not match",
      invalidEmail: "Invalid email address",
    },
  },
  he: {
    translation: {
      home: "דף הבית",
      projects: "פרויקטים",
      contact: "צור קשר",
      login: "התחברות",
      signup: "הרשמה",
      logout: "התנתקות",
      adminPanel: "פאנל ניהול",
      loggedInAs: "מחובר בתור",
      signUp: "הרשמה",
      fullName: "שם פרטי",
      lastName: "שם משפחה",
      email: "אימייל",
      password: "סיסמה",
      signupFailed: "הרשמה נכשלה",
      confirmPassword: "אשר סיסמה",
      passwordMismatch: "הסיסמאות אינן תואמות",
      invalidEmail: "כתובת אימייל לא חוקית",
      invalidPassword: "סיסמה לא חוקית",
      invalidName: "שם לא חוקי",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng:
    typeof window !== "undefined"
      ? localStorage.getItem("i18nextLng") || "en"
      : "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

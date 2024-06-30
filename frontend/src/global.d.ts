// src/global.d.ts
interface Window {
    grecaptchaCallback: (response: string) => void;
    grecaptcha: any;
    recaptchaLoaded: () => void;
  }
  
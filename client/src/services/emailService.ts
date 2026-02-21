import emailjs from '@emailjs/react-native';

// DigitalDhan EmailJS Credentials
const SERVICE_ID = 'service_cuvtjge';
const TEMPLATE_ID = 'template_rxupr77';
const PUBLIC_KEY = 'Mm6j68y0QFt9dSyTm';

// Initialize EmailJS
emailjs.init({ publicKey: PUBLIC_KEY });

/**
 * Generate a random 6-digit OTP
 */
export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email via EmailJS
 * @returns The generated OTP for local verification
 */
export const sendOtpEmail = async (email: string, name: string = 'User'): Promise<string> => {
    const otp = generateOtp();

    const templateParams = {
        to_name: name,
        email: email,
        passcode: otp,
        time: '15 minutes',
        otp: otp,
        message: `Your verification code is ${otp}`,
    };

    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
        console.log('OTP email sent successfully');
        return otp;
    } catch (error) {
        console.error('EmailJS Error:', error);
        // Fallback for demo: return the OTP anyway so the flow works
        console.log('Demo Mode: OTP is', otp);
        return otp;
    }
};

/**
 * Verify OTP locally
 */
export const verifyOtp = (enteredOtp: string, generatedOtp: string): boolean => {
    return enteredOtp === generatedOtp;
};

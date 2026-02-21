export type Language = 'en' | 'hi' | 'bn';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

export const translations: Translations = {
    en: {
        // General
        'app_name': 'DigiDhan',
        'tagline': 'Secure Payments, Anywhere.',
        'cancel': 'Cancel',
        'save': 'Save',
        'back': 'Back',
        'success': 'Success',
        'error': 'Error',
        'loading': 'Loading...',

        // Auth & Onboarding
        'sign_in': 'Sign In',
        'create_account': 'Create Account',
        'forgot_password': 'Forgot Password?',
        'email_address': 'Email Address',
        'password': 'Password',
        'email_placeholder': 'name@example.com',
        'password_placeholder': 'Enter your password',
        'dont_have_account': "Don't have an account?",
        'already_have_account': 'Already have an account?',
        'terms_privacy': 'By continuing, you agree to our Terms & Privacy Policy',
        'verify_email': 'Verify Email',
        'send_code': 'Send Verification Code',
        'full_name': 'Full Name',
        'mobile_number': 'Mobile Number',
        'dob': 'Date of Birth',
        'confirm_password': 'Confirm Password',

        // Navigation
        'nav_home': 'Home',
        'nav_pay': 'Pay',
        'nav_receive': 'Receive',
        'nav_activity': 'Activity',
        'nav_wallet': 'Wallet',
        'nav_profile': 'Profile',

        // Home Dashboard
        'welcome_back': 'Welcome back',
        'bank_balance': 'Bank Balance',
        'add_bank': 'Add Bank Account',
        'quick_actions': 'Quick Actions',
        'scan_pay': 'Scan & Pay',
        'send_money': 'Send Money',
        'receive_money': 'Receive Money',
        'check_balance': 'Check Balance',
        'bills_recharges': 'Bills & Recharges',
        'mobile_recharge': 'Mobile',
        'dth': 'DTH',
        'electricity': 'Electricity',
        'broadband': 'Broadband',
        'recent_transactions': 'Recent Transactions',
        'view_all': 'View All',

        // Profile & Settings
        'settings': 'Settings',
        'account_info': 'Account Information',
        'upi_id': 'UPI ID',
        'phone': 'Phone',
        'preferences': 'Preferences',
        'dark_mode': 'Dark Mode',
        'language': 'Language',
        'help_support': 'Help & Support',
        'logout': 'Logout',
        'select_language': 'Select Language',
        'edit_profile': 'Edit Profile',

        // Wallet
        'offline_wallet': 'Offline Wallet',
        'wallet_balance': 'Wallet Balance',
        'load_cash': 'Load Cash',
        'sync_now': 'Sync Now',

        // Transactions
        'sent': 'Sent',
        'received': 'Received',
        'failed': 'Failed',
        'pending': 'Pending',
        'to': 'To',
        'from': 'From',
        'amount': 'Amount',
        'note': 'Note (Optional)',
        'pay_now': 'Pay Now',
    },

    hi: {
        // General
        'app_name': 'डिजीधन',
        'tagline': 'सुरक्षित भुगतान, कहीं भी।',
        'cancel': 'रद्द करें',
        'save': 'सहेजें',
        'back': 'पीछे',
        'success': 'सफलता',
        'error': 'त्रुटि',
        'loading': 'लोड हो रहा है...',

        // Auth & Onboarding
        'sign_in': 'साइन इन करें',
        'create_account': 'खाता बनाएँ',
        'forgot_password': 'पासवर्ड भूल गए?',
        'email_address': 'ईमेल पता',
        'password': 'पासवर्ड',
        'email_placeholder': 'नाम@उदाहरण.com',
        'password_placeholder': 'अपना पासवर्ड दर्ज करें',
        'dont_have_account': 'क्या आपके पास खाता नहीं है?',
        'already_have_account': 'क्या आपके पास पहले से खाता है?',
        'terms_privacy': 'जारी रखकर, आप हमारी नियम एवं गोपनीयता नीति से सहमत हैं',
        'verify_email': 'ईमेल सत्यापित करें',
        'send_code': 'सत्यापन कोड भेजें',
        'full_name': 'पूरा नाम',
        'mobile_number': 'मोबाइल नंबर',
        'dob': 'जन्म तिथि',
        'confirm_password': 'पासवर्ड की पुष्टि करें',

        // Navigation
        'nav_home': 'मुख्य पृष्ठ',
        'nav_pay': 'भुगतान',
        'nav_receive': 'प्राप्त करें',
        'nav_activity': 'गतिविधि',
        'nav_wallet': 'बटुआ',
        'nav_profile': 'प्रोफ़ाइल',

        // Home Dashboard
        'welcome_back': 'वापसी पर स्वागत है',
        'bank_balance': 'बैंक बैलेंस',
        'add_bank': 'बैंक खाता जोड़ें',
        'quick_actions': 'त्वरित कार्रवाई',
        'scan_pay': 'स्कैन व पे',
        'send_money': 'पैसे भेजें',
        'receive_money': 'पैसे प्राप्त करें',
        'check_balance': 'बैलेंस जांचें',
        'bills_recharges': 'बिल और रिचार्ज',
        'mobile_recharge': 'मोबाइल',
        'dth': 'डीटीएच (DTH)',
        'electricity': 'बिजली',
        'broadband': 'ब्रॉडबैंड',
        'recent_transactions': 'हाल ही का लेन-देन',
        'view_all': 'सभी देखें',

        // Profile & Settings
        'settings': 'सेटिंग्स',
        'account_info': 'खाता जानकारी',
        'upi_id': 'यूपीआई आईडी',
        'phone': 'फ़ोन',
        'preferences': 'प्राथमिकताएं',
        'dark_mode': 'डार्क मोड',
        'language': 'भाषा',
        'help_support': 'मदद और समर्थन',
        'logout': 'लॉग आउट',
        'select_language': 'भाषा चुनें',
        'edit_profile': 'प्रोफ़ाइल संपादित करें',

        // Wallet
        'offline_wallet': 'ऑफ़लाइन बटुआ',
        'wallet_balance': 'बटुआ बैलेंस',
        'load_cash': 'नकद लोड करें',
        'sync_now': 'अभी सिंक करें',

        // Transactions
        'sent': 'भेजा गया',
        'received': 'प्राप्त किया',
        'failed': 'विफल',
        'pending': 'लंबित',
        'to': 'को',
        'from': 'से',
        'amount': 'रकम',
        'note': 'नोट (वैकल्पिक)',
        'pay_now': 'अभी भुगतान करें',
    },

    bn: {
        // General
        'app_name': 'ডিজিধান',
        'tagline': 'নিরাপদ পেমেন্ট, যেকোনো জায়গায়।',
        'cancel': 'বাতিল করুন',
        'save': 'সংরক্ষণ করুন',
        'back': 'ফিরে যান',
        'success': 'সফল',
        'error': 'ত্রুটি',
        'loading': 'লোড হচ্ছে...',

        // Auth & Onboarding
        'sign_in': 'লগ ইন করুন',
        'create_account': 'অ্যাকাউন্ট তৈরি করুন',
        'forgot_password': 'পাসওয়ার্ড ভুলে গেছেন?',
        'email_address': 'ইমেইল ঠিকানা',
        'password': 'পাসওয়ার্ড',
        'email_placeholder': 'নাম@উদাহরণ.com',
        'password_placeholder': 'পাসওয়ার্ড লিখুন',
        'dont_have_account': 'অ্যাকাউন্ট নেই?',
        'already_have_account': 'আগেই অ্যাকাউন্ট আছে?',
        'terms_privacy': 'চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের শর্তাবলি ও গোপনীয়তা নীতিতে সম্মত হচ্ছেন',
        'verify_email': 'ইমেইল যাচাই করুন',
        'send_code': 'যাচাইকরণ কোড পাঠান',
        'full_name': 'পুরো নাম',
        'mobile_number': 'মোবাইল নম্বর',
        'dob': 'জন্ম তারিখ',
        'confirm_password': 'পাসওয়ার্ড নিশ্চিত করুন',

        // Navigation
        'nav_home': 'হোম',
        'nav_pay': 'পেমেন্ট',
        'nav_receive': 'গ্রহণ করুন',
        'nav_activity': 'কার্যক্রম',
        'nav_wallet': 'ওয়ালেট',
        'nav_profile': 'প্রোফাইল',

        // Home Dashboard
        'welcome_back': 'স্বাগতম ফিরে আসার জন্য',
        'bank_balance': 'ব্যাংক স্থিতি',
        'add_bank': 'ব্যাংক অ্যাকাউন্ট যোগ করুন',
        'quick_actions': 'দ্রুত পদক্ষেপ',
        'scan_pay': 'স্ক্যান ও পে',
        'send_money': 'টাকা পাঠান',
        'receive_money': 'টাকা গ্রহণ করুন',
        'check_balance': 'ব্যালেন্স চেক করুন',
        'bills_recharges': 'বিল ও রিচার্জ',
        'mobile_recharge': 'মোবাইল',
        'dth': 'ডিটিএইচ (DTH)',
        'electricity': 'বিদ্যুৎ',
        'broadband': 'ব্রডব্যান্ড',
        'recent_transactions': 'সাম্প্রতিক লেনদেন',
        'view_all': 'সব দেখুন',

        // Profile & Settings
        'settings': 'সেটিংস',
        'account_info': 'অ্যাকাউন্টের তথ্য',
        'upi_id': 'ইউপিআই আইডি',
        'phone': 'ফোন',
        'preferences': 'পছন্দসমূহ',
        'dark_mode': 'ডার্ক মোড',
        'language': 'ভাষা',
        'help_support': 'সাহায্য ও সমর্থন',
        'logout': 'লগ আউট',
        'select_language': 'ভাষা নির্বাচন করুন',
        'edit_profile': 'প্রোফাইল সম্পাদন করুন',

        // Wallet
        'offline_wallet': 'অফলাইন ওয়ালেট',
        'wallet_balance': 'ওয়ালেট ব্যালেন্স',
        'load_cash': 'টাকা লোড করুন',
        'sync_now': 'সিঙ্ক করুন',

        // Transactions
        'sent': 'পাঠানো হয়েছে',
        'received': 'গৃহীত',
        'failed': 'ব্যর্থ',
        'pending': 'অপেক্ষমান',
        'to': 'প্রাপক',
        'from': 'প্রেরক',
        'amount': 'পরিমাণ',
        'note': 'নোট (ঐচ্ছিক)',
        'pay_now': 'পেমেন্ট করুন',
    }
};

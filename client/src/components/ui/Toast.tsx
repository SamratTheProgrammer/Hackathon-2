import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Animated, Text, View, Platform } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const COLORS = {
    success: { bg: '#10B981', icon: '#FFFFFF' },
    error: { bg: '#EF4444', icon: '#FFFFFF' },
    warning: { bg: '#F59E0B', icon: '#FFFFFF' },
    info: { bg: '#3B82F6', icon: '#FFFFFF' },
};

const ToastItem = ({ message, type, onHide }: { message: string; type: ToastType; onHide: () => void }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;
    const Icon = ICONS[type];
    const color = COLORS[type];

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
            ]).start(() => onHide());
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY }],
                backgroundColor: color.bg,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
            }}
        >
            <Icon size={20} color={color.icon} />
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 10, flex: 1 }}>
                {message}
            </Text>
        </Animated.View>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const counterRef = useRef(0);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++counterRef.current;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View
                style={{
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? 60 : 40,
                    left: 16,
                    right: 16,
                    zIndex: 9999,
                    alignItems: 'center',
                }}
                pointerEvents="none"
            >
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onHide={() => removeToast(toast.id)}
                    />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

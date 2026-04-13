'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthModalContextType {
    isOpen: boolean;
    mode: 'login' | 'signup';
    openLogin: () => void;
    openSignup: () => void;
    close: () => void;
    setMode: (mode: 'login' | 'signup') => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
    isOpen: false,
    mode: 'login',
    openLogin: () => {},
    openSignup: () => {},
    close: () => {},
    setMode: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const openLogin = useCallback(() => { setMode('login'); setIsOpen(true); }, []);
    const openSignup = useCallback(() => { setMode('signup'); setIsOpen(true); }, []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <AuthModalContext.Provider value={{ isOpen, mode, openLogin, openSignup, close, setMode }}>
            {children}
        </AuthModalContext.Provider>
    );
}

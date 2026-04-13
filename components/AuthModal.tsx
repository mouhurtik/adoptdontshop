'use client';

import { useEffect, useCallback, Suspense } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '@/contexts/AuthModalContext';
import dynamic from 'next/dynamic';

// Lazy load the form components to avoid large initial bundle
const LoginForm = dynamic(() => import('@/app/login/LoginForm'), { ssr: false });
const SignupForm = dynamic(() => import('@/app/signup/SignupForm'), { ssr: false });

export default function AuthModal() {
    const { isOpen, mode, close, setMode } = useAuthModal();

    // Close on escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
    }, [close]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-playful-cream rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto relative"
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={close}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-gray-700 shadow-sm transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Tab Switcher */}
                            <div className="sticky top-0 z-10 bg-playful-cream pt-4 px-6">
                                <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                    <button
                                        onClick={() => setMode('login')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                                            mode === 'login'
                                                ? 'bg-playful-coral text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setMode('signup')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                                            mode === 'signup'
                                                ? 'bg-playful-teal text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            {/* Form Content — reuses existing forms but in modal context */}
                            <div className="auth-modal-content">
                                <Suspense fallback={
                                    <div className="flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-3 border-playful-coral/30 border-t-playful-coral rounded-full animate-spin" />
                                    </div>
                                }>
                                    {mode === 'login' ? <LoginForm /> : <SignupForm />}
                                </Suspense>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Heart, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    redirectPath?: string;
}

export default function AuthPromptModal({
    isOpen,
    onClose,
    message = 'Sign in to save your favorites and access all features!',
    redirectPath,
}: AuthPromptModalProps) {
    const router = useRouter();

    const handleSignIn = () => {
        onClose();
        const redirect = redirectPath || window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full text-center border-2 border-gray-100"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className="relative inline-flex items-center justify-center mb-5">
                            <div className="w-16 h-16 bg-playful-coral/10 rounded-full flex items-center justify-center">
                                <PawPrint className="w-8 h-8 text-playful-coral fill-current" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-playful-yellow rounded-full flex items-center justify-center shadow-sm">
                                <Heart className="w-4 h-4 text-playful-coral fill-current" />
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-xl font-heading font-black text-playful-text mb-2">
                            Hold on! 🐾
                        </h3>
                        <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <PrimaryButton
                                onClick={handleSignIn}
                                className="w-full justify-center"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Sign In
                            </PrimaryButton>
                            <Link href="/signup" onClick={onClose}>
                                <button className="w-full text-sm font-bold text-gray-400 hover:text-playful-coral transition-colors py-2">
                                    Create an account
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

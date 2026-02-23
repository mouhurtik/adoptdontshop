'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    loading = false,
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: {
            icon: <Trash2 className="w-6 h-6 text-red-500" />,
            iconBg: 'bg-red-50',
            confirmClass: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
            iconBg: 'bg-amber-50',
            confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500',
        },
        default: {
            icon: <AlertTriangle className="w-6 h-6 text-playful-coral" />,
            iconBg: 'bg-playful-coral/10',
            confirmClass: '',
        },
    };

    const style = variantStyles[variant];

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

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full text-center border-2 border-gray-100"
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-14 h-14 ${style.iconBg} rounded-full mb-4`}>
                            {style.icon}
                        </div>

                        {/* Text */}
                        <h3 className="text-lg font-heading font-black text-playful-text mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-3 px-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {cancelLabel}
                            </button>
                            {variant === 'default' ? (
                                <PrimaryButton
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 justify-center"
                                >
                                    {loading ? 'Processing...' : confirmLabel}
                                </PrimaryButton>
                            ) : (
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 ${style.confirmClass}`}
                                >
                                    {loading ? 'Processing...' : confirmLabel}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

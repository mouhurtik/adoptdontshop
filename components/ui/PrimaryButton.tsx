import React from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
    className?: string;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-heading font-bold leading-none rounded-full transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-playful-coral text-white hover:bg-playful-coral/90 shadow-md border-b-4 border-playful-coral/50 active:border-b-0 active:translate-y-1",
            secondary: "bg-playful-teal text-white hover:bg-playful-teal/90 shadow-md border-b-4 border-playful-teal/50 active:border-b-0 active:translate-y-1",
            accent: "bg-playful-yellow text-playful-text hover:bg-playful-yellow/90 shadow-md border-b-4 border-yellow-600/20 active:border-b-0 active:translate-y-1",
            outline: "bg-white border-2 border-playful-coral text-playful-coral hover:bg-playful-coral/10",
            ghost: "bg-transparent text-playful-text hover:bg-playful-lavender/50 hover:text-playful-coral",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-2.5 text-base",
            lg: "px-8 py-3.5 text-lg",
            icon: "h-10 w-10 p-2 flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;




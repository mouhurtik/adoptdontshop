'use client';

import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    mode?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "pop";
    delay?: number;
    duration?: number;
    className?: string;
    viewport?: UseInViewOptions;
    staggerChildren?: number;
}

const ScrollReveal = ({
    children,
    width = "fit-content",
    mode = "fade-up",
    delay = 0,
    duration = 0.4,
    className = "",
    viewport = { once: true, amount: 0.1 },
    staggerChildren: _staggerChildren = 0
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    // Default to mobile (no animation) for SSR — crawlers see full-opacity content
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    // Mobile: render children directly — no animation, no opacity:0
    if (!isDesktop) {
        return (
            <div className={`relative ${className}`} style={{ width }}>
                {children}
            </div>
        );
    }

    const getVariants = () => {
        const variants = {
            hidden: {},
            visible: {},
        };

        switch (mode) {
            case "fade-up":
                variants.hidden = { opacity: 0, y: 20 };
                variants.visible = { opacity: 1, y: 0 };
                break;
            case "fade-in":
                variants.hidden = { opacity: 0 };
                variants.visible = { opacity: 1 };
                break;
            case "slide-left":
                variants.hidden = { opacity: 0, x: -20 };
                variants.visible = { opacity: 1, x: 0 };
                break;
            case "slide-right":
                variants.hidden = { opacity: 0, x: 20 };
                variants.visible = { opacity: 1, x: 0 };
                break;
            case "pop":
                variants.hidden = { opacity: 0, scale: 0.9 };
                variants.visible = { opacity: 1, scale: 1 };
                break;
            default:
                variants.hidden = { opacity: 0, y: 20 };
                variants.visible = { opacity: 1, y: 0 };
        }

        return variants;
    };

    const variants = getVariants();

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration, delay, ease: "easeOut" }}
            className={`relative ${className}`}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;

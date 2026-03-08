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

    const getDesktopVariants = () => {
        switch (mode) {
            case "fade-up":
                return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
            case "fade-in":
                return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
            case "slide-left":
                return { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
            case "slide-right":
                return { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } };
            case "pop":
                return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
            default:
                return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
        }
    };

    // Mobile/SSR: empty variants = no style changes = content at full opacity
    // Desktop: real animation variants
    const variants = isDesktop
        ? getDesktopVariants()
        : { hidden: {}, visible: {} };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: isDesktop ? duration : 0, delay: isDesktop ? delay : 0, ease: "easeOut" }}
            className={`relative ${className}`}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;

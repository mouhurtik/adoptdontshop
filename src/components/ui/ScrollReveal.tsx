import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef, ReactNode } from "react";

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
    staggerChildren = 0
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

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
            className={`${className}`}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;

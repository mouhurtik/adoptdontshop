import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
    children: ReactNode;
    bgImage?: string;
    bgClassName?: string;
    overlayOpacity?: number;
    speed?: number; // 0 to 1, higher is "closer" (moves faster)
    className?: string;
}

const ParallaxSection = ({
    children,
    bgImage,
    bgClassName = "bg-gray-900",
    overlayOpacity = 0.5,
    speed: _speed = 0.5,
    className = ""
}: ParallaxSectionProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Translate Y based on scroll.
    // Negative y moves content UP slower than scroll (or down relative to viewport) creating depth.
    const _y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    // For background element, we often want it to move slower than foreground.
    const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section
            ref={ref}
            className={`relative overflow-hidden ${className}`}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    style={{ y: bgY }}
                    className={`absolute inset-0 w-full h-[120%] -top-[10%] ${bgClassName}`}
                >
                    {bgImage && (
                        <img
                            src={bgImage}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    )}
                </motion.div>
                <div
                    className="absolute inset-0 bg-black z-10"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* Content Layer */}
            <div className="relative z-20 container mx-auto px-4 h-full">
                {children}
            </div>
        </section>
    );
};

export default ParallaxSection;

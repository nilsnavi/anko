import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInWhenVisibleProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    className?: string;
    once?: boolean;
}

export const FadeInWhenVisible: React.FC<FadeInWhenVisibleProps> = ({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    distance = 30,
    className = '',
    once = true,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-50px' });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: distance };
            case 'down':
                return { y: -distance };
            case 'left':
                return { x: distance };
            case 'right':
                return { x: -distance };
            case 'none':
            default:
                return {};
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...getInitialPosition() }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] as const,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

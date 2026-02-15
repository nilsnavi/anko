import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
    once = true,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-50px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
    children,
    className = '',
    direction = 'up',
}) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 30 };
            case 'down':
                return { y: -30 };
            case 'left':
                return { x: 30 };
            case 'right':
                return { x: -30 };
            default:
                return { y: 30 };
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, ...getInitialPosition() },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
};

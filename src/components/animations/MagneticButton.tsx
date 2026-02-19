import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
    as?: 'button' | 'a' | 'div';
    href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    strength = 0.3,
    as: Component = 'button',
    href,
}) => {
    const buttonRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const button = buttonRef.current;
        const content = contentRef.current;
        if (!button || !content) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;

            // Magnetic effect for button
            gsap.to(button, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out',
            });

            // Slightly stronger effect for content
            gsap.to(content, {
                x: x * strength * 0.5,
                y: y * strength * 0.5,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });

            gsap.to(content, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });

            setIsHovered(false);
        };

        const handleMouseEnter = () => {
            setIsHovered(true);
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
            button.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [strength]);

    const baseClasses = `relative inline-flex items-center justify-center overflow-hidden transition-colors duration-300 ${className}`;

    const props = {
        ref: buttonRef,
        className: baseClasses,
        onClick,
        ...(Component === 'a' && href ? { href } : {}),
    };

    return React.createElement(
        Component,
        props,
        <>
            {/* Hover background effect */}
            <span
                className={`absolute inset-0 bg-white/10 transition-transform duration-500 ${isHovered ? 'scale-100' : 'scale-0'
                    }`}
                style={{ borderRadius: 'inherit' }}
            />
            <span ref={contentRef} className="relative z-10">
                {children}
            </span>
        </>
    );
};

// Magnetic wrapper for multiple elements
interface MagneticWrapperProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
    children,
    className = '',
    strength = 0.2,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;

            gsap.to(wrapper, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(wrapper, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            wrapper.removeEventListener('mousemove', handleMouseMove);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={wrapperRef} className={className}>
            {children}
        </div>
    );
};

// Magnetic social icon
interface MagneticIconProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
}

export const MagneticIcon: React.FC<MagneticIconProps> = ({
    children,
    className = '',
    onClick,
    href,
}) => {
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const icon = iconRef.current;
        if (!icon) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(icon, {
                x: x * 0.4,
                y: y * 0.4,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(icon, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        icon.addEventListener('mousemove', handleMouseMove);
        icon.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            icon.removeEventListener('mousemove', handleMouseMove);
            icon.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const content = (
        <div
            ref={iconRef}
            onClick={onClick}
            className={`cursor-pointer transition-colors ${className}`}
        >
            {children}
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
};

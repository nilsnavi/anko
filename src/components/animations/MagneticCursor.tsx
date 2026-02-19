import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MagneticCursorProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    radius?: number;
}

export const MagneticCursor: React.FC<MagneticCursorProps> = ({
    children,
    className = '',
    strength = 0.3,
    radius = 100,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const cursor = cursorRef.current;
        if (!container || !cursor) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < radius) {
                setIsHovering(true);
                const pullStrength = (1 - distance / radius) * strength;

                gsap.to(cursor, {
                    x: distanceX * pullStrength,
                    y: distanceY * pullStrength,
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            } else {
                setIsHovering(false);
                gsap.to(cursor, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)',
                });
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
            gsap.to(cursor, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength, radius]);

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            <div
                ref={cursorRef}
                className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    width: '100%',
                    height: '100%',
                }}
            />
            {children}
        </div>
    );
};

// Magnetic element that follows cursor
interface MagneticElementProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}

export const MagneticElement: React.FC<MagneticElementProps> = ({
    children,
    className = '',
    strength = 0.3,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;

            gsap.to(element, {
                x: distanceX * strength,
                y: distanceY * strength,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={elementRef} className={`inline-block ${className}`}>
            {children}
        </div>
    );
};

// Custom cursor follower
interface CustomCursorProps {
    className?: string;
    size?: number;
    color?: string;
    blendMode?: 'normal' | 'difference' | 'exclusion';
}

export const CustomCursor: React.FC<CustomCursorProps> = ({
    className = '',
    size = 20,
    color = '#0ea5e9',
    blendMode = 'difference',
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const handleMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX - size / 2,
                y: e.clientY - size / 2,
                duration: 0.1,
                ease: 'power2.out',
            });
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [size]);

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                } ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                mixBlendMode: blendMode,
            }}
        />
    );
};

// Magnetic social links
interface MagneticSocialProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    className?: string;
}

export const MagneticSocial: React.FC<MagneticSocialProps> = ({
    href,
    icon,
    label,
    className = '',
}) => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const link = linkRef.current;
        if (!link) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(link, {
                x: x * 0.3,
                y: y * 0.3,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(link, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)',
            });
        };

        link.addEventListener('mousemove', handleMouseMove);
        link.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            link.removeEventListener('mousemove', handleMouseMove);
            link.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <a
            ref={linkRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-600 transition-colors ${className}`}
            aria-label={label}
        >
            {icon}
        </a>
    );
};

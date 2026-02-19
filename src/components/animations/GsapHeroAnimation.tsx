import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GsapHeroAnimationProps {
    children: React.ReactNode;
}

export const GsapHeroAnimation: React.FC<GsapHeroAnimationProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial animation timeline
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Animate content elements with stagger
            tl.fromTo(
                '.gsap-hero-badge',
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8 }
            )
                .fromTo(
                    '.gsap-hero-title',
                    { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
                    { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1 },
                    '-=0.4'
                )
                .fromTo(
                    '.gsap-hero-subtitle',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    '-=0.6'
                )
                .fromTo(
                    '.gsap-hero-buttons',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.4'
                );

            // Parallax effect on scroll
            gsap.to('.gsap-hero-bg', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Content fade out on scroll
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '50% top',
                    scrub: true,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {children}
        </div>
    );
};

// Hook for text reveal animation
export const useTextReveal = () => {
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        const chars = textRef.current.innerText.split('');
        textRef.current.innerHTML = chars
            .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('');

        gsap.fromTo(
            textRef.current.querySelectorAll('span'),
            { opacity: 0, y: 50, rotateX: -90 },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: 'back.out(1.7)',
            }
        );
    }, []);

    return textRef;
};

// Component for staggered children animation
interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const GsapStaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.gsap-stagger-item',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: staggerDelay,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [staggerDelay]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
};

// Magnetic button effect
interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <button ref={buttonRef} className={className}>
            {children}
        </button>
    );
};

// Counter animation
interface CounterAnimationProps {
    end: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
    end,
    duration = 2,
    suffix = '',
    className = '',
}) => {
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!counterRef.current) return;

        const obj = { value: 0 };

        gsap.to(obj, {
            value: end,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: counterRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.textContent = Math.round(obj.value) + suffix;
                }
            },
        });
    }, [end, duration]);

    return <span ref={counterRef} className={className}>0{suffix}</span>;
};

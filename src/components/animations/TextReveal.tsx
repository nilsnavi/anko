import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    stagger?: number;
    duration?: number;
    once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
    children,
    className = '',
    delay = 0,
    stagger = 0.03,
    duration = 0.6,
    once = true,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const chars = containerRef.current?.querySelectorAll('.char');
            if (!chars) return;

            gsap.fromTo(
                chars,
                {
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration,
                    stagger,
                    delay,
                    ease: 'back.out(1.7)',
                    scrollTrigger: once
                        ? {
                            trigger: containerRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        }
                        : undefined,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [children, delay, stagger, duration, once]);

    const words = children.split(' ');

    return (
        <span ref={containerRef} className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                    {word.split('').map((char, charIndex) => (
                        <span
                            key={charIndex}
                            className="char inline-block"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </span>
    );
};

// Word by word reveal
interface WordRevealProps {
    children: string;
    className?: string;
    delay?: number;
    stagger?: number;
    duration?: number;
}

export const WordReveal: React.FC<WordRevealProps> = ({
    children,
    className = '',
    delay = 0,
    stagger = 0.1,
    duration = 0.8,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const words = containerRef.current?.querySelectorAll('.word');
            if (!words) return;

            gsap.fromTo(
                words,
                {
                    opacity: 0,
                    y: 30,
                    filter: 'blur(10px)',
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration,
                    stagger,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [children, delay, stagger, duration]);

    const words = children.split(' ');

    return (
        <span ref={containerRef} className={`inline-block ${className}`}>
            {words.map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em]">
                    {word}
                </span>
            ))}
        </span>
    );
};

// Line reveal with mask
interface LineRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
    children,
    className = '',
    delay = 0,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                {
                    clipPath: 'inset(0 100% 0 0)',
                },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1,
                    delay,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [delay]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
};

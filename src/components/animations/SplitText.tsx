import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
    children: string;
    className?: string;
    wordClassName?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    animation?: 'fadeUp' | 'fadeIn' | 'scale' | 'rotate';
}

export const SplitText: React.FC<SplitTextProps> = ({
    children,
    className = '',
    wordClassName = '',
    stagger = 0.08,
    duration = 0.6,
    delay = 0,
    once = true,
    animation = 'fadeUp',
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const words = containerRef.current.querySelectorAll('.split-word');
        if (words.length === 0) return;

        const getInitialState = () => {
            switch (animation) {
                case 'fadeUp':
                    return { opacity: 0, y: 30 };
                case 'fadeIn':
                    return { opacity: 0 };
                case 'scale':
                    return { opacity: 0, scale: 0.5 };
                case 'rotate':
                    return { opacity: 0, rotateX: -90 };
                default:
                    return { opacity: 0, y: 30 };
            }
        };

        const getFinalState = () => {
            switch (animation) {
                case 'fadeUp':
                    return { opacity: 1, y: 0 };
                case 'fadeIn':
                    return { opacity: 1 };
                case 'scale':
                    return { opacity: 1, scale: 1 };
                case 'rotate':
                    return { opacity: 1, rotateX: 0 };
                default:
                    return { opacity: 1, y: 0 };
            }
        };

        const ctx = gsap.context(() => {
            gsap.fromTo(
                words,
                getInitialState(),
                {
                    ...getFinalState(),
                    duration,
                    stagger,
                    delay,
                    ease: 'power3.out',
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
    }, [children, stagger, duration, delay, animation, once]);

    const words = children.split(' ');

    return (
        <span
            ref={containerRef}
            className={`inline-block ${className}`}
            style={{ perspective: animation === 'rotate' ? '1000px' : undefined }}
        >
            {words.map((word, index) => (
                <span
                    key={index}
                    className={`split-word inline-block mr-[0.25em] ${wordClassName}`}
                    style={{ transformStyle: animation === 'rotate' ? 'preserve-3d' : undefined }}
                >
                    {word}
                </span>
            ))}
        </span>
    );
};

// Line by line reveal
interface LineRevealTextProps {
    children: string;
    className?: string;
    lineClassName?: string;
    stagger?: number;
    duration?: number;
}

export const LineRevealText: React.FC<LineRevealTextProps> = ({
    children,
    className = '',
    lineClassName = '',
    stagger = 0.1,
    duration = 0.8,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const lines = containerRef.current.querySelectorAll('.reveal-line');
        if (lines.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                lines,
                {
                    opacity: 0,
                    y: 20,
                    clipPath: 'inset(100% 0 0 0)',
                },
                {
                    opacity: 1,
                    y: 0,
                    clipPath: 'inset(0% 0 0 0)',
                    duration,
                    stagger,
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
    }, [children, stagger, duration]);

    const lines = children.split('\n');

    return (
        <div ref={containerRef} className={className}>
            {lines.map((line, index) => (
                <div
                    key={index}
                    className={`reveal-line ${lineClassName}`}
                    style={{ overflow: 'hidden' }}
                >
                    {line}
                </div>
            ))}
        </div>
    );
};

// Highlight text animation
interface HighlightTextProps {
    children: string;
    highlightWords: string[];
    className?: string;
    highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
    children,
    highlightWords,
    className = '',
    highlightClassName = 'text-brand-600',
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const highlights = containerRef.current.querySelectorAll('.highlight-word');
        if (highlights.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                highlights,
                { backgroundSize: '0% 100%' },
                {
                    backgroundSize: '100% 100%',
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [children, highlightWords]);

    const words = children.split(' ');

    return (
        <span ref={containerRef} className={className}>
            {words.map((word, index) => {
                const isHighlight = highlightWords.some(
                    hw => word.toLowerCase().includes(hw.toLowerCase())
                );
                return (
                    <span key={index}>
                        {isHighlight ? (
                            <span
                                className={`highlight-word ${highlightClassName}`}
                                style={{
                                    backgroundImage: 'linear-gradient(currentColor, currentColor)',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: '0 100%',
                                    backgroundSize: '0% 40%',
                                    paddingBottom: '2px',
                                }}
                            >
                                {word}
                            </span>
                        ) : (
                            word
                        )}
                        {index < words.length - 1 && ' '}
                    </span>
                );
            })}
        </span>
    );
};

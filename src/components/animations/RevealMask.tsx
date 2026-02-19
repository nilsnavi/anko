import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealMaskProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'diagonal' | 'circle';
    duration?: number;
    delay?: number;
    once?: boolean;
}

export const RevealMask: React.FC<RevealMaskProps> = ({
    children,
    className = '',
    direction = 'left',
    duration = 1,
    delay = 0,
    once = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const getInitialClipPath = () => {
            switch (direction) {
                case 'left':
                    return 'inset(0 100% 0 0)';
                case 'right':
                    return 'inset(0 0 0 100%)';
                case 'top':
                    return 'inset(100% 0 0 0)';
                case 'bottom':
                    return 'inset(0 0 100% 0)';
                case 'diagonal':
                    return 'polygon(0 0, 0 0, 0 100%, 0 100%)';
                case 'circle':
                    return 'circle(0% at 50% 50%)';
                default:
                    return 'inset(0 100% 0 0)';
            }
        };

        const getFinalClipPath = () => {
            switch (direction) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    return 'inset(0 0% 0 0%)';
                case 'diagonal':
                    return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                case 'circle':
                    return 'circle(150% at 50% 50%)';
                default:
                    return 'inset(0 0% 0 0%)';
            }
        };

        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { clipPath: getInitialClipPath() },
                {
                    clipPath: getFinalClipPath(),
                    duration,
                    delay,
                    ease: 'power3.inOut',
                    scrollTrigger: once
                        ? {
                            trigger: containerRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        }
                        : undefined,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [direction, duration, delay, once]);

    return (
        <div ref={containerRef} className={className}>
            <div ref={contentRef} style={{ clipPath: 'inset(0 100% 0 0)' }}>
                {children}
            </div>
        </div>
    );
};

// Image reveal with overlay wipe
interface ImageRevealProps {
    src: string;
    alt: string;
    className?: string;
    overlayColor?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom';
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
    src,
    alt,
    className = '',
    overlayColor = '#0ea5e9',
    direction = 'left',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !imageRef.current || !overlayRef.current) return;

        const getTransform = () => {
            switch (direction) {
                case 'left':
                    return { x: '-100%' };
                case 'right':
                    return { x: '100%' };
                case 'top':
                    return { y: '-100%' };
                case 'bottom':
                    return { y: '100%' };
                default:
                    return { x: '-100%' };
            }
        };

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

            tl.fromTo(
                imageRef.current,
                { scale: 1.3 },
                { scale: 1, duration: 1.2, ease: 'power3.out' }
            );

            tl.fromTo(
                overlayRef.current,
                { x: '0%', y: '0%' },
                { ...getTransform(), duration: 0.8, ease: 'power3.inOut' },
                0
            );
        }, containerRef);

        return () => ctx.revert();
    }, [direction]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
            <div
                ref={overlayRef}
                className="absolute inset-0"
                style={{ backgroundColor: overlayColor }}
            />
        </div>
    );
};

// Text reveal with line mask
interface TextRevealMaskProps {
    children: string;
    className?: string;
    lineHeight?: number;
}

export const TextRevealMask: React.FC<TextRevealMaskProps> = ({
    children,
    className = '',
    lineHeight = 1.5,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const lines = containerRef.current.querySelectorAll('.text-line');
        if (lines.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                lines,
                {
                    y: '100%',
                    opacity: 0,
                },
                {
                    y: '0%',
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [children]);

    const lines = children.split('\n');

    return (
        <div ref={containerRef} className={className}>
            {lines.map((line, index) => (
                <div
                    key={index}
                    className="overflow-hidden"
                    style={{ lineHeight: `${lineHeight}em` }}
                >
                    <div className="text-line">{line}</div>
                </div>
            ))}
        </div>
    );
};

// Curtain reveal effect
interface CurtainRevealProps {
    children: React.ReactNode;
    className?: string;
    curtainColor?: string;
    direction?: 'horizontal' | 'vertical';
}

export const CurtainReveal: React.FC<CurtainRevealProps> = ({
    children,
    className = '',
    curtainColor = '#0c4a6e',
    direction = 'horizontal',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const curtain1Ref = useRef<HTMLDivElement>(null);
    const curtain2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !curtain1Ref.current || !curtain2Ref.current) return;

        const isHorizontal = direction === 'horizontal';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

            tl.to(curtain1Ref.current, {
                [isHorizontal ? 'x' : 'y']: isHorizontal ? '-100%' : '-100%',
                duration: 0.8,
                ease: 'power3.inOut',
            });

            tl.to(
                curtain2Ref.current,
                {
                    [isHorizontal ? 'x' : 'y']: isHorizontal ? '100%' : '100%',
                    duration: 0.8,
                    ease: 'power3.inOut',
                },
                0
            );
        }, containerRef);

        return () => ctx.revert();
    }, [direction]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {children}
            <div
                ref={curtain1Ref}
                className="absolute inset-0"
                style={{
                    backgroundColor: curtainColor,
                    [direction === 'horizontal' ? 'right' : 'bottom']: '50%',
                }}
            />
            <div
                ref={curtain2Ref}
                className="absolute inset-0"
                style={{
                    backgroundColor: curtainColor,
                    [direction === 'horizontal' ? 'left' : 'top']: '50%',
                }}
            />
        </div>
    );
};

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
    children: React.ReactNode;
    className?: string;
    pinDuration?: string;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
    children,
    className = '',
    pinDuration = '200%',
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: `+=${pinDuration}`,
                pin: true,
                pinSpacing: true,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [pinDuration]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
};

// Horizontal scroll section
interface HorizontalScrollProps {
    children: React.ReactNode;
    className?: string;
    itemsCount?: number;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
    children,
    className = '',
    itemsCount = 3,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !scrollRef.current) return;

        const ctx = gsap.context(() => {
            const scrollWidth = scrollRef.current!.scrollWidth - window.innerWidth;

            gsap.to(scrollRef.current, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: () => `+=${scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [itemsCount]);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div ref={scrollRef} className="flex">
                {children}
            </div>
        </div>
    );
};

// Parallax layers
interface ParallaxLayerProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
    children,
    className = '',
    speed = 0.5,
}) => {
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!layerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(layerRef.current, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: layerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, layerRef);

        return () => ctx.revert();
    }, [speed]);

    return (
        <div ref={layerRef} className={className}>
            {children}
        </div>
    );
};

// Reveal on scroll
interface RevealOnScrollProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    duration?: number;
    delay?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
    children,
    className = '',
    direction = 'up',
    distance = 50,
    duration = 0.8,
    delay = 0,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

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
                default:
                    return { y: distance };
            }
        };

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elementRef.current,
                { opacity: 0, ...getInitialPosition() },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elementRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, elementRef);

        return () => ctx.revert();
    }, [direction, distance, duration, delay]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};

// Stagger reveal container
interface StaggerRevealProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    childClassName?: string;
}

export const StaggerReveal: React.FC<StaggerRevealProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
    childClassName = 'stagger-item',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const items = containerRef.current?.querySelectorAll(`.${childClassName}`);
            if (!items || items.length === 0) return;

            gsap.fromTo(
                items,
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
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [staggerDelay, childClassName]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
};

// Scale reveal
interface ScaleRevealProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
}

export const ScaleReveal: React.FC<ScaleRevealProps> = ({
    children,
    className = '',
    duration = 0.8,
    delay = 0,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elementRef.current,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration,
                    delay,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: elementRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, elementRef);

        return () => ctx.revert();
    }, [duration, delay]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};

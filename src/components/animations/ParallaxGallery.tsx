import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    speed?: number;
    scale?: number;
    style?: React.CSSProperties;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
    src,
    alt,
    className = '',
    speed = 0.5,
    scale = 1.2,
    style,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!containerRef.current || !imageRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(imageRef.current, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [speed]);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`} style={style}>
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={{ transform: `scale(${scale})` }}
            />
        </div>
    );
};

// Parallax gallery with multiple images
interface ParallaxGalleryProps {
    images: {
        src: string;
        alt: string;
        speed?: number;
    }[];
    className?: string;
}

export const ParallaxGallery: React.FC<ParallaxGalleryProps> = ({
    images,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {images.map((image, index) => (
                <ParallaxImage
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    speed={image.speed || 0.3 + index * 0.1}
                    className="absolute"
                    style={{
                        top: `${index * 20}%`,
                        left: `${index * 10}%`,
                        width: `${60 - index * 5}%`,
                        height: '40%',
                        zIndex: images.length - index,
                    }}
                />
            ))}
        </div>
    );
};

// Parallax text layers
interface ParallaxTextProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
    children,
    className = '',
    speed = 0.5,
    direction = 'up',
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const getAnimation = () => {
            switch (direction) {
                case 'up':
                    return { yPercent: -speed * 100 };
                case 'down':
                    return { yPercent: speed * 100 };
                case 'left':
                    return { xPercent: -speed * 100 };
                case 'right':
                    return { xPercent: speed * 100 };
                default:
                    return { yPercent: -speed * 100 };
            }
        };

        const ctx = gsap.context(() => {
            gsap.to(elementRef.current, {
                ...getAnimation(),
                ease: 'none',
                scrollTrigger: {
                    trigger: elementRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, elementRef);

        return () => ctx.revert();
    }, [speed, direction]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};

// Floating elements with parallax
interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    amplitude?: number;
    duration?: number;
    delay?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
    children,
    className = '',
    amplitude = 20,
    duration = 3,
    delay = 0,
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(elementRef.current, {
                y: amplitude,
                duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay,
            });
        }, elementRef);

        return () => ctx.revert();
    }, [amplitude, duration, delay]);

    return (
        <div ref={elementRef} className={className}>
            {children}
        </div>
    );
};

// Depth parallax container
interface DepthParallaxProps {
    children: React.ReactNode;
    layers: {
        element: React.ReactNode;
        depth: number;
    }[];
    className?: string;
}

export const DepthParallax: React.FC<DepthParallaxProps> = ({
    children,
    layers,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            layers.forEach((layerData, index) => {
                const layer = containerRef.current?.querySelector(`[data-depth-layer="${index}"]`);
                if (!layer) return;

                gsap.to(layer, {
                    yPercent: layerData.depth * 50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [layers]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {children}
            {layers.map((layer, index) => (
                <div
                    key={index}
                    data-depth-layer={index}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: -index }}
                >
                    {layer.element}
                </div>
            ))}
        </div>
    );
};

// Horizontal scroll gallery
interface HorizontalScrollGalleryProps {
    children: React.ReactNode[];
    className?: string;
    itemWidth?: string;
}

export const HorizontalScrollGallery: React.FC<HorizontalScrollGalleryProps> = ({
    children,
    className = '',
    itemWidth = '80vw',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !scrollRef.current) return;

        const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;

        const ctx = gsap.context(() => {
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
    }, []);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div ref={scrollRef} className="flex gap-8">
                {children.map((child, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{ width: itemWidth }}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Sticky parallax section
interface StickyParallaxProps {
    children: React.ReactNode;
    background: React.ReactNode;
    className?: string;
    pinDuration?: string;
}

export const StickyParallax: React.FC<StickyParallaxProps> = ({
    children,
    background,
    className = '',
    pinDuration = '200%',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${pinDuration}`,
                pin: contentRef.current,
                pinSpacing: true,
            });
        }, containerRef);

        return () => ctx.revert();
    }, [pinDuration]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="absolute inset-0 z-0">{background}</div>
            <div ref={contentRef} className="relative z-10">
                {children}
            </div>
        </div>
    );
};

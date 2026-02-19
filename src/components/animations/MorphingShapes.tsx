import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Morphing blob shape
interface MorphingBlobProps {
    className?: string;
    colors?: string[];
    duration?: number;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({
    className = '',
    colors = ['#0ea5e9', '#0284c7', '#0369a1'],
    duration = 8,
}) => {
    const blobRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!blobRef.current) return;

        const ctx = gsap.context(() => {
            const paths = blobRef.current?.querySelectorAll('path');
            if (!paths) return;

            // Animate between different blob shapes
            const tl = gsap.timeline({ repeat: -1, yoyo: true });

            const firstPath = paths[0];
            if (!firstPath) return;

            paths.forEach((path, index) => {
                if (index === 0) return;
                const pathData = path.getAttribute('d');
                if (!pathData) return;

                tl.to(firstPath, {
                    attr: { d: pathData },
                    duration: duration / (paths.length - 1),
                    ease: 'power2.inOut',
                });
            });
        }, blobRef);

        return () => ctx.revert();
    }, [duration]);

    return (
        <svg
            ref={blobRef}
            viewBox="0 0 500 500"
            className={`absolute ${className}`}
            style={{ filter: 'blur(40px)', opacity: 0.6 }}
        >
            <defs>
                <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="50%" stopColor={colors[1]} />
                    <stop offset="100%" stopColor={colors[2]} />
                </linearGradient>
            </defs>
            {/* Main visible blob */}
            <path
                fill="url(#blobGradient)"
                d="M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450.5Q159,407,99.5,339Q40,271,40,193Q40,115,109.5,74.5Q179,34,250,34Q321,34,385.5,74.5Q450,115,456.5,192.5Q463,270,440.5,320.5Z"
            />
            {/* Hidden morph targets */}
            <path
                fill="none"
                d="M423.5,312.5Q402,375,347.5,418Q293,461,226,447.5Q159,434,108.5,375.5Q58,317,58,242.5Q58,168,115.5,119.5Q173,71,242,53.5Q311,36,368.5,82.5Q426,129,435.5,204.5Q445,280,423.5,312.5Z"
                style={{ display: 'none' }}
            />
            <path
                fill="none"
                d="M459.5,324.5Q425,399,354,437.5Q283,476,211.5,445Q140,414,93.5,350Q47,286,63.5,213.5Q80,141,137.5,93.5Q195,46,264.5,58.5Q334,71,391,113.5Q448,156,471.5,228Q495,300,459.5,324.5Z"
                style={{ display: 'none' }}
            />
            <path
                fill="none"
                d="M432.5,316.5Q410,383,348.5,419.5Q287,456,220.5,441.5Q154,427,105.5,366.5Q57,306,62.5,232.5Q68,159,123,108.5Q178,58,250,52.5Q322,47,378.5,93Q435,139,444.5,214.5Q454,290,432.5,316.5Z"
                style={{ display: 'none' }}
            />
        </svg>
    );
};

// Animated wave separator
interface WaveSeparatorProps {
    className?: string;
    fillColor?: string;
    flip?: boolean;
}

export const WaveSeparator: React.FC<WaveSeparatorProps> = ({
    className = '',
    fillColor = '#f8fafc',
    flip = false,
}) => {
    const waveRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!waveRef.current) return;

        const ctx = gsap.context(() => {
            const path = waveRef.current?.querySelector('path');
            if (!path) return;

            gsap.to(path, {
                attr: {
                    d: 'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
                },
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }, waveRef);

        return () => ctx.revert();
    }, []);

    return (
        <svg
            ref={waveRef}
            viewBox="0 0 1440 320"
            className={`absolute w-full ${flip ? 'rotate-180' : ''} ${className}`}
            preserveAspectRatio="none"
        >
            <path
                fill={fillColor}
                d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
        </svg>
    );
};

// Animated circle background
interface AnimatedCirclesProps {
    className?: string;
    count?: number;
}

export const AnimatedCircles: React.FC<AnimatedCirclesProps> = ({
    className = '',
    count = 5,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const circles = containerRef.current?.querySelectorAll('.animated-circle');
            if (!circles) return;

            circles.forEach((circle, index) => {
                // Floating animation
                gsap.to(circle, {
                    y: `random(-30, 30)`,
                    x: `random(-20, 20)`,
                    scale: `random(0.9, 1.1)`,
                    duration: `random(3, 5)`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: index * 0.5,
                });

                // Scroll-based parallax
                gsap.to(circle, {
                    yPercent: (index + 1) * 10,
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
    }, [count]);

    const colors = ['bg-brand-200', 'bg-brand-300', 'bg-brand-400', 'bg-brand-500', 'bg-brand-600'];

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`animated-circle absolute rounded-full opacity-20 ${colors[index % colors.length]}`}
                    style={{
                        width: `${Math.random() * 200 + 100}px`,
                        height: `${Math.random() * 200 + 100}px`,
                        left: `${Math.random() * 80}%`,
                        top: `${Math.random() * 80}%`,
                    }}
                />
            ))}
        </div>
    );
};

// Morphing icon
interface MorphingIconProps {
    paths: string[];
    className?: string;
    duration?: number;
    color?: string;
}

export const MorphingIcon: React.FC<MorphingIconProps> = ({
    paths,
    className = '',
    duration = 2,
    color = 'currentColor',
}) => {
    const iconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!iconRef.current || paths.length < 2) return;

        const ctx = gsap.context(() => {
            const path = iconRef.current?.querySelector('path');
            if (!path) return;

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            const firstPathData = paths[0];

            paths.forEach((pathData, index) => {
                if (index === 0 || !path) return;
                tl.to(path, {
                    attr: { d: pathData },
                    duration: duration / (paths.length - 1),
                    ease: 'power2.inOut',
                });
            });

            // Morph back to first shape
            if (path && firstPathData) {
                tl.to(path, {
                    attr: { d: firstPathData },
                    duration: duration / (paths.length - 1),
                    ease: 'power2.inOut',
                });
            }
        }, iconRef);

        return () => ctx.revert();
    }, [paths, duration]);

    return (
        <svg
            ref={iconRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d={paths[0]} />
        </svg>
    );
};

// Liquid button effect
interface LiquidButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
    children,
    className = '',
    onClick,
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        const canvas = canvasRef.current;
        if (!button || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = button.offsetWidth;
            canvas.height = button.offsetHeight;
        };
        resize();

        let animationId: number;
        let time = 0;

        const animate = () => {
            time += 0.02;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw liquid wave
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            for (let x = 0; x <= canvas.width; x += 5) {
                const y =
                    canvas.height / 2 +
                    Math.sin(x * 0.02 + time) * 10 +
                    Math.sin(x * 0.03 + time * 1.5) * 5;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
            gradient.addColorStop(1, 'rgba(2, 132, 199, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fill();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />
            <span className="relative z-10">{children}</span>
        </button>
    );
};

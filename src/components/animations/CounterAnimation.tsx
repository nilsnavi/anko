import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CounterAnimationProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    decimals?: number;
    separator?: string;
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
    end,
    duration = 2,
    suffix = '',
    prefix = '',
    className = '',
    decimals = 0,
    separator = ' ',
}) => {
    const counterRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!counterRef.current || hasAnimated.current) return;

        const ctx = gsap.context(() => {
            const obj = { value: 0 };

            ScrollTrigger.create({
                trigger: counterRef.current,
                start: 'top 85%',
                onEnter: () => {
                    if (hasAnimated.current) return;
                    hasAnimated.current = true;

                    gsap.to(obj, {
                        value: end,
                        duration,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (counterRef.current) {
                                const formatted = formatNumber(obj.value, decimals, separator);
                                counterRef.current.textContent = prefix + formatted + suffix;
                            }
                        },
                    });
                },
            });
        }, counterRef);

        return () => ctx.revert();
    }, [end, duration, decimals, separator, prefix, suffix]);

    const formatNumber = (num: number, decimals: number, separator: string): string => {
        const fixed = num.toFixed(decimals);
        const parts = fixed.split('.');
        if (parts[0]) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        }
        return parts.join('.');
    };

    return (
        <span ref={counterRef} className={className}>
            {prefix}
            {formatNumber(0, decimals, separator)}
            {suffix}
        </span>
    );
};

// Stats card with counter
interface StatsCardProps {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    icon?: React.ReactNode;
    className?: string;
    duration?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    value,
    label,
    suffix = '',
    prefix = '',
    icon,
    className = '',
    duration = 2,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}
        >
            {icon && <div className="text-brand-500 mb-4">{icon}</div>}
            <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                <CounterAnimation end={value} suffix={suffix} prefix={prefix} duration={duration} />
            </div>
            <div className="text-slate-600">{label}</div>
        </div>
    );
};

// Animated progress bar
interface AnimatedProgressProps {
    value: number;
    max?: number;
    className?: string;
    barClassName?: string;
    duration?: number;
    label?: string;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
    value,
    max = 100,
    className = '',
    barClassName = '',
    duration = 1.5,
    label,
}) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const percentage = Math.min((value / max) * 100, 100);

    useEffect(() => {
        if (!barRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                barRef.current,
                { width: '0%' },
                {
                    width: `${percentage}%`,
                    duration,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: progressRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, progressRef);

        return () => ctx.revert();
    }, [percentage, duration]);

    return (
        <div ref={progressRef} className={className}>
            {label && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="text-sm text-slate-500">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    ref={barRef}
                    className={`h-full bg-brand-500 rounded-full ${barClassName}`}
                    style={{ width: '0%' }}
                />
            </div>
        </div>
    );
};

// Count up with suffix animation
interface CountUpProps {
    end: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
    end,
    suffix = '',
    duration = 2,
    className = '',
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current || hasAnimated.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: ref.current,
                start: 'top 85%',
                onEnter: () => {
                    if (hasAnimated.current) return;
                    hasAnimated.current = true;

                    const obj = { value: 0 };
                    gsap.to(obj, {
                        value: end,
                        duration,
                        ease: 'power2.out',
                        onUpdate: () => setCount(Math.round(obj.value)),
                    });
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [end, duration]);

    return (
        <span ref={ref} className={className}>
            {count}
            {suffix}
        </span>
    );
};

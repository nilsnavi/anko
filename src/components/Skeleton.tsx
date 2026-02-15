import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    circle = false,
}) => {
    return (
        <motion.div
            className={`bg-slate-200 ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
            style={{ width, height }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <Skeleton className="w-14 h-14 rounded-xl mb-6" />
            <Skeleton className="w-3/4 h-6 mb-4" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-2/3 h-4" />
        </div>
    );
};

// Service Card Skeleton
export const ServiceCardSkeleton: React.FC = () => {
    return (
        <div className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-slate-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Skeleton className="w-7 h-7" />
            </div>
            <Skeleton className="w-3/4 h-6 mb-3" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-2/3 h-4 mb-6" />
            <Skeleton className="w-24 h-4" />
        </div>
    );
};

// News Card Skeleton
export const NewsCardSkeleton: React.FC = () => {
    return (
        <article className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="w-20 h-5 rounded" />
                    <Skeleton className="w-16 h-4" />
                </div>
                <Skeleton className="w-full h-5 mb-3" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-2/3 h-4 mb-4" />
                <Skeleton className="w-24 h-4" />
            </div>
        </article>
    );
};

// Stats Skeleton
export const StatsSkeleton: React.FC = () => {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" circle />
            <div className="flex-1">
                <Skeleton className="w-24 h-5 mb-2" />
                <Skeleton className="w-32 h-4" />
            </div>
        </div>
    );
};

// Hero Skeleton
export const HeroSkeleton: React.FC = () => {
    return (
        <div className="relative bg-slate-900 text-white pt-24 pb-32 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl">
                    <Skeleton className="w-64 h-8 rounded-full mb-8" />
                    <Skeleton className="w-full h-16 mb-6" />
                    <Skeleton className="w-3/4 h-8 mb-8" />
                    <div className="flex gap-4">
                        <Skeleton className="w-48 h-14 rounded-lg" />
                        <Skeleton className="w-40 h-14 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Grid Skeleton for Services
interface GridSkeletonProps {
    count?: number;
    type?: 'card' | 'service' | 'news';
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
    count = 6,
    type = 'service',
}) => {
    const SkeletonComponent =
        type === 'service'
            ? ServiceCardSkeleton
            : type === 'news'
                ? NewsCardSkeleton
                : CardSkeleton;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};

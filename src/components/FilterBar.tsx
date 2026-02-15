import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Calendar, Tag } from 'lucide-react';

// News Filter Types
export interface NewsFilter {
    category: string | null;
    dateRange: 'all' | 'week' | 'month' | 'year';
}

interface NewsFilterBarProps {
    filters: NewsFilter;
    onChange: (filters: NewsFilter) => void;
    availableCategories: string[];
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
    filters,
    onChange,
    availableCategories,
}) => {
    const categoryLabels: Record<string, string> = {
        'News': 'Новости',
        'Analytics': 'Аналитика',
        'Event': 'События',
    };

    const dateRangeLabels: Record<string, string> = {
        'all': 'Все время',
        'week': 'За неделю',
        'month': 'За месяц',
        'year': 'За год',
    };

    const hasActiveFilters = filters.category || filters.dateRange !== 'all';

    const clearFilters = () => {
        onChange({ category: null, dateRange: 'all' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <Tag size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Категория:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onChange({ ...filters, category: null })}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!filters.category
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Все
                        </button>
                        {availableCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => onChange({ ...filters, category })}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.category === category
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {categoryLabels[category] || category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Период:</span>
                    <select
                        value={filters.dateRange}
                        onChange={(e) =>
                            onChange({ ...filters, dateRange: e.target.value as NewsFilter['dateRange'] })
                        }
                        className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        {Object.entries(dateRangeLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    >
                        <X size={16} />
                        Сбросить
                    </motion.button>
                )}
            </div>
        </div>
    );
};

// Service Filter Types
export interface ServiceFilter {
    category: string | null;
}

interface ServiceFilterBarProps {
    filters: ServiceFilter;
    onChange: (filters: ServiceFilter) => void;
    availableCategories: string[];
}

export const ServiceFilterBar: React.FC<ServiceFilterBarProps> = ({
    filters,
    onChange,
    availableCategories,
}) => {
    const hasActiveFilters = filters.category !== null;

    const clearFilters = () => {
        onChange({ category: null });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Фильтр по категории:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onChange({ category: null })}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.category === null
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Все услуги
                        </button>
                        {availableCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => onChange({ category })}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.category === category
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    >
                        <X size={16} />
                        Сбросить
                    </motion.button>
                )}
            </div>
        </div>
    );
};

// Helper function to filter news
export const filterNews = (
    news: Array<{
        id: number;
        title: string;
        summary: string;
        category: string;
        date: string;
    }>,
    filters: NewsFilter
) => {
    return news.filter((item) => {
        // Category filter
        if (filters.category && item.category !== filters.category) {
            return false;
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
            const itemDate = new Date(item.date);
            const now = new Date();
            const diffTime = now.getTime() - itemDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch (filters.dateRange) {
                case 'week':
                    if (diffDays > 7) return false;
                    break;
                case 'month':
                    if (diffDays > 30) return false;
                    break;
                case 'year':
                    if (diffDays > 365) return false;
                    break;
            }
        }

        return true;
    });
};

// Helper function to filter services (placeholder for future category support)
export const filterServices = <T extends { id: string; title: string; description: string }>(
    services: T[],
    filters: { category: string | null }
): T[] => {
    // Currently returns all services as ServiceItem doesn't have category field
    // This can be extended when categories are added to the data model
    return services;
};
